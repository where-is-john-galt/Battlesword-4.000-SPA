import assert from 'node:assert/strict';
import test from 'node:test';
import { actualAttemptCost, addDailySpend, recoverLegacySpent } from './budget.mjs';

test('records actual spend without subtracting the reservation a second time', () => {
  const actual = actualAttemptCost({ spent: 0.346533, reserved: 0 }, 2);
  assert.equal(addDailySpend(0, actual, 5), 0.346533);
});

test('charges outstanding provider reservations conservatively', () => {
  assert.equal(actualAttemptCost({ spent: 0.1, reserved: 0.5 }, 2), 0.6);
  assert.equal(actualAttemptCost({ spent: 2.5, reserved: 0 }, 2), 2);
});

test('recovers totals written by the previous double-subtraction bug', () => {
  assert.equal(recoverLegacySpent(-1.653467, 2), 0.346533);
  assert.equal(recoverLegacySpent(1, 2), 1);
});
