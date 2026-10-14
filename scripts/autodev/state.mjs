import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { actualAttemptCost, addDailySpend, recoverLegacySpent } from './budget.mjs';

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const stateDir = join(process.env.RUNNER_TEMP, 'autodev-state');
const sourceDir = join(process.env.GITHUB_WORKSPACE, 'Battlesword-4.000');
const stateFile = join(stateDir, 'state.json');
const stateBranch = 'automation-state';
const attemptBudget = 2;
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
  return git(['-C', sourceDir, 'ls-tree', '-r', '--name-only', sha])
    .split('\n')
    .filter(Boolean)
    .filter((file) => /\.md$/i.test(file) || ['manifest.me', 'TODO'].includes(file));
}

function changedSourceFiles(from, to) {
  if (!from) return sourceFilesAt(to).map((path) => ({ path, change: 'initial audit' }));
  const output = git(['-C', sourceDir, 'diff', '--name-status', '-M', from, to]);
  return output
    .split('\n')
    .filter(Boolean)
    .flatMap((line) => {
      const [status, first, second] = line.split('\t');
      const paths = status.startsWith('R') ? [first, second] : [first];
      return paths
        .filter((path) => /\.md$/i.test(path) || ['manifest.me', 'TODO'].includes(path))
        .map((path) => ({ path, change: status }));
    });
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

async function prepare() {
  const state = await openState();
  const today = dayKey();
  if (!state.daily || state.daily.date !== today) state.daily = { date: today, spent: 0 };
  // Recover totals from the earlier implementation that deducted its reservation twice.
  if (state.daily.spent < 0)
    state.daily.spent = recoverLegacySpent(state.daily.spent, attemptBudget);

  if (state.reservation) {
    const interrupted = state.tasks[state.reservation.taskId];
    if (interrupted?.status === 'running') {
      interrupted.status = interrupted.attempts >= 3 ? 'blocked' : 'queued';
      interrupted.lastError = 'Próba przerwana przez zakończenie lub anulowanie workflow.';
      interrupted.updatedAt = new Date().toISOString();
    }
    if (state.reservation.date === today)
      state.daily.spent = Math.min(dailyBudget, state.daily.spent + attemptBudget);
    state.reservation = null;
  }

  if (state.pendingDeployment) {
    await saveState(state, 'autodev: resume deployment');
    output({
      has_work: 'true',
      deploy_only: 'true',
      deploy_sha: state.pendingDeployment.sha,
      task_id: state.pendingDeployment.taskId,
    });
    return;
  }

  const sourceSha = process.env.AUTODEV_SOURCE_SHA;
  if (!sourceSha) throw new Error('AUTODEV_SOURCE_SHA is required');
  const sourceChanges = changedSourceFiles(state.lastDiscoveredSha, sourceSha);
  for (const { path, change } of sourceChanges) {
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
      reason: state.lastDiscoveredSha
        ? `Zmiana ${change} pliku źródłowego od ${state.lastDiscoveredSha}.`
        : 'Pierwszy pełny audyt źródła.',
    };
  }
  for (const task of Object.values(state.tasks)) {
    if (task.status === 'queued') task.sourceSha = sourceSha;
  }
  state.lastDiscoveredSha = sourceSha;

  const task = Object.values(state.tasks)
    .filter((item) => item.status === 'queued' && item.attempts < 3)
    .sort((a, b) => a.path.localeCompare(b.path, 'pl'))[0];
  if (!task) {
    const pending = Object.values(state.tasks).some((item) => item.status === 'queued');
    await saveState(state, 'autodev: record source scan');
    output({
      has_work: 'false',
      budget_exhausted: String(pending && state.daily.spent + attemptBudget > dailyBudget),
    });
    return;
  }
  if (state.daily.spent + attemptBudget > dailyBudget) {
    await saveState(state, 'autodev: defer for daily budget');
    output({ has_work: 'false', budget_exhausted: 'true' });
    return;
  }

  task.status = 'running';
  task.attempts++;
  task.startedAt = new Date().toISOString();
  state.reservation = { taskId: task.id, amount: attemptBudget, date: today };
  await saveState(state, `autodev: start ${task.id}`);
  const taskFile = join(process.env.RUNNER_TEMP, 'autodev-task.json');
  await writeFile(taskFile, JSON.stringify(task, null, 2));
  output({
    has_work: 'true',
    deploy_only: 'false',
    task_id: task.id,
    task_file: taskFile,
    source_sha: sourceSha,
    available_budget: String(dailyBudget - state.daily.spent),
  });
}

async function finish() {
  const state = await openState();
  const taskIdValue = process.env.AUTODEV_TASK_ID;
  const task = Object.values(state.tasks).find((item) => item.id === taskIdValue);
  const usage = JSON.parse(
    await readFile(process.env.AUTODEV_USAGE_FILE, 'utf8').catch(() => '{"spent":0}'),
  );
  const actual = actualAttemptCost(usage, attemptBudget);
  if (state.reservation?.taskId === taskIdValue) {
    state.reservation = null;
    state.daily.spent = addDailySpend(state.daily.spent, actual, dailyBudget);
  }
  if (!task) throw new Error(`Unknown task ${taskIdValue}`);

  const deployedSha = process.env.AUTODEV_DEPLOYED_SHA || '';
  const pushedSha = process.env.AUTODEV_PUSHED_SHA || '';
  const completed = process.env.AUTODEV_JOB_SUCCESS === 'true';
  const changed = process.env.AUTODEV_HAS_CHANGES === 'true';
  if (changed && pushedSha && !deployedSha) {
    task.status = 'deploy_pending';
    state.pendingDeployment = { sha: pushedSha, taskId: task.id };
  } else if (completed) {
    task.status = 'complete';
    task.completedAt = new Date().toISOString();
    task.summary = process.env.AUTODEV_SUMMARY || 'Zadanie nie wymagało zmian w aplikacji.';
    if (Object.values(state.tasks).every((item) => item.status === 'complete'))
      state.lastCompletedSha = state.lastDiscoveredSha;
    if (state.pendingDeployment?.taskId === task.id && deployedSha) state.pendingDeployment = null;
  } else {
    task.status = task.attempts >= 3 ? 'blocked' : 'queued';
    task.lastError = process.env.AUTODEV_FAILURE_REASON || 'Zadanie nie przeszło weryfikacji.';
    task.updatedAt = new Date().toISOString();
  }
  await saveState(state, `autodev: ${task.status} ${task.id}`);
}

if (process.argv[2] === 'prepare') await prepare();
else if (process.argv[2] === 'finish') await finish();
else throw new Error('Usage: state.mjs prepare|finish');
