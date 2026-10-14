import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import {
  actualAttemptCost,
  addDailySpend,
  recoverLegacySpent,
  reserveAttemptBudget,
} from './budget.mjs';
import { createBatchTask, selectTaskBatch, transitionTaskBatch } from './queue.mjs';
import { sourceChangesFromGitOutput, sourceFilesFromGitOutput } from './source.mjs';

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const stateDir = join(process.env.RUNNER_TEMP, 'autodev-state');
const sourceDir = join(process.env.GITHUB_WORKSPACE, 'Battlesword-4.000');
const stateFile = join(stateDir, 'state.json');
const stateBranch = 'automation-state';
const attemptBudget = 3;
const dailyBudget = 5;

if (!repo || !token || !process.env.GITHUB_OUTPUT)
  throw new Error('Missing GitHub Actions configuration');

function git(args, { cwd = stateDir, capture = true } = {}) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  }).trim();
}

const authHeader = `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`;
function gitAuth(args) {
  return git(['-c', `http.https://github.com/.extraheader=${authHeader}`, ...args]);
}

async function openState() {
  await rm(stateDir, { recursive: true, force: true });
  await mkdir(stateDir, { recursive: true });
  git(['init', '-b', stateBranch]);
  git(['remote', 'add', 'origin', `https://github.com/${repo}.git`]);
  try {
    gitAuth(['fetch', '--depth=1', 'origin', stateBranch]);
    git(['checkout', '-B', stateBranch, 'FETCH_HEAD']);
  } catch {
    // An empty state branch is created on the first run.
  }
  let state;
  try {
    state = JSON.parse(await readFile(stateFile, 'utf8'));
  } catch {
    state = {
      version: 1,
      lastDiscoveredSha: null,
      lastCompletedSha: null,
      tasks: {},
      daily: null,
      reservation: null,
    };
  }
  return state;
}

