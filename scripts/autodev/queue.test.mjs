import assert from 'node:assert/strict';
import test from 'node:test';
import { createBatchTask, selectTaskBatch, transitionTaskBatch } from './queue.mjs';

const tasks = {
  'zwykle.md': { id: '1', path: 'zwykle.md', status: 'queued', attempts: 0, sourceBlob: 'a' },
  'patch_notes.md': {
    id: '2',
    path: 'patch_notes.md',
    status: 'queued',
    attempts: 0,
    sourceBlob: 'b',
  },
  'done.md': { id: '3', path: 'done.md', status: 'complete', attempts: 1, sourceBlob: 'c' },
  'blocked.md': { id: '4', path: 'blocked.md', status: 'queued', attempts: 3, sourceBlob: 'd' },
};

test('catch-up batch prioritizes upstream changes and excludes complete/exhausted tasks', () => {
  assert.deepEqual(
    selectTaskBatch(tasks, ['patch_notes.md'], 3).map((task) => task.path),
    ['patch_notes.md', 'zwykle.md'],
  );
});

test('batch identity binds source SHA and exact source blobs', () => {
  const selected = selectTaskBatch(tasks, ['patch_notes.md'], 2);
  const batch = createBatchTask(selected, 'source-sha');
  assert.deepEqual(batch.paths, ['patch_notes.md', 'zwykle.md']);
  assert.equal(batch.id, createBatchTask(selected, 'source-sha').id);
  assert.notEqual(batch.id, createBatchTask(selected, 'new-source-sha').id);
});

test('successful batches complete every task and record the same summary', () => {
  const batch = [
    { status: 'running', attempts: 1 },
    { status: 'running', attempts: 2 },
  ];
  assert.equal(
    transitionTaskBatch(batch, { success: true, summary: 'Audyt zakończony.', at: 'now' }),
    'complete',
  );
  assert.deepEqual(
    batch.map(({ status, summary, completedAt }) => [status, summary, completedAt]),
    [
      ['complete', 'Audyt zakończony.', 'now'],
      ['complete', 'Audyt zakończony.', 'now'],
    ],
  );
});

test('a failed batch retries together and blocks exhausted tasks together', () => {
  const batch = [
    { status: 'running', attempts: 1 },
    { status: 'running', attempts: 3 },
  ];
  assert.equal(transitionTaskBatch(batch, { error: 'review failed', at: 'now' }), 'queued');
  assert.deepEqual(
    batch.map(({ status, lastError }) => [status, lastError]),
    [
      ['queued', 'review failed'],
      ['blocked', 'review failed'],
    ],
  );
});

test('changed batches remain pending deployment as one unit', () => {
  const batch = [{ status: 'running' }, { status: 'running' }];
  assert.equal(transitionTaskBatch(batch, { needsDeployment: true }), 'deploy_pending');
  assert.deepEqual(
    batch.map(({ status }) => status),
    ['deploy_pending', 'deploy_pending'],
  );
});
