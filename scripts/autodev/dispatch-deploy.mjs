import { execFileSync, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const expectedSha = process.argv[2];
if (!expectedSha) throw new Error('Expected deployment SHA argument');

function gh(args, json = false) {
  const stdout = execFileSync('gh', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
  return json ? JSON.parse(stdout) : stdout;
}

function findRuns() {
  return gh(
    [
      'run',
      'list',
      '--workflow',
      'deploy.yml',
      '--branch',
      'main',
      '--limit',
      '20',
      '--json',
      'databaseId,headSha,status,conclusion',
    ],
    true,
  );
}

const deadline = Date.now() + 10 * 60_000;
let run = findRuns().find((item) => item.headSha === expectedSha);
if (run?.status === 'completed' && run.conclusion === 'success') {
  console.log(`Already deployed ${expectedSha} in run ${run.databaseId}`);
  process.exit(0);
}

const ignoredRunId = run?.status === 'completed' ? String(run.databaseId) : null;
if (ignoredRunId) run = null;
if (!run) gh(['workflow', 'run', 'deploy.yml', '--ref', 'main']);

while (Date.now() < deadline && !run) {
  run = findRuns().find(
    (item) => item.headSha === expectedSha && String(item.databaseId) !== ignoredRunId,
  );
  if (!run) await delay(5_000);
}
if (!run) throw new Error(`Deployment workflow for ${expectedSha} did not appear`);

const result = spawnSync('gh', ['run', 'watch', String(run.databaseId), '--exit-status'], {
  stdio: 'inherit',
});
if (result.status !== 0) throw new Error(`Deployment run ${run.databaseId} failed`);
console.log(`Deployed ${expectedSha} in run ${run.databaseId}`);
