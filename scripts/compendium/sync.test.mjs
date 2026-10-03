import { describe, it, expect, vi, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { categories, loadSchemas, validate, validateData, buildIndex } from './schema.mjs';
import { makeBatches, git, upstream } from './sources.mjs';
import {
  reconcile,
  reconcileFindings,
  synchronize,
  validateDirectory,
  statePath,
} from './sync.mjs';
import { requestJson } from './deepseek.mjs';
import { assertPublishable } from './publish.mjs';

const schemas = loadSchemas();
const emptyData = () => Object.fromEntries(Object.keys(categories).map((type) => [type, []]));
const source = 'tworzenie_postaci/rasy/elf.md';
const entry = { id: 'elf', name: 'Elf', source, status: 'stub' };
const sources = new Map([[source, '# Elf']]);
const batch = { type: 'race', owned: [source] };
function result(entries = [entry], removed = [], owned = sources) {
  return {
    entries,
    findings: [],
    removedFindings: [],
    removed,
    unresolved: [],
    coverage: [...owned.keys()].map((path) => ({
      source: path,
      entryIds: entries.filter((e) => e.source === path).map((e) => e.id),
      ignoredReason: entries.some((e) => e.source === path) ? '' : 'Brak wpisów w tej kategorii.',
    })),
  };
}

describe('contracts derived from application types', () => {
  it('accepts real nested abilities and rejects invalid numbers and unknown fields', () => {
    validate(schemas.race, {
      ...entry,
      passiveAbilities: [{ name: 'Test', description: 'Opis', duration: '1 minuta' }],
    });
    expect(() => validate(schemas.race, { ...entry, size: 2 })).toThrow();
    expect(() => validate(schemas.race, { ...entry, shell: 'echo unsafe' })).toThrow(
      'unknown field',
    );
    expect(() => validate(schemas.armor, { ...entry, category: 'Lekki', armor: '2' })).toThrow();
    expect(() => validate(schemas.race, { ...entry, status: 'invented' })).toThrow();
  });
  it('checks unique IDs and source existence', () => {
    const data = { ...emptyData(), race: [entry, entry] };
    expect(() => validateData(data, schemas, sources)).toThrow('duplicate ID');
    expect(() => validateData({ ...data, race: [entry] }, schemas, new Map())).toThrow(
      'missing source',
    );
  });
  it('builds a deterministic complete index', () => {
    expect(buildIndex({ ...emptyData(), race: [entry] })).toEqual([{ ...entry, type: 'race' }]);
  });
  it('keeps same-name entities from different source categories', () => {
    const data = { ...emptyData(), race: [entry], monster: [{ ...entry, id: 'elf_monster' }] };
    expect(() => validateData(data, schemas, sources)).not.toThrow();
  });
});

describe('dependency selection', () => {
  it('makes no requests when sources are unchanged', () => {
    expect(makeBatches(sources, sources, emptyData()).batches).toEqual([]);
  });
  it('reconciles a whole category for additions and deletions, including list stubs', () => {
    const data = { ...emptyData(), race: [entry] };
    expect(makeBatches(sources, new Map(), data).batches.map((b) => b.type)).toEqual(['race']);
    expect(makeBatches(new Map(), sources, data).batches[0].owned).toContain(source);
  });
  it('revisits dependants of a changed Markdown link and global core rules', () => {
    const before = new Map([
      [source, '[Zasada](../../ekwipunek/paski.md)'],
      ['ekwipunek/paski.md', 'old'],
    ]);
    const after = new Map([...before, ['ekwipunek/paski.md', 'new']]);
    expect(makeBatches(before, after, emptyData()).batches.map((b) => b.type)).toEqual([
      'race',
      'belt',
      'magicItem',
    ]);
    after.set('mechaniki_bazowe/testy.md', 'New rules');
    expect(makeBatches(before, after, emptyData()).batches).toHaveLength(14);
  });
  it('stops on new unmapped rule areas', () => {
    expect(() =>
      makeBatches(new Map(), new Map([['nowy_system.md', 'rules']]), emptyData()),
    ).toThrow('Unmapped');
  });
});

describe('identity and coverage', () => {
  it('preserves ID through stub promotion and a source/name change', () => {
    const newSource = 'tworzenie_postaci/rasy/leśny_elf.md';
    const after = new Map([[newSource, '# Leśny elf']]);
    const promoted = {
      ...entry,
      name: 'Leśny elf',
      source: newSource,
      status: 'detailed',
      bonuses: ['+1'],
    };
    expect(
      reconcile(
        { ...batch, owned: [source, newSource] },
        result([promoted], [], after),
        [entry],
        schemas.race,
        after,
        sources,
      ),
    ).toEqual([promoted]);
  });
  it('accepts additions and explicit removals', () => {
    expect(reconcile(batch, result(), [], schemas.race, sources, new Map())).toEqual([entry]);
    const deleted = result([], [{ id: entry.id, reason: 'Usunięty z reguł' }], new Map());
    expect(reconcile(batch, deleted, [entry], schemas.race, new Map(), sources)).toEqual([]);
  });
  it('rejects silent omissions, changed IDs and ambiguous delete/add renames', () => {
    expect(() => reconcile(batch, result([]), [entry], schemas.race, sources, sources)).toThrow(
      'removal',
    );
    expect(() =>
      reconcile(
        batch,
        result([{ ...entry, id: 'new' }], [{ id: 'elf', reason: 'rename' }]),
        [entry],
        schemas.race,
        sources,
        sources,
      ),
    ).toThrow('changed ID');
    expect(() =>
      reconcile(
        batch,
        result([{ ...entry, id: 'new', name: 'Nowy' }], [{ id: 'elf', reason: 'rename' }]),
        [entry],
        schemas.race,
        sources,
        sources,
      ),
    ).toThrow('ambiguous');
  });
  it('rejects missing coverage, foreign sources and unresolved rules', () => {
    expect(() =>
      reconcile(batch, { ...result(), coverage: [] }, [entry], schemas.race, sources, sources),
    ).toThrow('coverage');
    expect(() =>
      reconcile(
        batch,
        result([{ ...entry, source: 'wrong.md' }]),
        [entry],
        schemas.race,
        sources,
        sources,
      ),
    ).toThrow('outside');
    expect(() =>
      reconcile(
        batch,
        { ...result(), unresolved: ['Unknown mechanic'] },
        [entry],
        schemas.race,
        sources,
        sources,
      ),
    ).toThrow('unresolved');
  });
  it('records incomplete source text as a linked inconsistency finding', () => {
    const finding = {
      id: 'missing_shock',
      name: 'Brak opisu Szoku',
      source,
      status: 'detailed',
      kind: 'missing_detail',
      details: 'Źródło wymienia Szok, ale nie podaje jego skutków.',
      evidence: '1 poziom Szoku',
      relatedSources: [source],
      relatedEntryIds: [],
    };
    expect(
      reconcileFindings(
        [source],
        { ...result(), findings: [finding] },
        [],
        schemas.inconsistency,
        sources,
        new Set(),
      ),
    ).toEqual([finding]);
  });
});

const completion = (content = '{}', finish_reason = 'stop') => ({
  choices: [{ finish_reason, message: { content } }],
  usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
});
const response = (body, status = 200) => new Response(JSON.stringify(body), { status });

describe('DeepSeek boundary', () => {
  it('uses JSON mode without tools, and reports token usage', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(completion()));
    const onUsage = vi.fn();
    await expect(requestJson([], { apiKey: 'test', fetchImpl, onUsage })).resolves.toEqual({});
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body.response_format).toEqual({ type: 'json_object' });
    expect(body.tools).toBeUndefined();
    expect(onUsage).toHaveBeenCalledWith({
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15,
    });
  });
  it('retries transient HTTP/network failures at most three times', async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(response({}, 429))
      .mockResolvedValueOnce(response(completion()));
    await requestJson([], { apiKey: 'test', fetchImpl, wait: async () => {} });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    const failing = vi.fn().mockResolvedValue(response({}, 503));
    await expect(
      requestJson([], { apiKey: 'test', fetchImpl: failing, wait: async () => {} }),
    ).rejects.toThrow('503');
    expect(failing).toHaveBeenCalledTimes(3);
  });
  it.each([
    ['', 'stop'],
    ['{', 'stop'],
    ['{}', 'length'],
  ])('rejects empty, malformed or truncated output (%s, %s)', async (content, reason) => {
    await expect(
      requestJson([], {
        apiKey: 'test',
        fetchImpl: async () => response(completion(content, reason)),
      }),
    ).rejects.toThrow();
  });
  it('does not retry credentials errors or expose response bodies', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ error: 'sensitive' }, 401));
    await expect(requestJson([], { apiKey: 'test', fetchImpl })).rejects.toThrow(
      'DeepSeek HTTP 401',
    );
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});

