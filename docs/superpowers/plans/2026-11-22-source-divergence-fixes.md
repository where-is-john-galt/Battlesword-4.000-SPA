# Rozjazd aplikacji i źródła — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Usunąć rozjazd między kompendium a źródłem `Battlesword-4.000` (poza tworzeniem postaci): zsynchronizować submoduł, odtworzyć streszczone zasady, zdeduplikować Niespójności, naprawić provenance i doprowadzić dokumentację do rzeczywistości.

**Architecture:** Bez nowych zależności i bez przebudowy schematu. `Rule.definition` przyjmuje tekst wielolinijkowy, a karta zasady renderuje go przez `white-space: pre-line`. Brakujące sekcje stają się osobnymi wpisami `mechanic`/`combat` z wpisem w `index.json`. Deduplikacja Niespójności to jednorazowy skrypt na danych + trwały test regresyjny. Dokumentacja i stopka opisują faktyczny stan.

**Tech Stack:** Angular 22 standalone, Tailwind v4, Vitest, Playwright, statyczne JSON w `src/assets/data/`.

**Spec:** `docs/superpowers/specs/2026-11-22-source-divergence-fixes-design.md`

## Global Constraints

- Nie dodawaj zależności npm.
- Nie edytuj plików wewnątrz `Battlesword-4.000/`; wolno tylko zmienić checkout submodułu.
- Zachowuj literówki źródła (`sukesców`, `automatycznmie`, `Kawalerysjki`, `Głebin`).
- JSON: 2 spacje, końcowy newline, bez zmian istniejących `id` poza `stamina_mana_walka`.
- Każdy nowy wpis danych musi mieć wpis w `index.json` z tym samym `id`, `type`, `name`, `source`, `status`.
- `detailed` znaczy „ma kartę”, nie „1:1”; polityka wierności trafia do `docs/UTRZYMANIE.md`.
- Tworzenie postaci jest poza zakresem.
- Repo należy do `oskarc35`; zapisuj pliki z zachowaniem właściciela: `sudo install -o oskarc35 -g oskarc35 -m 644 <tmp> <target>`.
- Testy: `npm test -- --watch=false`. Build: `npm run build -- --base-href /Battlesword-4.000-SPA/`. E2E: `npm run test:e2e`.

## Review Focus

- **Nowe linie w `definition` zlewają się w jeden akapit** → zasady nieczytelne. Test: `white-space` w e2e (Task 2) + regresja `linkify` (Task 2).
- **Nowy wpis bez wpisu w `index.json`** → karta istnieje, ale jest niewidoczna w listach i wyszukiwaniu. Test: każdy task danych sprawdza indeks.
- **Dedupe usuwa wpis, do którego prowadzą `relatedEntryIds`** → martwe linki w Niespójnościach. Test: scalanie powiązań i brak martwych referencji (Task 3).
- **Zmiana `id` walki psuje stare linki/ulubione** → 404 lub zły wpis. Test: unikalność `id` i brak starego `(id, type)` (Task 11).
- **Wyłączenie Niespójności z wyszukiwania ukrywa oczekiwane wyniki** → użytkownik nie znajduje sekcji. Test e2e: wynik „Morale” jest, grupa Niespójności nie (Task 4).

---

### Task 1: Zsynchronizuj submoduł ze źródłem danych

**Files:**
- Modify: `Battlesword-4.000` (gitlink)

**Interfaces:**
- Consumes: nic.
- Produces: checkout `d8a3524`, z którego pochodzą wszystkie JSON-y.

- [ ] **Step 1: Potwierdź obecny stan**

Run:
```bash
git -C Battlesword-4.000 rev-parse HEAD
git -C Battlesword-4.000 rev-parse origin/master
```
Expected: `0f32397...` i `d8a3524...`.

- [ ] **Step 2: Przełącz submoduł na wersję danych**

Run:
```bash
git -C Battlesword-4.000 checkout d8a3524
git -C Battlesword-4.000 status --short
```
Expected: `HEAD is now at d8a3524 Wrażliwość, Nić Czasu`; status pusty.

- [ ] **Step 3: Zapisz wskaźnik i zweryfikuj**

