import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import {
  categories,
  sourceCategories,
  loadSchemas,
  validate,
  validateData,
  buildIndex,
  canonical,
  compare,
} from './schema.mjs';
import { git, readSnapshot, makeBatches, sourceTypes, upstream } from './sources.mjs';
import { requestJson } from './deepseek.mjs';

export const statePath = '.github/compendium-state.json';
export const outputPath = '.compendium-sync';
const string = { type: 'string' };
const array = (items) => ({ type: 'array', items });
const object = (properties) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});
export function responseSchema(entrySchema, inconsistencySchema = entrySchema) {
  const finding = structuredClone(inconsistencySchema);
  delete finding.properties.revision;
  finding.required = finding.required.filter((field) => field !== 'revision');
  return object({
    entries: array(entrySchema),
    findings: array(finding),
    removedFindings: array(object({ id: string, reason: string })),
    removed: array(object({ id: string, reason: string })),
    coverage: array(object({ source: string, entryIds: array(string), ignoredReason: string })),
    unresolved: array(string),
  });
}

function findingSourceOwner(path, data) {
  return sourceCategories.find((type) => sourceTypes(path, data).includes(type));
}

const normalizedName = (name) => name.normalize('NFC').toLocaleLowerCase('pl').trim();

export function reconcile(
  batch,
  result,
  previous,
  schema,
  sources,
  before,
  inconsistencySchema = schema,
) {
  validate(responseSchema(schema, inconsistencySchema), result, batch.type);
  if (result.unresolved.length)
    throw new Error(`${batch.type}: unresolved: ${result.unresolved.join('; ')}`);
  const currentOwned = batch.owned.filter((path) => sources.has(path));
  const newIds = new Set(result.entries.map((entry) => entry.id));
  if (newIds.size !== result.entries.length) throw new Error(`${batch.type}: duplicate IDs`);
  const oldIds = new Set(previous.map((entry) => entry.id));
  const removed = previous.filter((entry) => !newIds.has(entry.id));
  const declared = new Set(result.removed.map((entry) => entry.id));
  if (
    declared.size !== result.removed.length ||
    canonical([...declared].sort(compare)) !== canonical(removed.map((e) => e.id).sort(compare)) ||
    result.removed.some((e) => !e.reason.trim())
  ) {
    throw new Error(`${batch.type}: unexplained or invalid removal`);
  }
  for (const entry of result.entries) {
    if (!currentOwned.includes(entry.source))
      throw new Error(`${batch.type}: entry outside owned sources`);
    const sameName = previous.filter(
      (old) =>
        normalizedName(old.name) === normalizedName(entry.name) && old.source === entry.source,
    );
    if (sameName.length === 1 && sameName[0].id !== entry.id)
      throw new Error(`${batch.type}: changed ID for ${entry.name}`);
    if (
      !oldIds.has(entry.id) &&
      removed.some(
        (old) =>
          old.source === entry.source ||
          (before.get(old.source) && before.get(old.source) === sources.get(entry.source)),
      )
    ) {
      throw new Error(
        `${batch.type}: ambiguous removal/rename for ${entry.name}; preserve the old ID`,
      );
    }
  }
  const coverage = new Map(result.coverage.map((entry) => [entry.source, entry]));
  if (
    coverage.size !== result.coverage.length ||
    canonical([...coverage.keys()].sort(compare)) !== canonical([...currentOwned].sort(compare))
  ) {
    throw new Error(`${batch.type}: incomplete source coverage`);
  }
  for (const [path, entry] of coverage) {
    const expected = result.entries
      .filter((e) => e.source === path)
      .map((e) => e.id)
      .sort(compare);
    if (
      canonical([...entry.entryIds].sort(compare)) !== canonical(expected) ||
      (!expected.length && !entry.ignoredReason.trim()) ||
      (expected.length && entry.ignoredReason.trim())
    ) {
      throw new Error(`${batch.type}: invalid coverage for ${path}`);
    }
  }
  return result.entries;
}

