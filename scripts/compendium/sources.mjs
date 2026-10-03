import { execFileSync } from 'node:child_process';
import { posix } from 'node:path';
import { categories, sourceCategories, compare } from './schema.mjs';

export const upstream = 'https://github.com/Iwanuss/Battlesword-4.000';
export function git(cwd, ...args) {
  return execFileSync('git', ['-C', cwd, ...args], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  }).trimEnd();
}

export function readSnapshot(repo, sha) {
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Expected full commit SHA');
  const result = new Map();
  const records = git(repo, 'ls-tree', '-rz', sha).split('\0').filter(Boolean);
  for (const record of records) {
    const tab = record.indexOf('\t');
    const [mode, kind] = record.slice(0, tab).split(' ');
    const path = record.slice(tab + 1);
    if (!path.endsWith('.md') && !['manifest.me', 'TODO'].includes(path)) continue;
    if (kind !== 'blob' || !['100644', '100755'].includes(mode)) {
      throw new Error(`Source must be a regular file: ${path}`);
    }
    if (path.startsWith('/') || path.split('/').some((part) => ['..', '.', ''].includes(part))) {
      throw new Error(`Unsafe source path: ${path}`);
    }
    const text = git(repo, 'show', `${sha}:${path}`);
    if (Buffer.byteLength(text) > 300_000) throw new Error(`Source too large: ${path}`);
    result.set(path, text);
  }
  if (!result.size) throw new Error('Upstream snapshot contains no rule files');
  return result;
}

const exact = {
  'tworzenie_postaci/perki.md': ['perk'],
  'mechaniki_bazowe/statystyki.md': ['stat'],
  'mechaniki_bazowe/szczęście.md': ['stat', 'mechanic'],
  'mechaniki_bazowe/sława.md': ['stat', 'mechanic'],
  'mechaniki_bazowe/poczytalność.md': ['stat', 'mechanic'],
  'mechaniki_bazowe/mądrość.md': ['stat', 'mechanic'],
  'ekwipunek/majętność.md': ['stat', 'mechanic'],
  'ekwipunek/broń.md': ['weapon'],
  'ekwipunek/pancerze.md': ['armor'],
  'ekwipunek/paski.md': ['belt'],
  'ekwipunek/przedmioty_podręczne.md': ['handItem'],
  'ekwipunek/reszta_ekwipunku.md': ['miscItem'],
  'walka/stamina_mana_i_podsatwowe_ataki.md': ['stat', 'combat'],
  'bestiariusz/rodzaje_oponentów.md': ['combat'],
};
const prefixes = {
  'tworzenie_postaci/rasy/': 'race',
  'tworzenie_postaci/profesje/': 'profession',
  'tworzenie_postaci/klasy/': 'class',
  'ekwipunek/przedmioty_magiczne/': 'magicItem',
  'mechaniki_bazowe/': 'mechanic',
  'walka/': 'combat',
  'bestiariusz/': 'monster',
};
const contextOnly = new Set([
  'manifest.me',
  'TODO',
  'patch_notes.md',
  'tworzenie_postaci/tworzenie_postaci.md',
]);

export function sourceTypes(path, data) {
  const types = new Set(
    sourceCategories.filter((type) => data[type].some((e) => e.source === path)),
  );
  if (exact[path]) exact[path].forEach((type) => types.add(type));
  else {
    const prefix = Object.keys(prefixes).find((prefix) => path.startsWith(prefix));
    if (prefix) types.add(prefixes[prefix]);
  }
  if (!types.size && !contextOnly.has(path)) throw new Error(`Unmapped rule source: ${path}`);
  return [...types];
}

function links(path, text, sources) {
  const result = [];
  // Inline and reference-style Markdown links. Never fetch external URLs.
  const targets = [...text.matchAll(/\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/g)].map((m) => m[1]);
  targets.push(...[...text.matchAll(/^\s*\[[^\]]+\]:\s*<?([^\s>]+)/gm)].map((m) => m[1]));
  for (const target of targets) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) continue;
    let decoded;
    try {
      decoded = decodeURIComponent(target.split('#')[0]);
    } catch {
      continue;
    }
    const resolved = posix.normalize(posix.join(posix.dirname(path), decoded));
    if (sources.has(resolved)) result.push(resolved);
  }
  return result;
}

export function makeBatches(before, after, data, full = false) {
  const changed = new Set(
    [...new Set([...before.keys(), ...after.keys()])].filter(
      (path) => before.get(path) !== after.get(path),
    ),
  );
  const batches = [];
  // Keep deleted and renamed files in the mapping so their former category is reconciled too.
  const all = new Map([...before, ...after]);
  const mapping = new Map([...all.keys()].map((path) => [path, sourceTypes(path, data)]));
  for (const type of sourceCategories) {
    const owned = [...mapping]
      .filter(([, types]) => types.includes(type))
      .map(([path]) => path)
      .sort(compare);
    const context = new Set(owned);
    // Core rules affect derived descriptions even where the original Markdown has no hyperlinks.
    for (const path of all.keys()) {
      if (
        path.startsWith('mechaniki_bazowe/') ||
        path.startsWith('walka/') ||
        contextOnly.has(path)
      )
        context.add(path);
      if (
        type === 'magicItem' &&
        ['weapon', 'armor', 'belt'].some((t) => mapping.get(path).includes(t))
      )
        context.add(path);
    }
    for (const path of context) {
      for (const snapshot of [before, after]) {
        for (const target of links(path, snapshot.get(path) ?? '', all)) context.add(target);
      }
    }
    if (full || [...context].some((path) => changed.has(path))) {
      batches.push({
        type,
        owned,
        context: [...context].sort(compare),
        changed: [...changed].filter((p) => context.has(p)),
      });
    }
  }
  return { changed: [...changed].sort(compare), batches };
}
