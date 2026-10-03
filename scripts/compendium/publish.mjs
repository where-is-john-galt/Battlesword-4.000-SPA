import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories } from './schema.mjs';
import { git } from './sources.mjs';
import { outputPath, statePath, validateDirectory } from './sync.mjs';

export function assertPublishable({ report, head, remote, submodule, paths, state }) {
  if (report.publicationDisabled) throw new Error('Dry-run result cannot be published');
  if (report.status !== 'validated' || report.mode !== 'apply')
    throw new Error('No validated applied sync result');
  if (head !== report.baseSha || remote !== report.baseSha)
    throw new Error('main changed during sync; rerun on the new base');
  if (submodule !== report.sourceSha || state.sourceSha !== report.sourceSha)
    throw new Error('Source SHA mismatch');
  const allowed = new Set([
    statePath,
    'Battlesword-4.000',
    'src/assets/data/index.json',
    ...Object.values(categories).map(([file]) => `src/assets/data/${file}`),
  ]);
  for (const path of paths)
    if (!allowed.has(path)) throw new Error(`Unexpected changed file: ${path}`);
}

async function main() {
  const root = process.cwd();
  const report = JSON.parse(readFileSync(`${outputPath}/report.json`, 'utf8'));
  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  git(root, 'fetch', '--no-tags', 'origin', 'main');
  const paths = [
    ...new Set(
      [
        ...git(root, 'diff', '--name-only', '-z', 'HEAD').split('\0'),
        ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0'),
      ].filter(Boolean),
    ),
  ];
  assertPublishable({
    report,
    state,
    paths,
    head: git(root, 'rev-parse', 'HEAD'),
    remote: git(root, 'rev-parse', 'FETCH_HEAD'),
    submodule: git(`${root}/Battlesword-4.000`, 'rev-parse', 'HEAD'),
  });
  await validateDirectory(root, resolve('src/assets/data'), report.sourceSha);
  if (!paths.length) {
    console.log('Nothing to commit.');
    return;
  }
  git(root, 'add', '--', ...paths);
  git(
    root,
    '-c',
    'user.name=github-actions[bot]',
    '-c',
    'user.email=41898282+github-actions[bot]@users.noreply.github.com',
    'commit',
    '-m',
    `chore: sync compendium from ${report.sourceSha.slice(0, 12)}`,
  );
  // A concurrent push is rejected by Git; never force or rebase untested data.
  git(root, 'push', 'origin', 'HEAD:refs/heads/main');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