export function reconcileFindings(paths, result, previous, schema, sources, knownIds) {
  const draftSchema = structuredClone(schema);
  delete draftSchema.properties.revision;
  draftSchema.required = draftSchema.required.filter((field) => field !== 'revision');
  const ids = new Set();
  for (const finding of result.findings) {
    validate(draftSchema, finding, `findings.${finding.id}`);
    if (!paths.includes(finding.source))
      throw new Error(`Finding source is not owned: ${finding.source}`);
    if (
      !finding.relatedSources.includes(finding.source) ||
      finding.relatedSources.some((path) => !sources.has(path))
    ) {
      throw new Error(`Finding ${finding.id} has missing or unrelated source references`);
    }
    if (finding.relatedEntryIds.some((id) => !knownIds.has(id))) {
      throw new Error(`Finding ${finding.id} references an unknown compendium entry`);
    }
    if (ids.has(finding.id)) throw new Error(`Duplicate finding ID: ${finding.id}`);
    ids.add(finding.id);
    const sameName = previous.find(
      (old) =>
        old.name.normalize('NFC').toLowerCase() === finding.name.normalize('NFC').toLowerCase(),
    );
    if (sameName && sameName.id !== finding.id)
      throw new Error(`Changed finding ID for ${finding.name}`);
  }
  const removed = new Set(result.removedFindings.map((finding) => finding.id));
  const oldOwned = previous.filter((finding) => paths.includes(finding.source));
  if (
    removed.size !== result.removedFindings.length ||
    canonical([...removed].sort(compare)) !==
      canonical(
        oldOwned
          .filter((old) => !ids.has(old.id))
          .map((old) => old.id)
          .sort(compare),
      ) ||
    result.removedFindings.some((finding) => !finding.reason.trim())
  ) {
    throw new Error('Findings were omitted without an explicit resolution');
  }
  return result.findings;
}

export async function readData(directory) {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(categories).map(async ([type, [file]]) => [
        type,
        JSON.parse(await readFile(join(directory, file), 'utf8')),
      ]),
    ),
  );
}