async function saveState(state, message) {
  await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`);
  git(['add', 'state.json']);
  const hasChanges = Boolean(git(['status', '--porcelain']));
  if (!hasChanges) return;
  git(['config', 'user.name', 'github-actions[bot]']);
  git(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  git(['commit', '-m', message]);
  gitAuth(['push', 'origin', stateBranch]);
}

function output(values) {
  const content = Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  execFileSync('bash', ['-c', 'cat >> "$GITHUB_OUTPUT"'], {
    input: `${content}\n`,
    env: process.env,
  });
}

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function sourceFilesAt(sha) {
  return sourceFilesFromGitOutput(
    git(['-c', 'core.quotepath=false', '-C', sourceDir, 'ls-tree', '-r', '--name-only', sha]),
  );
}

function changedSourceFiles(from, to) {
  if (!from) return sourceFilesAt(to).map((path) => ({ path, change: 'initial audit' }));
  const result = git([
    '-c',
    'core.quotepath=false',
    '-C',
    sourceDir,
    'diff',
    '--name-status',
    '-M',
    from,
    to,
  ]);
  return sourceChangesFromGitOutput(result);
}

function blobAt(sha, path) {
  try {
    return git(['-C', sourceDir, 'rev-parse', `${sha}:${path}`]);
  } catch {
    return 'deleted';
  }
}

function taskId(path) {
  return createHash('sha256').update(path).digest('hex').slice(0, 16);
}

function historicalSourceBaseline(sourceSha) {
  const commits = git([
    '-C',
    process.env.GITHUB_WORKSPACE,
    'log',
    '--format=%H',
    '--',
    'Battlesword-4.000',
  ]).split('\n');
  for (const commit of commits) {
    try {
      const sha = git([
        '-C',
        process.env.GITHUB_WORKSPACE,
        'rev-parse',
        `${commit}:Battlesword-4.000`,
      ]);
      if (sha !== sourceSha) return sha;
    } catch {
      // Ignore commits before the submodule was added.
    }
  }
  return git(['-C', process.env.GITHUB_WORKSPACE, 'rev-parse', 'HEAD:Battlesword-4.000']);
}

async function prepare() {
  const state = await openState();
  const today = dayKey();
  if (!state.daily || state.daily.date !== today) state.daily = { date: today, spent: 0 };
  // Recover totals from the earlier implementation that deducted its reservation twice.
  if (state.daily.spent < 0)
    state.daily.spent = recoverLegacySpent(state.daily.spent, attemptBudget);

  if (state.reservation) {
    const interruptedIds = state.reservation.taskIds ?? [state.reservation.taskId];
    for (const id of interruptedIds) {
      const interrupted = Object.values(state.tasks).find((item) => item.id === id);
      if (interrupted?.status === 'running') {
        interrupted.status = interrupted.attempts >= 3 ? 'blocked' : 'queued';
        interrupted.lastError = 'Próba przerwana przez zakończenie lub anulowanie workflow.';
        interrupted.updatedAt = new Date().toISOString();
      }
    }
    if (state.reservation.date === today)
      state.daily.spent = Math.min(
        dailyBudget,
        state.daily.spent + (state.reservation.amount ?? attemptBudget),
      );
    state.reservation = null;
  }

  if (state.pendingDeployment) {
    await saveState(state, 'autodev: resume deployment');
    output({
      has_work: 'true',
      deploy_only: 'true',
      deploy_sha: state.pendingDeployment.sha,
      task_id: state.pendingDeployment.taskId,
      task_ids: (state.pendingDeployment.taskIds ?? [state.pendingDeployment.taskId]).join(','),
    });
    return;
  }

  const sourceSha = process.env.AUTODEV_SOURCE_SHA;
  if (!sourceSha) throw new Error('AUTODEV_SOURCE_SHA is required');
  state.auditBaseSha ??= historicalSourceBaseline(sourceSha);
  const sourceChanges = new Map();
  for (const item of changedSourceFiles(state.lastDiscoveredSha, sourceSha))
    sourceChanges.set(item.path, item.change);
  const auditBaselineSha = state.lastCompletedSha ?? state.auditBaseSha;
  for (const item of changedSourceFiles(auditBaselineSha, sourceSha))
    sourceChanges.set(item.path, item.change);
  for (const path of sourceFilesAt(sourceSha)) {
    if (!state.tasks[path] && !sourceChanges.has(path))
      sourceChanges.set(path, 'initial audit (queue reconciliation)');
  }
  for (const [path, change] of sourceChanges) {
    const digest = blobAt(sourceSha, path);
    const existing = state.tasks[path];
    if (
      existing?.sourceBlob === digest &&
      ['queued', 'running', 'blocked'].includes(existing.status)
    )
      continue;
    if (existing?.sourceBlob === digest && existing.status === 'complete') continue;
    state.tasks[path] = {
      id: taskId(path),
      path,
      sourceBlob: digest,
      sourceSha,
      change,
      status: 'queued',
      attempts: 0,
      updatedAt: new Date().toISOString(),
      reason: change.startsWith('initial audit')
        ? 'Pełny audyt źródła; wpis dodany przy uzgadnianiu kolejki.'
        : `Zmiana ${change} pliku źródłowego od ${auditBaselineSha}.`,
    };
  }
  for (const task of Object.values(state.tasks)) {
    if (task.status === 'queued') task.sourceSha = sourceSha;
  }
  state.lastDiscoveredSha = sourceSha;

  const baselineSha = auditBaselineSha;
  const priorityPaths = changedSourceFiles(baselineSha, sourceSha).map((item) => item.path);
  const catchUp = state.lastCompletedSha !== sourceSha;
  const pendingPriorityCount = Object.values(state.tasks).filter(
    (task) => priorityPaths.includes(task.path) && task.status === 'queued' && task.attempts < 3,
  ).length;
  const batchSize = pendingPriorityCount ? Math.min(2, pendingPriorityCount) : catchUp ? 2 : 1;
  const selected = selectTaskBatch(state.tasks, priorityPaths, batchSize);
  const availableBudget = reserveAttemptBudget(state.daily.spent, dailyBudget, attemptBudget);
  if (selected.length === 0) {
    const pending = Object.values(state.tasks).some((item) => item.status === 'queued');
    const allComplete =
      Object.values(state.tasks).length > 0 &&
      Object.values(state.tasks).every((item) => item.status === 'complete');
    const currentPointer = git([
      '-C',
      process.env.GITHUB_WORKSPACE,
      'rev-parse',
      'HEAD:Battlesword-4.000',
    ]);
    if (allComplete && state.lastCompletedSha === sourceSha && currentPointer !== sourceSha) {
      await saveState(state, 'autodev: source audit complete');
      output({
        has_work: 'true',
        sync_pointer_only: 'true',
        deploy_only: 'false',
        source_sha: sourceSha,
      });
      return;
    }
    await saveState(state, 'autodev: record source scan');
    output({
      has_work: 'false',
      budget_exhausted: String(pending && availableBudget === 0),
    });
    return;
  }
  if (availableBudget === 0) {
    await saveState(state, 'autodev: defer for daily budget');
    output({ has_work: 'false', budget_exhausted: 'true' });
    return;
  }

  const batch = createBatchTask(selected, sourceSha);
  for (const task of selected) {
    task.status = 'running';
    task.attempts++;
    task.startedAt = new Date().toISOString();
  }
  state.reservation = {
    taskId: batch.id,
    taskIds: selected.map((task) => task.id),
    amount: availableBudget,
    date: today,
  };
  await saveState(state, `autodev: start batch ${batch.id}`);
  const taskFile = join(process.env.RUNNER_TEMP, 'autodev-task.json');
  await writeFile(taskFile, JSON.stringify(batch, null, 2));
  output({
    has_work: 'true',
    deploy_only: 'false',
    task_id: batch.id,
    task_ids: selected.map((task) => task.id).join(','),
    task_count: String(selected.length),
    catch_up: String(catchUp),
    task_file: taskFile,
    source_sha: sourceSha,
    available_budget: String(availableBudget),
  });
}

async function finish() {
  const state = await openState();
  const taskIdValue = process.env.AUTODEV_TASK_ID;
  const taskIds =
    state.reservation?.taskId === taskIdValue
      ? (state.reservation.taskIds ?? [taskIdValue])
      : (state.pendingDeployment?.taskIds ??
        [Object.values(state.tasks).find((item) => item.id === taskIdValue)?.id].filter(Boolean));
  const tasks = taskIds.map((id) => Object.values(state.tasks).find((item) => item.id === id));
  const usage = JSON.parse(
    await readFile(process.env.AUTODEV_USAGE_FILE, 'utf8').catch(() => '{"spent":0}'),
  );
  const reservation = state.reservation?.taskId === taskIdValue ? state.reservation : null;
  const actual = actualAttemptCost(usage, reservation?.amount ?? attemptBudget);
  if (reservation) {
    state.reservation = null;
    state.daily.spent = addDailySpend(state.daily.spent, actual, dailyBudget);
  }
  if (tasks.length === 0 || tasks.some((task) => !task))
    throw new Error(`Unknown task batch ${taskIdValue}`);

  const deployedSha = process.env.AUTODEV_DEPLOYED_SHA || '';
  const pushedSha = process.env.AUTODEV_PUSHED_SHA || '';
  const completed = process.env.AUTODEV_JOB_SUCCESS === 'true';
  const changed = process.env.AUTODEV_HAS_CHANGES === 'true';
  const needsDeployment = changed && pushedSha && !deployedSha;
  const status = transitionTaskBatch(tasks, {
    success: completed,
    needsDeployment,
    summary: process.env.AUTODEV_SUMMARY || '',
    error: process.env.AUTODEV_FAILURE_REASON || '',
  });
  if (needsDeployment) {
    state.pendingDeployment = { sha: pushedSha, taskId: taskIdValue, taskIds };
  } else if (completed) {
    if (Object.values(state.tasks).every((item) => item.status === 'complete'))
      state.lastCompletedSha = state.lastDiscoveredSha;
    if (state.pendingDeployment?.taskId === taskIdValue && deployedSha)
      state.pendingDeployment = null;
  }
  await saveState(state, `autodev: ${status} batch ${taskIdValue}`);
}

if (process.argv[2] === 'prepare') await prepare();
else if (process.argv[2] === 'finish') await finish();
else throw new Error('Usage: state.mjs prepare|finish');
