import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const task = JSON.parse(await readFile(process.env.AUTODEV_TASK_FILE, 'utf8'));
const result = JSON.parse(await readFile(process.env.AUTODEV_RESULT_FILE, 'utf8'));
const review = JSON.parse(await readFile(process.env.AUTODEV_REVIEW_FILE, 'utf8'));
const tracked = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean);
const allChanged = [...new Set([...tracked, ...untracked])];
const changed = allChanged.filter((path) => path !== 'Battlesword-4.000');
const sourceHead = execFileSync('git', ['-C', 'Battlesword-4.000', 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
const repositoryHead = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (process.env.AUTODEV_EXPECTED_HEAD && repositoryHead !== process.env.AUTODEV_EXPECTED_HEAD)
  throw new Error('The agent changed the checked-out application commit');
if (sourceHead !== task.sourceSha)
  throw new Error('The agent changed the Battlesword source checkout');
if (
  execFileSync('git', ['-C', 'Battlesword-4.000', 'status', '--porcelain'], {
    encoding: 'utf8',
  }).trim()
) {
  throw new Error('The agent modified files inside the Battlesword source submodule');
}
const forbidden = allChanged.filter(
  (path) =>
    path.startsWith('.github/') ||
    path.startsWith('.opencode/') ||
    path.startsWith('scripts/autodev/') ||
    path === 'AGENTS.md' ||
    path === '.gitmodules' ||
    path === '.gitignore' ||
    path === 'playwright.config.ts' ||
    path.startsWith('Battlesword-4.000/'),
);
if (forbidden.length) throw new Error(`Agent changed protected paths: ${forbidden.join(', ')}`);

const basePackage = JSON.parse(
  execFileSync('git', ['show', 'HEAD:package.json'], { encoding: 'utf8' }),
);
const currentPackage = JSON.parse(await readFile('package.json', 'utf8'));
for (const script of ['test', 'test:e2e', 'test:autodev', 'build']) {
  if (basePackage.scripts[script] !== currentPackage.scripts[script]) {
    throw new Error(`The agent changed the protected npm script: ${script}`);
  }
}

if (result.taskId !== task.id || result.sourceSha !== task.sourceSha)
  throw new Error('Agent result does not match the active source task');
if (review.status !== 'pass' || !Array.isArray(review.findings) || review.findings.length !== 0) {
  throw new Error('The independent source and code review did not pass');
}
if (!['complete', 'no_change'].includes(result.status))
  throw new Error('Invalid task result status');
if (!Array.isArray(result.sourceFiles) || !result.sourceFiles.includes(task.path))
  throw new Error('Task result must cite the changed source file');
if (result.status === 'no_change' && (!result.noChangeReason || changed.length))
  throw new Error('A no_change result needs a reason and must not contain app edits');
if (result.status === 'complete') {
  if (!changed.length) throw new Error('A complete result must contain an application change');
  if (!Array.isArray(result.testsAddedOrUpdated) || result.testsAddedOrUpdated.length === 0)
    throw new Error('A complete result must add or update tests');
  if (!Array.isArray(result.decisions) || result.decisions.length === 0)
    throw new Error('A complete result must record its product decisions');
  const changedTests = changed.filter(
    (path) =>
      /\.(spec|test)\.[cm]?[jt]sx?$/.test(path) || /^e2e\/.*\.spec\.[cm]?[jt]sx?$/.test(path),
  );
  if (
    !changedTests.length ||
    result.testsAddedOrUpdated.some((path) => !changedTests.includes(path))
  )
    throw new Error('The reported tests must exist among the changed test files');
}

const report = {
  taskId: result.taskId,
  sourceSha: result.sourceSha,
  status: result.status,
  summary: result.summary,
  sourceFiles: result.sourceFiles,
  changedFiles: changed,
  repositoryChanges: allChanged,
  testsAddedOrUpdated: result.testsAddedOrUpdated ?? [],
  decisions: result.decisions ?? [],
  noChangeReason: result.noChangeReason ?? null,
  reviewSummary: review.summary,
};
await writeFile(process.env.AUTODEV_VALIDATED_REPORT, JSON.stringify(report, null, 2));
await writeFile(
  process.env.GITHUB_STEP_SUMMARY,
  [
    '# Autonomiczny rozwój kompendium',
    '',
    `- Zadanie: ${task.path}`,
    `- Źródłowy SHA: \`${task.sourceSha}\``,
    `- Wynik: ${report.status}`,
    `- Opis: ${report.summary}`,
    `- Zmiany: ${report.changedFiles.join(', ') || 'brak'}`,
    `- Testy: ${report.testsAddedOrUpdated.join(', ') || 'brak (zadanie no_change)'}`,
    `- Decyzje: ${report.decisions.join('; ') || report.noChangeReason || 'brak'}`,
    `- Niezależne review: ${report.reviewSummary}`,
    '',
  ].join('\n'),
);
