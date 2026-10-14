import assert from 'node:assert/strict';
import test from 'node:test';
import { parseReview } from './review.mjs';

test('finds the review object after schema examples and fenced JSON', () => {
  const expected = {
    status: 'pass',
    findings: [],
    summary: 'Sprawdzone {wartości} i \"cytaty\".',
  };
  const response = [
    'Schema: `{status, findings[], summary}`.',
    '```json',
    JSON.stringify(expected, null, 2),
    '```',
  ].join('\n');

  assert.deepEqual(parseReview(response), expected);
});

test('rejects a response without a valid review schema', () => {
  assert.throws(() => parseReview('No JSON here: {status: pass}'), /valid review JSON/);
});
