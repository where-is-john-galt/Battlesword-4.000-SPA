import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'src', 'assets', 'data');

const MAGIC_RARITIES = ['Niezwykłe', 'Rzadkie', 'Potężne', 'Arcymistrzowskie', 'Mityczne', 'Boskie'];
const MAGIC_TYPES = [
  'Amulet',
  'Buty',
  'Hełm',
  'Peleryna',
  'Rękawice',
  'Pierścień',
  'Tarcza',
  'Pancerz',
  'Broń',
  'Broń dystansowa',
  'Pas',
];

const files = {
  rasy: { file: 'rasy.json', type: 'race', expected: 17, detailed: 6 },
  profesje: { file: 'profesje.json', type: 'profession', expected: 40, detailed: 7 },
  klasy: { file: 'klasy.json', type: 'class', expected: 34, detailed: 7 },
  perki: { file: 'perki.json', type: 'perk', expected: 32, detailed: 32 },
  bron: { file: 'bron.json', type: 'weapon', expected: 25, detailed: 25 },
  pancerze: { file: 'pancerze.json', type: 'armor', expected: 25, detailed: 25 },
  paski: { file: 'paski.json', type: 'belt', expected: 8, detailed: 8 },
  przedmioty_podreczne: { file: 'przedmioty_podreczne.json', type: 'handItem', expected: 28, detailed: 28 },
  przedmioty_magiczne: { file: 'przedmioty_magiczne.json', type: 'magicItem', expected: 44, detailed: 44 },
  bestiariusz: { file: 'bestiariusz.json', type: 'monster', expected: 10, detailed: 10 },
  reszta_ekwipunku: { file: 'reszta_ekwipunku.json', type: 'miscItem', expected: 6, detailed: 6 },
  glosariusz: { file: 'glosariusz.json', type: 'glossary', expected: 39, detailed: 39 }
};

let failed = false;
const index = [];

for (const [key, cfg] of Object.entries(files)) {
  const path = join(dataDir, cfg.file);
  let data;
  try {
    data = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(`[FAIL] ${cfg.file}: niepoprawny JSON — ${err.message}`);
    failed = true;
    continue;
  }

  const detailed = data.filter((e) => e.status === 'detailed').length;
  const stubs = data.filter((e) => e.status === 'stub').length;
  const total = data.length;

  const uniqueIds = new Set(data.map((e) => e.id));
  if (uniqueIds.size !== total) {
    console.error(`[FAIL] ${cfg.file}: zduplikowane id`);
    failed = true;
  }

  if (total !== cfg.expected || detailed !== cfg.detailed) {
    console.error(
      `[FAIL] ${cfg.file}: oczekiwano ${cfg.expected} wpisów (${cfg.detailed} detailed), jest ${total} (${detailed} detailed, ${stubs} stub)`
    );
    failed = true;
  } else {
    console.log(`[ok] ${cfg.file}: ${total} wpisów (${detailed} detailed, ${stubs} stub)`);
  }

  for (const e of data) {
    if (!e.id || !e.name || !e.source || !e.status) {
      console.error(`[FAIL] ${cfg.file}: brak wymaganego pola w ${e.id ?? '(brak id)'}`);
      failed = true;
    }
    if (cfg.type === 'magicItem') {
      if (!MAGIC_RARITIES.includes(e.rarity)) {
        console.error(`[FAIL] ${cfg.file}: nieznana rzadkość "${e.rarity}" w ${e.id}`);
        failed = true;
      }
      if (!MAGIC_TYPES.includes(e.type)) {
        console.error(`[FAIL] ${cfg.file}: nieznany typ "${e.type}" w ${e.id}`);
        failed = true;
      }
    }
    index.push({ id: e.id, type: cfg.type, name: e.name, source: e.source, status: e.status });
  }
}

writeFileSync(join(dataDir, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`[ok] index.json: ${index.length} wpisów`);

if (failed) {
  process.exit(1);
}
console.log('Walidacja zakończona pomyślnie.');