Run:
```bash
git add Battlesword-4.000
git commit -m "chore: sync source submodule to d8a3524"
git ls-files -s Battlesword-4.000
```
Expected: linia zaczyna się od `160000 d8a352450e093cdb4d1bb032f5b3b8d70db9ac9d 0 Battlesword-4.000`.

---

### Task 2: Renderuj wielolinijkowe definicje

**Files:**
- Modify: `src/app/features/cards/rule-card/rule-card.scss:5-10`
- Modify: `e2e/compendium.spec.ts`
- Test: `src/app/services/rules-link.service.spec.ts`

**Interfaces:**
- Consumes: nic.
- Produces: klasa `.rule__definition` z `white-space: pre-line`, `overflow-wrap: anywhere`.

- [ ] **Step 1: Dopisz test e2e, który sprawdza computed style**

W `e2e/compendium.spec.ts` dodaj:
```ts
test('rules card preserves line breaks', async ({ page }) => {
  await page.goto('/karta/combat/tereny_specjalne');
  const whiteSpace = await page
    .locator('.rule__definition')
    .evaluate((el) => getComputedStyle(el).whiteSpace);
  expect(whiteSpace).toBe('pre-line');
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm run test:e2e -- -g "preserves line breaks"`
Expected: FAIL, `whiteSpace` to `normal`.

- [ ] **Step 3: Dodaj regresję linkowania nowych linii**

W `src/app/services/rules-link.service.spec.ts` dodaj:
```ts
it('preserves newlines between tokens', () => {
  expect(service.linkify('Linia\nPorażenie')).toEqual([
    { text: 'Linia\n' },
    { text: 'Porażenie', link: { type: 'combat', id: 'porażenie' } },
  ]);
});
```

- [ ] **Step 4: Dodaj style**

W `src/app/features/cards/rule-card/rule-card.scss` w `.rule__definition` dodaj:
```scss
white-space: pre-line;
overflow-wrap: anywhere;
```

- [ ] **Step 5: Uruchom testy**

Run: `npm test -- --watch=false` oraz `npm run test:e2e -- -g "preserves line breaks"`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/features/cards/rule-card/rule-card.scss src/app/services/rules-link.service.spec.ts e2e/compendium.spec.ts
git commit -m "fix: render multi-line rule definitions"
```

---

### Task 3: Deduplikuj Niespójności

**Files:**
- Create: `src/app/services/niespojnosci-data.spec.ts`
- Modify: `src/assets/data/niespojnosci.json`
- Modify: `src/assets/data/index.json`

**Interfaces:**
- Consumes: Task 1 (źródło w `d8a3524`).
- Produces: 378 unikalnych wpisów Niespójności; scalone `relatedSources` i `relatedEntryIds`.

- [ ] **Step 1: Napisz test regresyjny**

Utwórz `src/app/services/niespojnosci-data.spec.ts`:
```ts
import niespojnosciJson from '../../assets/data/niespojnosci.json';
import indexJson from '../../assets/data/index.json';
import type { Inconsistency, IndexEntry } from '../models/compendium';

const niespojnosci = niespojnosciJson as unknown as Inconsistency[];
const index = indexJson as unknown as IndexEntry[];