async function optionalJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export async function synchronize({
  root,
  target,
  full = false,
  plan = false,
  apply = false,
  request = requestJson,
  apiKey = process.env.DEEPSEEK_API_KEY,
  model = process.env.DEEPSEEK_MODEL || 'deepseek-flash',
  report = {},
}) {
  const repo = join(root, 'Battlesword-4.000');
  const base = git(root, 'rev-parse', 'HEAD');
  const tree = git(root, 'ls-tree', 'HEAD', 'Battlesword-4.000');
  const baseline = tree.match(/^160000 commit ([a-f0-9]{40})\t/)?.[1];
  if (!baseline) throw new Error('Expected Battlesword-4.000 to be a git submodule');
  const previousState = await optionalJson(join(root, statePath));
  if (
    previousState &&
    (previousState.version !== 1 ||
      previousState.upstream !== upstream ||
      previousState.sourceSha !== baseline)
  ) {
    throw new Error(
      'Sync state and submodule differ; reconcile the committed baseline before syncing',
    );
  }
  const sourceSha = target || git(repo, 'rev-parse', 'HEAD');
  const before = readSnapshot(repo, baseline);
  const after = readSnapshot(repo, sourceSha);
  const data = await readData(join(root, 'src/assets/data'));
  const schemas = loadSchemas(root);
  const initial = !previousState;
  const selection = makeBatches(before, after, data, full || initial);
  Object.assign(report, {
    baseSha: base,
    previousSourceSha: baseline,
    sourceSha,
    model,
    initial,
    mode: plan ? 'plan' : apply ? 'apply' : 'dry-run',
    ...selection,
    publicationDisabled: process.env.COMPENDIUM_DRY_RUN === 'true' || !apply,
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    results: [],
  });
  if (plan) return report;
  const prompt = await readFile(join(root, 'scripts/compendium/prompt.md'), 'utf8');
  const output = join(root, outputPath);
  await mkdir(join(output, 'responses'), { recursive: true });
  const candidate = structuredClone(data);
  for (const batch of selection.batches) {
    const schema = responseSchema(schemas[batch.type], schemas.inconsistency);
    const payload = {
      category: batch.type,
      responseSchema: schema,
      previousEntries: data[batch.type],
      otherCategoryEntries: buildIndex(candidate).filter((entry) => entry.type !== batch.type),
      previousFindings: candidate.inconsistency.filter(
        (finding) => findingSourceOwner(finding.source, data) === batch.type,
      ),
      findingSources: batch.owned.filter(
        (path) => findingSourceOwner(path, data) === batch.type && after.has(path),
      ),
      ownedSources: batch.owned
        .filter((path) => after.has(path))
        .map((path) => ({ path, text: after.get(path) })),
      contextSources: batch.context
        .filter((path) => !batch.owned.includes(path) && after.has(path))
        .map((path) => ({ path, text: after.get(path) })),
      changes: batch.changed.map((path) => ({
        path,
        before: before.get(path) ?? null,
        after: after.get(path) ?? null,
      })),
    };
    // Fail instead of silently truncating rules or spending unbounded context on a malformed source.
    const content = JSON.stringify(payload);
    if (Buffer.byteLength(content) > 700_000)
      throw new Error(`${batch.type}: context exceeds 700 KB; split the category before retrying`);
    console.log(`Extracting ${batch.type} (${payload.ownedSources.length} source files)`);
    const result = await request(
      [
        { role: 'system', content: prompt },
        { role: 'user', content },
      ],
      {
        apiKey,
        model,
        onUsage: (usage) => {
          for (const key of Object.keys(report.usage)) report.usage[key] += Number(usage[key]) || 0;
        },
      },
    );
    // Keep the model's answer even if reconciliation fails, so a rejected extraction is reviewable.
    // Prompts and credentials are never written here.
    await writeFile(
      join(output, 'responses', `${batch.type}.json`),
      `${JSON.stringify(result, null, 2)}\n`,
    );
    candidate[batch.type] = reconcile(
      batch,
      result,
      data[batch.type],
      schemas[batch.type],
      after,
      before,
      schemas.inconsistency,
    );
    const findingPaths = payload.findingSources;
    const findings = reconcileFindings(
      findingPaths,
      result,
      payload.previousFindings,
      schemas.inconsistency,
      after,
      new Set(buildIndex(candidate).map((entry) => entry.id)),
    ).map((finding) => ({ ...finding, status: 'detailed', revision: sourceSha }));
    candidate.inconsistency = [
      ...candidate.inconsistency.filter((finding) => !findingPaths.includes(finding.source)),
      ...findings,
    ].sort((a, b) => compare(a.id, b.id));
    const previousFindings = new Map(
      payload.previousFindings.map((finding) => [finding.id, finding]),
    );
    const currentFindingIds = new Set(findings.map((finding) => finding.id));
    report.results.push({
      type: batch.type,
      removed: result.removed,
      findings: findings.map((finding) => finding.id),
      removedFindings: payload.previousFindings
        .filter((finding) => !currentFindingIds.has(finding.id))
        .map((finding) => ({
          id: finding.id,
          reason: result.removedFindings.find((item) => item.id === finding.id)?.reason,
        })),
      changedFindings: findings
        .filter((finding) => canonical(finding) !== canonical(previousFindings.get(finding.id)))
        .map((finding) => finding.id),
      coverage: result.coverage,
      changedIds: result.entries
        .filter(
          (entry) =>
            canonical(entry) !== canonical(data[batch.type].find((old) => old.id === entry.id)),
        )
        .map((e) => e.id),
    });
  }
  validateData(candidate, schemas, after);
  const index = buildIndex(candidate);
  await mkdir(join(output, 'data'), { recursive: true });
  for (const [type, [file]] of Object.entries(categories)) {
    // Preserve bytes for unchanged categories, including their hand-maintained formatting.
    const text =
      canonical(candidate[type]) === canonical(data[type])
        ? await readFile(join(root, 'src/assets/data', file), 'utf8')
        : `${JSON.stringify(candidate[type], null, 2)}\n`;
    await writeFile(join(output, 'data', file), text);
  }
  const oldIndexText = await readFile(join(root, 'src/assets/data/index.json'), 'utf8');
  const oldIndex = JSON.parse(oldIndexText);
  const sortedOldIndex = [...oldIndex].sort((a, b) =>
    compare(`${a.type}:${a.id}`, `${b.type}:${b.id}`),
  );
  await writeFile(
    join(output, 'data/index.json'),
    canonical(sortedOldIndex) === canonical(index)
      ? oldIndexText
      : `${JSON.stringify(index, null, 2)}\n`,
  );
  const state = { version: 1, upstream, sourceSha, model };
  await writeFile(join(output, 'state.json'), `${JSON.stringify(state, null, 2)}\n`);
  if (apply) {
    const allowed = new Set(['Battlesword-4.000']);
    const dirty = git(root, 'diff', '--name-only', 'HEAD').split('\n').filter(Boolean);
    if (dirty.some((path) => !allowed.has(path)) || git(root, 'rev-parse', 'HEAD') !== base) {
      throw new Error('Working tree or HEAD changed; refusing to apply generated data');
    }
    for (const [file] of Object.values(categories)) {
      await writeFile(
        join(root, 'src/assets/data', file),
        await readFile(join(output, 'data', file)),
      );
    }
    await writeFile(
      join(root, 'src/assets/data/index.json'),
      await readFile(join(output, 'data/index.json')),
    );
    await writeFile(join(root, statePath), await readFile(join(output, 'state.json')));
    git(repo, 'checkout', '--detach', sourceSha);
  }
  report.status = 'validated';
  return report;
}

