import assert from 'node:assert/strict';
import test from 'node:test';
import { sourceChangesFromGitOutput, sourceFilesFromGitOutput } from './source.mjs';

test('source discovery preserves UTF-8 paths with Polish characters', () => {
  const path = 'ekwipunek/przedmioty_magiczne/mityczny/zaduma_świtu.md';
  assert.deepEqual(sourceFilesFromGitOutput(`${path}\nTODO\nimage.png`), [path, 'TODO']);
  assert.deepEqual(sourceChangesFromGitOutput(`A\t${path}\nM\tpatch_notes.md`), [
    { path, change: 'A' },
    { path: 'patch_notes.md', change: 'M' },
  ]);
});

test('renamed source files queue both the removed and added paths', () => {
  assert.deepEqual(sourceChangesFromGitOutput('R100\twalka/stany.md\twalka/statusy.md'), [
    { path: 'walka/stany.md', change: 'R100' },
    { path: 'walka/statusy.md', change: 'R100' },
  ]);
});