describe('niespojnosci.json — deduplikacja', () => {
  it('nie zawiera duplikatów source+details+evidence', () => {
    const keys = niespojnosci.map((e) => `${e.source}|${e.details}|${e.evidence}`);
    expect(keys.length - new Set(keys).size).toBe(0);
  });

  it('zostawia po jednym wpisie dla znanych grup', () => {
    expect(
      niespojnosci.filter((e) => e.name === 'Morale: niejasny wpływ pojedynczego poziomu Paniki'),
    ).toHaveLength(1);
    expect(niespojnosci.filter((e) => e.name === "Majętność: literówka 'okreslana'")).toHaveLength(1);
  });

  it('nie ma wpisów indeksu bez danych', () => {
    const ids = new Set(niespojnosci.map((e) => e.id));
    expect(index.filter((e) => e.type === 'inconsistency' && !ids.has(e.id))).toEqual([]);
  });

  it('nie ma martwych relatedEntryIds', () => {
    const ids = new Set(index.map((e) => e.id));
    for (const entry of niespojnosci) {
      for (const related of entry.relatedEntryIds) {
        expect(ids.has(related)).toBe(true);
      }
    }
  });

  it('ma 378 wpisów po deduplikacji', () => {
    expect(niespojnosci).toHaveLength(378);
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — duplikaty i liczba 553.

- [ ] **Step 3: Uruchom jednorazowy skrypt deduplikacji**

Run:
```bash
node --input-type=module <<'EOF'
import fs from 'node:fs';
const DATA = 'src/assets/data';
const incPath = `${DATA}/niespojnosci.json`;
const idxPath = `${DATA}/index.json`;
const inc = JSON.parse(fs.readFileSync(incPath, 'utf8'));
const index = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
const byKey = new Map();
for (const entry of inc) {
  const key = `${entry.source}|${entry.details}|${entry.evidence}`;
  const kept = byKey.get(key);
  if (!kept) {
    byKey.set(key, entry);
    continue;
  }
  kept.relatedSources = [...new Set([...(kept.relatedSources ?? []), ...(entry.relatedSources ?? [])])];
  kept.relatedEntryIds = [
    ...new Set([...(kept.relatedEntryIds ?? []), ...(entry.relatedEntryIds ?? [])]),
  ];
}
const keptInc = [...byKey.values()];
const keptIds = new Set(keptInc.map((e) => e.id));
const keptIndex = index.filter((e) => e.type !== 'inconsistency' || keptIds.has(e.id));
fs.writeFileSync(incPath, JSON.stringify(keptInc, null, 2) + '\n');
fs.writeFileSync(idxPath, JSON.stringify(keptIndex, null, 2) + '\n');
console.log(`niespojnosci: ${inc.length} -> ${keptInc.length}; index: ${index.length} -> ${keptIndex.length}`);
EOF
```
Expected: `niespojnosci: 553 -> 378; index: 1044 -> 869`.

- [ ] **Step 4: Uruchom testy**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/services/niespojnosci-data.spec.ts src/assets/data/niespojnosci.json src/assets/data/index.json
git commit -m "fix(data): dedupe inconsistencies and rebuild index"
```

---

### Task 4: Wyłącz Niespójności z globalnego wyszukiwania

**Files:**
- Modify: `src/app/features/pages/szukaj/szukaj-page.ts:40-46`
- Modify: `e2e/compendium.spec.ts`

**Interfaces:**
- Consumes: Task 3 (dane po dedupe).
- Produces: `results` zawiera tylko wpisy typu innego niż `inconsistency`.

- [ ] **Step 1: Dopisz test e2e**

W `e2e/compendium.spec.ts` dodaj:
```ts
test('search does not show meta inconsistencies', async ({ page }) => {
  await page.goto('/szukaj?q=morale');
  await expect(page.getByRole('link', { name: /^Morale$/ }).first()).toBeVisible();
  await expect(page.getByText('Niespójności · Niespójność')).toHaveCount(0);
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm run test:e2e -- -g "meta inconsistencies"`
Expected: FAIL — grupa „Niespójności · Niespójność” istnieje.

- [ ] **Step 3: Odfiltruj meta-wpisy**

W `szukaj-page.ts` zmień `results`:
```ts
return this.compendium
  .index()
  .filter((entry) => entry.type !== 'inconsistency')
  .filter((entry) => normalize(entry.name).includes(query));
```

- [ ] **Step 4: Uruchom test**

Run: `npm run test:e2e -- -g "meta inconsistencies"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/features/pages/szukaj/szukaj-page.ts e2e/compendium.spec.ts
git commit -m "fix(search): hide inconsistency meta entries from global search"
```

---

### Task 5: Usuń wymyśloną statystykę Bariera

**Files:**
- Modify: `src/assets/data/statystyki.json`
- Modify: `src/assets/data/index.json`
- Create: `src/app/services/statystyki-data.spec.ts`

**Interfaces:**
- Consumes: nic.
- Produces: brak wpisu `bariera` w statystykach i indeksie.

- [ ] **Step 1: Napisz test**

Utwórz `src/app/services/statystyki-data.spec.ts`:
```ts
import statsJson from '../../assets/data/statystyki.json';
import type { Stat } from '../models/compendium';

const stats = statsJson as unknown as Stat[];

describe('statystyki.json — źródłowość', () => {
  it('nie zawiera statystyki Bariera bez definicji w źródle', () => {
    expect(stats.find((e) => e.id === 'bariera')).toBeUndefined();
  });

  it('każda statystyka ma źródło i definicję', () => {
    for (const entry of stats) {
      expect(entry.source).toMatch(/\.md$/);
      expect(entry.definition.length).toBeGreaterThan(10);
    }
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — `bariera` istnieje.

- [ ] **Step 3: Usuń wpis z danych i indeksu**

W `statystyki.json` usuń obiekt `id: "bariera"`. W `index.json` usuń wpis `id: "bariera", type: "stat"`.

- [ ] **Step 4: Uruchom testy i sprawdź brak referencji**

Run:
```bash
npm test -- --watch=false
grep -R '"bariera"' src/assets/data
```
Expected: PASS; `grep` bez wyników.

- [ ] **Step 5: Commit**

```bash
git add src/app/services/statystyki-data.spec.ts src/assets/data/statystyki.json src/assets/data/index.json
git commit -m "fix(data): remove unsourced Bariera stat"
```

---

### Task 6: Dodaj skalę rzadkości z Majętności

**Files:**
- Modify: `src/assets/data/mechaniki.json`
- Modify: `src/assets/data/index.json`
- Modify: `src/app/services/mechaniki-data.spec.ts`

**Interfaces:**
- Consumes: Task 1 (źródło `d8a3524`).
- Produces: wpis `rzadkosc_przedmiotow_majetnosc` typu `mechanic`.

- [ ] **Step 1: Dopisz testy**

W `mechaniki-data.spec.ts` dodaj:
```ts
describe('mechaniki.json — rzadkość przedmiotów z Majętności', () => {
  const entry = () => mechaniki.find((e) => e.id === 'rzadkosc_przedmiotow_majetnosc');

  it('ma źródło ekwipunek/majętność.md', () => {
    expect(entry()?.source).toBe('ekwipunek/majętność.md');
  });

  it('odwzorowuje całą skalę', () => {
    expect(entry()?.definition).toContain('Niezwykłe - Zapewniają jeden prosty bonus');
    expect(entry()?.definition).toContain('Rzadkie - Zapewniają dwa proste bonusy');
    expect(entry()?.definition).toContain('Boskie - Pozwalają na kształtowanie');
  });

  it('jest w indeksie', () => {
    expect(
      index.some((e) => e.id === 'rzadkosc_przedmiotow_majetnosc' && e.type === 'mechanic'),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — brak wpisu.

- [ ] **Step 3: Dodaj wpis**

W `mechaniki.json` po wpisach z `ekwipunek/majętność.md` dodaj:
```json
{
  "id": "rzadkosc_przedmiotow_majetnosc",
  "name": "Rzadkość przedmiotów (Majętność)",
  "definition": "<skopiuj 1:1 sekcję 'Rzadkość przedmiotów' z ekwipunek/majętność.md, linie 18-24, zachowując literówki>",
  "source": "ekwipunek/majętność.md",
  "status": "detailed"
}
```
W `index.json` dodaj w bloku `mechanic`:
```json
{
  "id": "rzadkosc_przedmiotow_majetnosc",
  "type": "mechanic",
  "name": "Rzadkość przedmiotów (Majętność)",
  "source": "ekwipunek/majętność.md",
  "status": "detailed"
}
```

- [ ] **Step 4: Uruchom testy**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/mechaniki.json src/assets/data/index.json src/app/services/mechaniki-data.spec.ts
git commit -m "feat(data): add Majętność rarity scale"
```

---

### Task 7: Odtwórz efekty terenów

**Files:**
- Modify: `src/assets/data/walka.json`
- Modify: `src/assets/data/index.json`
- Modify: `src/app/services/walka-data.spec.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces: 11 wpisów `combat` o źródle `walka/typy_terenów.md`.

- [ ] **Step 1: Dopisz testy**

W `walka-data.spec.ts` dodaj:
```ts
describe('walka.json — tereny z walka/typy_terenów.md', () => {
  const ids = [
    'woda',
    'bagno',
    'spaczony',
    'zamrozony',
    'podpalony',
    'zagrzybialy',
    'uswiecony',
    'naelektryzowany',
    'zadymiony',
    'strawiony',
    'halucynogenny',
  ];

  it('ma wpis dla każdego terenu', () => {
    for (const id of ids) {
      expect(combat(id).source).toBe('walka/typy_terenów.md');
      expect(indexEntry(id).status).toBe('detailed');
    }
  });

  it('zachowuje wartości źródłowe', () => {
    expect(combat('spaczony').definition).toContain('2k10');
    expect(combat('spaczony').definition).toContain('5k10');
    expect(combat('woda').definition).toContain('2 akcje');
    expect(combat('zadymiony').definition).toContain('utrudnieniem');
    expect(combat('halucynogenny').definition).toContain('połowę obrażeń');
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — brak wpisów.

- [ ] **Step 3: Dodaj 11 wpisów i indeks**

W `walka.json` po istniejących wpisach z `walka/typy_terenów.md` dodaj wpisy `woda`, `bagno`, `spaczony`, `zamrozony`, `podpalony`, `zagrzybialy`, `uswiecony`, `naelektryzowany`, `zadymiony`, `strawiony`, `halucynogenny`.

Zasady:
- `name`: `Woda (teren)`, `Bagno (teren)`, pozostałe dokładnie jak nagłówki źródła.
- `definition`: pełny tekst sekcji `###` z `walka/typy_terenów.md`, 1:1, z zachowaniem literówek.
- `source`: `walka/typy_terenów.md`, `status`: `detailed`.

W `index.json` w bloku `combat` dodaj 11 wpisów z tymi samymi `id`, `name`, `source`, `status`.

- [ ] **Step 4: Uruchom testy**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/walka.json src/assets/data/index.json src/app/services/walka-data.spec.ts
git commit -m "feat(data): restore terrain effects"
```

---

### Task 8: Odtwórz tabele craftingu

**Files:**
- Modify: `src/assets/data/mechaniki.json`
- Modify: `src/assets/data/index.json`
- Modify: `src/app/services/mechaniki-data.spec.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces: 5 wpisów `mechanic` o źródle `mechaniki_bazowe/crafting.md`.

- [ ] **Step 1: Dopisz testy**

W `mechaniki-data.spec.ts` dodaj:
```ts
describe('mechaniki.json — crafting z mechaniki_bazowe/crafting.md', () => {
  const ids = [
    'testy_wytworstwa',
    'baza_przedmiotu',
    'eksperymentalna_rzadkosc',
    'eksperymentalne_bonusy_niezwykle_rzadkie',
    'eksperymentalne_bonusy_potezne',
  ];

  it('ma wszystkie sekcje i wpisy w indeksie', () => {
    for (const id of ids) {
      expect(mechaniki.find((e) => e.id === id)?.source).toBe('mechaniki_bazowe/crafting.md');
      expect(index.some((e) => e.id === id && e.type === 'mechanic')).toBe(true);
    }
  });

  it('odwzorowuje tabele', () => {
    const niezwykle = mechaniki.find(
      (e) => e.id === 'eksperymentalne_bonusy_niezwykle_rzadkie',
    )!.definition;
    expect(niezwykle.split('\n').filter((l) => /^\d+-\d+:/.test(l))).toHaveLength(48);
    expect(niezwykle).toContain('99-100: Poczytalność (Ułatwienie) +3');

    const potezne = mechaniki.find(
      (e) => e.id === 'eksperymentalne_bonusy_potezne',
    )!.definition;
    expect(potezne.split('\n').filter((l) => /^\d+-\d+:/.test(l))).toHaveLength(33);
    expect(potezne).toContain('100: Boska');
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — brak wpisów.

- [ ] **Step 3: Dodaj wpisy**

W `mechaniki.json` po istniejących wpisach z `mechaniki_bazowe/crafting.md` dodaj:
- `testy_wytworstwa` — sekcja `## Testy wytwórstwa`,
- `baza_przedmiotu` — sekcja `### Baza przedmiotu`,
- `eksperymentalna_rzadkosc` — sekcja `### Eksperymentalna rzadkość`,
- `eksperymentalne_bonusy_niezwykle_rzadkie` — sekcja `### Eksperymentalne bonusy (niezwykłe / rzadkie)`,
- `eksperymentalne_bonusy_potezne` — sekcja `### Eksperymentalne bonusy (potężne+)`.

Każdy `definition` kopiuj 1:1; wiersze tabel zapisz jako linie `1-2: Siła +1` (bez `*`). `source`: `mechaniki_bazowe/crafting.md`, `status`: `detailed`.

Dodaj 5 wpisów do `index.json` w bloku `mechanic`.

- [ ] **Step 4: Uruchom testy**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/mechaniki.json src/assets/data/index.json src/app/services/mechaniki-data.spec.ts
git commit -m "feat(data): restore crafting tables and procedures"
```

---

### Task 9: Odtwórz Delirium, testy Poczytalności i zwiększanie Szczęścia

**Files:**
- Modify: `src/assets/data/mechaniki.json`
- Modify: `src/assets/data/index.json`
- Modify: `src/app/services/mechaniki-data.spec.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces: 2 nowe wpisy `mechanic` + rozszerzony `delirium`.

- [ ] **Step 1: Dopisz testy**

W `mechaniki-data.spec.ts` dodaj:
```ts
describe('mechaniki.json — Poczytalność i Szczęście', () => {
  it('odwzorowuje tabelę Delirium', () => {
    const delirium = mechaniki.find((e) => e.id === 'delirium')!.definition;
    for (const text of [
      'Wypaczenie przedmiotu',
      'Panika',
      'Zamknięcie się w sobie',
      'Zwidy',
      'Irracjonalność',
      'Bezsenność',
      'Przygnębienie',
      'Złamana wola',
      'Otępienie',
      'Szał bojowy',
    ]) {
      expect(delirium).toContain(text);
    }
    expect(delirium).toContain('1k5');
    expect(delirium).toContain('-10');
  });

  it('ma testy poczytalności i zwiększanie szczęścia', () => {
    expect(mechaniki.find((e) => e.id === 'testy_poczytalnosci')?.definition).toContain('1k100');
    expect(mechaniki.find((e) => e.id === 'zwiekszanie_szczescia')?.definition).toContain(
      'koniec każdej sesji',
    );
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — brak tabeli i wpisów.

- [ ] **Step 3: Rozszerz i dodaj wpisy**

- `delirium`: w `definition` dopisz pełną tabelę 1-10 z `mechaniki_bazowe/poczytalność.md`, każdy efekt w nowej linii.
- Dodaj `testy_poczytalnosci` z sekcją `## Testy poczytalności` (źródło `mechaniki_bazowe/poczytalność.md`).
- Dodaj `zwiekszanie_szczescia` z sekcją `## Zwiększanie Szczęścia` (źródło `mechaniki_bazowe/szczęście.md`).
- Dodaj 2 wpisy do `index.json` w bloku `mechanic`.

- [ ] **Step 4: Uruchom testy**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/mechaniki.json src/assets/data/index.json src/app/services/mechaniki-data.spec.ts
git commit -m "feat(data): restore Delirium table, sanity tests and Luck advancement"
```

---

### Task 10: Uzupełnij morale i efekty akcji

**Files:**
- Modify: `src/assets/data/walka.json`
- Modify: `src/app/services/walka-data.spec.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces: rozszerzone `zlamane_morale`, `akcje_glowne`, `reakcje`; bez nowych `id`.

- [ ] **Step 1: Dopisz testy**

W `walka-data.spec.ts` dodaj:
```ts
describe('walka.json — morale i akcje', () => {
  it('zawiera modyfikatory pościgu', () => {
    const morale = combat('zlamane_morale').definition;
    expect(morale).toContain('Każdy sektor różnicy');
    expect(morale).toContain('-3');
  });

  it('opisuje efekty akcji', () => {
    expect(combat('akcje_glowne').definition).toContain(
      'zadaje obrażenia równe obrażeniom dzierżonej broni',
    );
    expect(combat('reakcje').definition).toContain('Przyjęcie ciosu');
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — brak modyfikatorów i opisów.

- [ ] **Step 3: Rozszerz definicje**

- `zlamane_morale`: dopisz z `walka/morale.md` listę modyfikatorów pościgu (`-1` za sektor, `-2` za ułatwienie terenowe przeciwnika, `+2` za ułatwienie Bohatera, `-1/-2/-3` za elitę/mistrza/bossa).
- `akcje_glowne`: dopisz po jednym zdaniu efektu dla każdej akcji z `walka/akcje.md` (Atak, Ruch, Analiza, Ukrywanie, Postawa obronna, Stworzenie otwarcia, Użycie przedmiotu, Zdolność specjalna, Szukanie, Dowodzenie).
- `reakcje`: dopisz efekty Wsparcia, Reakcji specjalnej, Przekazania przedmiotu i Przyjęcia ciosu.

- [ ] **Step 4: Uruchom testy**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/walka.json src/app/services/walka-data.spec.ts
git commit -m "feat(data): restore morale pursuit and action effects"
```

---

### Task 11: Usuń zduplikowany identyfikator stamina_mana

**Files:**
- Modify: `src/assets/data/walka.json`
- Modify: `src/assets/data/index.json`
- Create: `src/app/services/index-data.spec.ts`

**Interfaces:**
- Consumes: nic.
- Produces: unikalne `id` w indeksie; wpis walki `stamina_mana_walka`.

- [ ] **Step 1: Napisz test**

Utwórz `src/app/services/index-data.spec.ts`:
```ts
import indexJson from '../../assets/data/index.json';
import type { IndexEntry } from '../models/compendium';

const index = indexJson as unknown as IndexEntry[];

describe('index.json — unikalność identyfikatorów', () => {
  it('ma unikalne id', () => {
    const ids = index.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nie zawiera starego id walki', () => {
    expect(index.some((e) => e.id === 'stamina_mana' && e.type === 'combat')).toBe(false);
  });
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm test -- --watch=false`
Expected: FAIL — dwa wpisy mają `id` `stamina_mana` (stat i combat).

- [ ] **Step 3: Zmień id wpisu walki**

W `walka.json` zmień `id: "stamina_mana"` na `id: "stamina_mana_walka"` (nazwa bez zmian). W `index.json` zrób to samo dla wpisu `type: "combat"`.

- [ ] **Step 4: Uruchom testy**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/services/index-data.spec.ts src/assets/data/walka.json src/assets/data/index.json
git commit -m "fix(data): make stamina_mana ids unique"
```

---

### Task 12: Doprowadź dokumentację do rzeczywistości

**Files:**
- Modify: `docs/propozycja-aplikacji.md`
- Modify: `docs/UTRZYMANIE.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 3, 4, 6, 11 (nowy stan danych i wyszukiwania).
- Produces: dokumentacja bez nieistniejącego Glosariusza i bez obietnicy wyszukiwania po tagach.

- [ ] **Step 1: Zaktualizuj `docs/propozycja-aplikacji.md`**

- W §1 zamień „Glosariusz — definicje pojęć z tooltipami” na „Linkowanie pojęć w treści — statystyki, mechaniki i walka podlinkowane w opisach; bez osobnej sekcji”.
- W §2 tabelę sekcji zamień na: Postać (`rasy`, `profesje`, `klasy`, `perki`), Statystyki (`statystyki`), Mechaniki (`mechaniki`), Ekwipunek (6 plików), Walka (`walka`), Bestiariusz (`bestiariusz`), Niespójności (`niespojnosci`), Ulubione (localStorage). Usuń wiersz `Glosariusz` / `glosariusz.json`.
- W §3.2 zmień „Wyszukiwanie pełnotekstowe po `index.json` (nazwy obiektów, kategorie, tagi, statusy)” na „Wyszukiwanie po nazwach z `index.json`; wpisy Niespójności są dostępne w swojej sekcji, ale nie w globalnych wynikach”.
- W §4 usuń zdanie o `GlossaryEntry`, jeśli występuje; zostaw listę realnych typów.

- [ ] **Step 2: Zaktualizuj `docs/UTRZYMANIE.md`**

- W „Ręczna aktualizacja danych” zamień punkt „przenieś treść 1:1” na politykę:
  - tabele i statblocki: 1:1,
  - proza: sekcja po sekcji, z zachowaniem literówek, uzupełniana testami tokenów,
  - `detailed` = karta istnieje, nie gwarantuje 1:1.
- Dodaj krok: każdy nowy wpis dostaje wpis w `index.json` i test w `src/app/services/*-data.spec.ts`.
- W „Znane luki” usuń punkt o wskaźniku submodułu (Task 1) i o `patch_notes` (Task 13). Zostaw `validate-data.mjs`, brak CI i e2e.
- Dopisz, że Niespójności są deduplikowane po `source + details + evidence`, a meta-wpisy nie trafiają do wyszukiwania.

- [ ] **Step 3: Zastąp `README.md`**

Napisz krótki README: cel repo, źródło prawdy w submodule, komendy `npm start`, `npm run build`, `npm test -- --watch=false`, `npm run test:e2e`, `npm run storybook`, oraz link do `docs/UTRZYMANIE.md` dla publikacji. Usuń domyślny tekst Angulara i `ng e2e`.

- [ ] **Step 4: Sprawdź brak nieaktualnych twierdzeń**

Run:
```bash
grep -R "glosariusz.json\|GlossaryEntry\|Wyszukiwanie pełnotekstowe\|ng e2e" docs README.md || true
```
Expected: brak wyników.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/propozycja-aplikacji.md docs/UTRZYMANIE.md
git commit -m "docs: describe actual compendium structure and sync policy"
```

---

### Task 13: Pokaż wersję źródła w stopce

**Files:**
- Create: `src/app/models/source.ts`
- Modify: `src/app/features/shell/shell.ts`
- Modify: `src/app/features/shell/shell.html`
- Modify: `src/app/features/shell/shell.scss`
- Modify: `e2e/compendium.spec.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces: `SOURCE_VERSION`, `SOURCE_REVISION`, `SOURCE_PATCH_NOTES_URL`.

- [ ] **Step 1: Dopisz test e2e**

W `e2e/compendium.spec.ts` dodaj:
```ts
test('footer shows source version and revision', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toContainText('0.1.24');
  await expect(footer).toContainText('d8a3524');
});
```

- [ ] **Step 2: Uruchom test, żeby zobaczyć porażkę**

Run: `npm run test:e2e -- -g "source version"`
Expected: FAIL — stopka nie zawiera wersji.

- [ ] **Step 3: Dodaj stałe i stopkę**

Utwórz `src/app/models/source.ts`:
```ts
export const SOURCE_VERSION = '0.1.24';
export const SOURCE_REVISION = 'd8a3524';
export const SOURCE_PATCH_NOTES_URL = `https://github.com/Iwanuss/Battlesword-4.000/blob/${SOURCE_REVISION}/patch_notes.md`;
```

W `shell.ts` zaimportuj stałe i wystaw je jako `protected readonly` (`sourceVersion`, `sourceRevision`, `patchNotesUrl`).

W `shell.html` w `<footer>` dodaj przed notką o ikonach:
```html
<a class="shell__footer-link" [href]="patchNotesUrl" target="_blank" rel="noopener noreferrer">
  Źródło: {{ sourceVersion }} · {{ sourceRevision }}
</a>
```

W `shell.scss` dodaj:
```scss
.shell__footer-link {
  display: block;
  margin-bottom: 8px;
  color: var(--color-bronze);
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;

  &:hover {
    color: var(--color-gold);
  }
}
```

- [ ] **Step 4: Uruchom test**

Run: `npm run test:e2e -- -g "source version"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/models/source.ts src/app/features/shell/shell.ts src/app/features/shell/shell.html src/app/features/shell/shell.scss e2e/compendium.spec.ts
git commit -m "feat(shell): show source version and revision"
```

---

### Task 14: Domknij weryfikację całości

**Files:**
- Modify: `e2e/compendium.spec.ts`

**Interfaces:**
- Consumes: wszystkie poprzednie taski.
- Produces: test mobilny długiej karty + pełny zielony build.

- [ ] **Step 1: Dopisz test mobilny**

W `e2e/compendium.spec.ts` dodaj:
```ts
test('long rules card fits a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/karta/combat/tereny_specjalne');
  await expect(page.locator('app-rule-card')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflow).toBe(false);
});
```

- [ ] **Step 2: Uruchom pełne testy jednostkowe**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 3: Uruchom build produkcyjny**

Run: `npm run build -- --base-href /Battlesword-4.000-SPA/`
Expected: PASS, brak błędów typów i szablonów.

- [ ] **Step 4: Uruchom pełne e2e**

Run: `npm run test:e2e`
Expected: PASS wszystkich testów.

- [ ] **Step 5: Commit**

```bash
git add e2e/compendium.spec.ts
git commit -m "test(e2e): cover long rules on mobile"
```