export async function validateDirectory(root, directory, target) {
  const repo = join(root, 'Battlesword-4.000');
  const sources = readSnapshot(repo, target || git(repo, 'rev-parse', 'HEAD'));
  const data = await readData(directory);
  validateData(data, loadSchemas(root), sources);
  const index = JSON.parse(await readFile(join(directory, 'index.json'), 'utf8'));
  if (
    !Array.isArray(index) ||
    canonical([...index].sort((a, b) => compare(`${a.type}:${a.id}`, `${b.type}:${b.id}`))) !==
      canonical(buildIndex(data))
  ) {
    throw new Error('Index does not exactly match category data');
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      'target-sha': { type: 'string' },
      plan: { type: 'boolean' },
      apply: { type: 'boolean' },
      full: { type: 'boolean' },
      validate: { type: 'boolean' },
      'data-dir': { type: 'string' },
    },
  });
  const root = process.cwd();
  if (values.plan && values.apply) throw new Error('--plan and --apply are mutually exclusive');
  if (values.validate) {
    await validateDirectory(
      root,
      resolve(values['data-dir'] || 'src/assets/data'),
      values['target-sha'],
    );
    console.log('Compendium schemas, sources and index are valid.');
    return;
  }
  const report = {};
  await mkdir(join(root, outputPath), { recursive: true });
  try {
    await synchronize({
      root,
      target: values['target-sha'],
      full: values.full,
      plan: values.plan,
      apply: values.apply,
      report,
    });
    console.log(`Source ${report.sourceSha}; ${report.batches.length} categories; ${report.mode}`);
  } catch (error) {
    report.status = 'failed';
    report.error = error.message;
    throw error;
  } finally {
    await writeFile(join(root, outputPath, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    if (process.env.GITHUB_STEP_SUMMARY) {
      // JSON in a fenced block avoids interpreting upstream/model text as report markup.
      const summary = JSON.stringify(report, null, 2).replaceAll('`', '\\u0060');
      await appendFile(
        process.env.GITHUB_STEP_SUMMARY,
        `## Compendium sync\n\n\`\`\`json\n${summary}\n\`\`\`\n`,
      );
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