describe('publication gate', () => {
  const valid = {
    report: { status: 'validated', mode: 'apply', baseSha: 'base', sourceSha: 'source' },
    head: 'base',
    remote: 'base',
    submodule: 'source',
    paths: ['src/assets/data/rasy.json', statePath],
    state: { sourceSha: 'source' },
  };
  it('accepts only validated changes on the original main', () => {
    expect(() => assertPublishable(valid)).not.toThrow();
    expect(() => assertPublishable({ ...valid, remote: 'advanced' })).toThrow('main changed');
    expect(() =>
      assertPublishable({ ...valid, report: { ...valid.report, publicationDisabled: true } }),
    ).toThrow('Dry-run');
    expect(() => assertPublishable({ ...valid, submodule: 'wrong' })).toThrow('SHA');
    expect(() => assertPublishable({ ...valid, paths: ['.github/workflows/deploy.yml'] })).toThrow(
      'Unexpected',
    );
    expect(() =>
      assertPublishable({ ...valid, report: { ...valid.report, status: 'failed' } }),
    ).toThrow('validated');
  });
});

const temporary = [];
afterEach(async () => {
  await Promise.all(temporary.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});
async function fixture(withState = false) {
  const root = await mkdtemp(join(tmpdir(), 'compendium-test-'));
  temporary.push(root);
  for (const dir of [
    'Battlesword-4.000/tworzenie_postaci/rasy',
    'src/assets/data',
    'src/app/models',
    'scripts/compendium',
    '.github',
  ]) {
    await mkdir(join(root, dir), { recursive: true });
  }
  const repo = join(root, 'Battlesword-4.000');
  git(repo, 'init', '-q');
  await writeFile(join(repo, source), '# Elf');
  git(repo, 'add', '.');
  git(repo, '-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'rules');
  const sha = git(repo, 'rev-parse', 'HEAD');
  const data = { ...emptyData(), race: [entry] };
  for (const [type, [file]] of Object.entries(categories))
    await writeFile(join(root, 'src/assets/data', file), JSON.stringify(data[type]));
  await writeFile(join(root, 'src/assets/data/index.json'), JSON.stringify(buildIndex(data)));
  await copyFile(
    resolve('src/app/models/compendium.ts'),
    join(root, 'src/app/models/compendium.ts'),
  );
  await copyFile(
    resolve('scripts/compendium/prompt.md'),
    join(root, 'scripts/compendium/prompt.md'),
  );
  await writeFile(join(root, '.gitignore'), '.compendium-sync/\n');
  if (withState)
    await writeFile(
      join(root, statePath),
      JSON.stringify({ version: 1, upstream, sourceSha: sha, model: 'deepseek-flash' }),
    );
  git(root, 'init', '-q');
  git(root, 'add', 'src', 'scripts', '.github', '.gitignore');
  git(root, 'update-index', '--add', '--cacheinfo', `160000,${sha},Battlesword-4.000`);
  git(
    root,
    '-c',
    'user.name=Test',
    '-c',
    'user.email=test@example.com',
    'commit',
    '-qm',
    'baseline',
  );
  return { root, repo, sha };
}
function fakeExtractor(messages) {
  const input = JSON.parse(messages[1].content);
  return result(
    input.previousEntries,
    [],
    new Map(input.ownedSources.map(({ path, text }) => [path, text])),
  );
}

describe('complete offline synchronization', () => {
  it('bootstraps all categories in dry-run without changing tracked files or baseline', async () => {
    const { root, sha } = await fixture();
    const request = vi.fn(fakeExtractor);
    const report = await synchronize({ root, request });
    expect(report.initial).toBe(true);
    expect(request).toHaveBeenCalledTimes(14);
    expect(git(root, 'status', '--porcelain')).toBe('');
    await validateDirectory(root, join(root, '.compendium-sync/data'), sha);
    const state = JSON.parse(await readFile(join(root, '.compendium-sync/state.json'), 'utf8'));
    expect(state.sourceSha).toBe(sha);
  });
  it('saves inconsistency findings with commit-pinned source links', async () => {
    const { root, sha } = await fixture();
    const request = vi.fn((messages) => {
      const generated = fakeExtractor(messages);
      if (JSON.parse(messages[1].content).category === 'race') {
        generated.findings = [
          {
            id: 'missing_shock',
            name: 'Brak opisu Szoku',
            source,
            status: 'detailed',
            kind: 'missing_detail',
            details: 'Źródło wymienia Szok bez objaśnienia.',
            evidence: '1 poziom Szoku',
            relatedSources: [source],
            relatedEntryIds: [],
          },
        ];
      }
      return generated;
    });
    await synchronize({ root, request });
    const findings = JSON.parse(
      await readFile(join(root, '.compendium-sync/data/niespojnosci.json'), 'utf8'),
    );
    expect(findings[0].revision).toBe(sha);
    await validateDirectory(root, join(root, '.compendium-sync/data'), sha);
  });
  it('does not call AI for an already synchronized SHA', async () => {
    const { root } = await fixture(true);
    const request = vi.fn();
    const report = await synchronize({ root, request });
    expect(report.batches).toEqual([]);
    expect(request).not.toHaveBeenCalled();
  });
  it('applies a validated update and advances metadata together with the submodule', async () => {
    const { root, repo } = await fixture(true);
    await writeFile(join(repo, source), '# Elf\n+1 do Siły');
    git(repo, 'add', '.');
    git(
      repo,
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      'commit',
      '-qm',
      'bonus',
    );
    const target = git(repo, 'rev-parse', 'HEAD');
    const request = vi.fn((messages) => {
      const generated = fakeExtractor(messages);
      generated.entries = [{ ...entry, status: 'detailed', bonuses: ['+1 do Siły'] }];
      return generated;
    });
    await synchronize({ root, target, apply: true, request });
    expect(request).toHaveBeenCalledTimes(1);
    expect(JSON.parse(await readFile(join(root, statePath), 'utf8')).sourceSha).toBe(target);
    await validateDirectory(root, join(root, 'src/assets/data'), target);
  });
  it('leaves data and metadata untouched when extraction fails', async () => {
    const { root } = await fixture(true);
    await expect(
      synchronize({
        root,
        full: true,
        apply: true,
        request: async () => {
          throw new Error('API failed');
        },
      }),
    ).rejects.toThrow('API failed');
    expect(git(root, 'status', '--porcelain')).toBe('');
  });
  it('rejects a corrupt index', async () => {
    const { root } = await fixture(true);
    await writeFile(join(root, 'src/assets/data/index.json'), '[]');
    await expect(validateDirectory(root, join(root, 'src/assets/data'))).rejects.toThrow('Index');
  });
  it('keeps a rejected model answer for diagnosis without applying any data', async () => {
    const { root } = await fixture(true);
    const rejected = { ...result(), unresolved: ['Contradictory rule values'] };
    await expect(
      synchronize({ root, full: true, apply: true, request: async () => rejected }),
    ).rejects.toThrow('unresolved');
    expect(
      JSON.parse(await readFile(join(root, '.compendium-sync/responses/race.json'), 'utf8')),
    ).toEqual(rejected);
    expect(git(root, 'status', '--porcelain')).toBe('');
  });
});
