import { createHash } from 'node:crypto';

export function selectTaskBatch(tasks, priorityPaths, limit) {
  const priorities = new Set(priorityPaths);
  return Object.values(tasks)
    .filter((task) => task.status === 'queued' && task.attempts < 3)
    .sort((a, b) => {
      const priorityDifference = Number(priorities.has(b.path)) - Number(priorities.has(a.path));
      return priorityDifference || a.path.localeCompare(b.path, 'pl');
    })
    .slice(0, limit);
}

export function createBatchTask(tasks, sourceSha) {
  const paths = tasks.map((task) => task.path);
  const id = createHash('sha256')
    .update(`${sourceSha}\n${tasks.map((task) => `${task.id}:${task.sourceBlob}`).join('\n')}`)
    .digest('hex')
    .slice(0, 16);
  return {
    id,
    path: paths[0],
    paths,
    tasks: tasks.map(({ id: taskId, path, change, reason }) => ({
      id: taskId,
      path,
      change,
      reason,
    })),
    sourceSha,
    change: 'catch-up batch',
    reason: `Audyt ${tasks.length} plików źródłowych z ${sourceSha}.`,
  };
}

export function transitionTaskBatch(tasks, outcome) {
  const updatedAt = outcome.at ?? new Date().toISOString();
  if (outcome.needsDeployment) {
    for (const task of tasks) task.status = 'deploy_pending';
    return 'deploy_pending';
  }
  if (outcome.success) {
    for (const task of tasks) {
      task.status = 'complete';
      task.completedAt = updatedAt;
      task.summary = outcome.summary || 'Zadanie nie wymagało zmian w aplikacji.';
    }
    return 'complete';
  }
  for (const task of tasks) {
    task.status = task.attempts >= 3 ? 'blocked' : 'queued';
    task.lastError = outcome.error || 'Zadanie nie przeszło weryfikacji.';
    task.updatedAt = updatedAt;
  }
  return tasks[0].status;
}
