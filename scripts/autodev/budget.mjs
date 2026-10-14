export function recoverLegacySpent(spent, attemptBudget) {
  return spent < 0 ? Math.max(0, spent + attemptBudget) : spent;
}

export function actualAttemptCost(usage, attemptBudget) {
  const reported = Number(usage?.spent ?? 0) + Number(usage?.reserved ?? 0);
  return Number.isFinite(reported) ? Math.min(attemptBudget, Math.max(0, reported)) : attemptBudget;
}

export function addDailySpend(spent, amount, dailyBudget) {
  return Math.min(dailyBudget, Math.max(0, spent) + amount);
}

export function reserveAttemptBudget(
  spent,
  dailyBudget,
  attemptBudget,
  minimumUsefulBudget = 0.25,
) {
  const remaining = Math.max(0, dailyBudget - spent);
  return remaining >= minimumUsefulBudget ? Math.min(attemptBudget, remaining) : 0;
}
