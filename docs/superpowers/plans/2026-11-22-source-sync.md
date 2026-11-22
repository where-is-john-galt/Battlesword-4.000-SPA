# Synchronizacja danych SPA ze źródłem 0.1.24–0.1.26 — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Uzupełnić kompendium o treść 8 commitów źródła `0f32397..d8a3524` i pokryć ją testami.

**Architecture:** Zmiany wyłącznie w commitowanych JSON-ach (`src/assets/data/`) i testach Vitest. Bez zmian komponentów: istniejące karty i listy renderują wszystkie potrzebne pola. Każdy wpis zachowuje schemat z `src/app/models/compendium.ts`.

**Tech Stack:** Angular 22, Vitest, statyczne JSON-y, TypeScript.

**Spec:** `docs/superpowers/specs/2026-11-22-source-sync-design.md`

## Global Constraints

- Język i treść po polsku; identyfikatory wpisów stabilne.
- Zachowujemy literówki i błędy źródła; nie normalizujemy treści poza enumami typów/rzadkości.
- Nie edytujemy submodułu `Battlesword-4.000/`.
- Nie zmieniamy UI ani konfiguracji workflow.
- Każdy nowy wpis trafia też do `index.json` z tym samym `id`, `type`, `name`, `source`, `status`.

## Review Focus

- Polskie znaki w `id` i `source` nie mogą się rozjechać między JSON-ami i indeksem.
- Zaduma nie może dalej pokazywać usuniętych wymagań ani angielskiego tekstu.
- Rzadkość `Arcymistrzowski` ze źródła musi być w danych `Arcymistrzowskie`.
- Literówki źródła muszą pozostać w treści i być widoczne w Niespójnościach.
- Nowe wpisy nie mogą duplikować istniejących `id` ani psuć linkowania.

---

### Task 1: Nowe przedmioty magiczne i aktualizacja Zadumy

**Files:**
- Test: `src/app/services/compendium-data.spec.ts` (dopisz na końcu)
- Modify: `src/assets/data/przedmioty_magiczne.json`
- Modify: `src/assets/data/index.json`
- Modify: `src/assets/data/niespojnosci.json`

**Interfaces:**
- Consumes: `MagicItem`, `IndexEntry`, `Inconsistency` z `src/app/models/compendium.ts`.
- Produces: wpisy magicItem o id: `nić_czasu`, `korona_bladego_króla_za_zasłoną_nocy`,
  `korona_zwycięzcy_brązowej_brody`, `plazmoidyczne_symulakrum`,
  `koło_wozu_skrzydlatej_fortecy`, `przebudzenie_destrukcji_z_rozkazu_lotu_pochodu_duchów`,
  `serce_zniszczenia`, `amulet`; zaktualizowany `zaduma_świtu_otulającego_lodowy_grobowiec`.

- [ ] **Step 1: Napisz testy nowych przedmiotów**

Dopisz `describe('przedmioty_magiczne.json — synchronizacja 0.1.24–0.1.26', ...)` z asercjami:

```ts
const SYNC_REVISION = 'd8a352450e093cdb4d1bb032f5b3b8d70db9ac9d';
const items = [
  ['nić_czasu', 'Nić Czasu', 'Pancerz', 'Boskie', 'ekwipunek/przedmioty_magiczne/boskie/nić_czasu.md'],
  ['korona_bladego_króla_za_zasłoną_nocy', 'Korona Bladego Króla Za Zasłoną Nocy', 'Hełm', 'Arcymistrzowskie', 'ekwipunek/przedmioty_magiczne/arcymistrzowskie/korona_bladego_króla_za_zasłoną_nocy.md'],
  ['korona_zwycięzcy_brązowej_brody', 'Korona Zwycięzcy Brązowej Brody', 'Hełm', 'Arcymistrzowskie', 'ekwipunek/przedmioty_magiczne/arcymistrzowskie/korona_zwycięzcy_brązowej_brody.md'],
  ['plazmoidyczne_symulakrum', 'Plazmoidyczne Symulakrum', 'Pierścień', 'Arcymistrzowskie', 'ekwipunek/przedmioty_magiczne/arcymistrzowskie/plazmoidyczne_symulakrum.md'],
  ['koło_wozu_skrzydlatej_fortecy', 'Koło Wozu Skrzydlatej Fortecy', 'Tarcza', 'Arcymistrzowskie', 'ekwipunek/przedmioty_magiczne/arcymistrzowskie/koło_wozu_skrzydlatej_fortecy.md'],
  ['przebudzenie_destrukcji_z_rozkazu_lotu_pochodu_duchów', 'Przebudzenie Destrukcji z Rozkazu Lotu Pochodu Duchów', 'Buty', 'Mityczne', 'ekwipunek/przedmioty_magiczne/mityczny/przebudzenie_destrukcji_z_rozkazu_lotu_pochodu_duchów.md'],
  ['serce_zniszczenia', 'Serce Zniszczenia', 'Amulet', 'Potężne', 'ekwipunek/przedmioty_magiczne/potężne/serce_zniszczenia.md'],
  ['amulet', 'Amulet Sprytnego Wytrzymywania Kwasu na Farcie', 'Amulet', 'Potężne', 'ekwipunek/przedmioty_magiczne/potężne/amulet.md'],
] as const;
```

Asercje szczegółowe:
- `nić_czasu`: `barrier === 39`, `modifiers` długość 5, `description` zawiera `Ostatnim żywiołem do opanowania jest sam Czas.`
- `korona_bladego…`: `modifiers` 8, `corrupted` 2, opis zawiera `Bezświatły świat` i `rozkwitajace`.
- `korona_zwycięzcy…`: `modifiers` 8, `corrupted` 1, opis zawiera `Nieskończona rzeka ciał`.
- `plazmoidyczne_symulakrum`: `modifiers` równe `['Kopiuje drugi wyekwipowany pierścień']`, opis `Potęga to kwestia perspektywy`.
- `koło_wozu…`: `armor === 3`, `modifiers` 9, `corrupted` 2, opis zawiera `Leć na zachodnim wietrze` i `przeciniwka`.
- `przebudzenie…`: `modifiers` 10, opis zawiera `Potęga burzy` i `Przeklęci maszerują wiecznie`.
- `serce_zniszczenia`: `modifiers` 4, `corrupted` 2, opis zawiera `niezlicoznych`.
- `amulet`: `effects` równe `['Odporność na żrące', 'Spryt +1', 'Wytrzymałość +1']`, `corrupted` 2, `modifiers` undefined, `description` undefined.
- każdy wpis: `status === 'detailed'` i `source` równy wartości z tabeli.

Test aktualizacji Zadumy:
- `requirements` jest `undefined`,
- `description` nie zawiera `Enfolding Dawn`, `Icetomb`, `Cirel of Caer Tarth`,
- `description` zawiera `Ani nocny blask` i `Pytonż IV z Altdris`,
- `modifiers` nadal 10, `corrupted` nadal 6.

Test indeksu: dla każdego z 8 id `indexEntry(id)` zwraca `type === 'magicItem'` i właściwy `source`.

Test Niespójności: istnieją wpisy o id `serce_zniszczenia_typo_niezlicoznych`,
`koło_wozu_typo_przeciniwka`, `korona_bladego_typo_rozkwitajace`,
`rzadkosc_arcymistrzowska_odmiana`; każdy ma `status === 'detailed'`,
`revision === SYNC_REVISION`, a wskazane źródło zawiera oczekiwaną literówkę.
Każdy jest też w indeksie jako `type === 'inconsistency'`.

- [ ] **Step 2: Uruchom testy — mają nie przejść**

Run: `npm test -- --watch=false`
Expected: FAIL — brak wpisów `nić_czasu` itd.

- [ ] **Step 3: Dodaj 8 przedmiotów do `przedmioty_magiczne.json`**

Odczytaj treść z `git show origin/master:<ścieżka>` w submodule (albo z listy źródeł
w teście) i przenieś ją 1:1:
- `modifiers` z sekcji `## Modyfikatory` / `## Właściwości` (dla `amulet` — `effects`),
- `corrupted` z `**Spaczony**` / `**Spaczone**`,
- `armor`/`barrier` z nagłówka,
- `description` z `## Opis` (zachowaj `\n\n`).
Nie dodawaj pól, których nie ma w źródle. `amulet` nie ma `description`.

- [ ] **Step 4: Zaktualizuj Zadumę**

Usuń `requirements` i cały angielski blok z `description`; zostaw polskie akapity
i podpis `- Pytonż IV z Altdris`.

- [ ] **Step 5: Dodaj wpisy do `index.json` i Niespójności**

8 wpisów magicItem, 4 wpisy inconsistency (`serce_zniszczenia_typo_niezlicoznych`,
`koło_wozu_typo_przeciniwka`, `korona_bladego_typo_rozkwitajace`,
`rzadkosc_arcymistrzowska_odmiana`) oraz ich wpisy w indeksie. Nowe Niespójności:
`kind: 'typo'` (poza odmianą rzadkości: `kind: 'other'`), `revision: 'd8a352450e093cdb4d1bb032f5b3b8d70db9ac9d'`.

- [ ] **Step 6: Uruchom testy — mają przejść**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/assets/data/przedmioty_magiczne.json src/assets/data/index.json src/assets/data/niespojnosci.json src/app/services/compendium-data.spec.ts
git commit -m "feat(data): sync magic items from source 0.1.24-0.1.26"
```

---

### Task 2: Wrażliwość, Trening i ścieżka skrytobójcy

**Files:**
- Test: `src/app/services/walka-data.spec.ts`
- Test: `src/app/services/mechaniki-data.spec.ts` (nowy)
- Test: `src/app/services/klasy-data.spec.ts` (nowy)
- Modify: `src/assets/data/walka.json`
- Modify: `src/assets/data/mechaniki.json`
- Modify: `src/assets/data/klasy.json`
- Modify: `src/assets/data/index.json`
- Modify: `src/assets/data/niespojnosci.json`

**Interfaces:**
- Consumes: `Rule`, `CharacterClass`, `IndexEntry`.
- Produces: `walka` id `wrażliwość`; zaktualizowane `statusy_pojedyncze`, `trening`;
  `klasy` id `skrytobójca` ze źródłem `tworzenie_postaci/klasy/skrytobójca_(nieskończone).md`.

- [ ] **Step 1: Napisz testy**

`walka-data.spec.ts`:
- `combat('wrażliwość')`: name `Wrażliwość`, source `walka/statusy.md`, definition
  zawiera `zwiększone o połowę` i `niezależnie od odporności`, `aliases` zawiera `wrażliwości`.
- `combat('statusy_pojedyncze').definition` zawiera `Wrażliwość`.
- `indexEntry('wrażliwość')` ma `type` combat i właściwe źródło.

`mechaniki-data.spec.ts`:
- `mechaniki.find(id === 'trening')`: definition zawiera `test statystyki`,
  `sukesców / 3`, `zaokrąglone w górę`; nie zawiera `zwiększa się o 1`.
- `index` zawiera `trening` typu mechanic.
- Niespójność `przerwy_typo_sukescow` istnieje, ma `revision` `d8a352450e093cdb4d1bb032f5b3b8d70db9ac9d`
  i jest w indeksie jako inconsistency.

`klasy-data.spec.ts`:
- `klasy.find(id === 'skrytobójca')`: `name === 'Skrytobójca'`, source
  `tworzenie_postaci/klasy/skrytobójca_(nieskończone).md`.
- wpis indeksu `skrytobójca` ma to samo źródło.

- [ ] **Step 2: Uruchom testy — mają nie przejść**

Run: `npm test -- --watch=false`
Expected: FAIL — brak `wrażliwość`, stara definicja treningu, stara ścieżka.

- [ ] **Step 3: Zaktualizuj dane**

- `walka.json`: dodaj `wrażliwość` (definition: `Następne otrzymane przez postać obrażenia są zwiększone o połowę. Mnożnik ten nakłada się niezależnie od odporności i podatności na obrażenia.`, aliases `['wrażliwości']`); w `statusy_pojedyncze` dopisz `, Wrażliwość` przed kropką.
- `mechaniki.json`: podmień definicję `trening` na: `Postać poświęca czas na szlifowanie swoich umiejętności bojowych. Za każdą poświęconą na to akcję, należy wykonać test statystyki najbardziej powiązanej z wykonywaną profesją. Bazowa Stamina / Mana zwiększa się o ilość sukesców / 3, zaokrąglone w górę, do następnej przerwy.`
- `klasy.json`: zmień tylko `source` skrytobójcy.
- `index.json`: dodaj `wrażliwość` (combat), zmień źródło `skrytobójca`, dodaj wpis `przerwy_typo_sukescow`.
- `niespojnosci.json`: dodaj `przerwy_typo_sukescow` (`kind: 'typo'`, źródło `mechaniki_bazowe/przerwy_miedzy_przygodami.md`, `relatedEntryIds: ['trening']`, revision jw.).

- [ ] **Step 4: Uruchom testy — mają przejść**

Run: `npm test -- --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/walka.json src/assets/data/mechaniki.json src/assets/data/klasy.json src/assets/data/index.json src/assets/data/niespojnosci.json src/app/services/walka-data.spec.ts src/app/services/mechaniki-data.spec.ts src/app/services/klasy-data.spec.ts
git commit -m "feat(data): sync combat, training and class path from source"
```

---

### Task 3: Weryfikacja całości i publikacja

- [ ] **Step 1: Pełne testy**

Run: `npm test -- --watch=false`
Expected: PASS, bez pominiętych testów.

- [ ] **Step 2: Build produkcyjny**

Run: `npm run build -- --base-href /Battlesword-4.000-SPA/`
Expected: `Application bundle generation complete.`

- [ ] **Step 3: Sprawdź brak duplikatów i spójność indeksu**

Run: `node -e "const fs=require('fs');const inv=['przedmioty_magiczne','walka','mechaniki','klasy','niespojnosci'];for(const f of inv){const d=JSON.parse(fs.readFileSync('src/assets/data/'+f+'.json'));const ids=d.map(e=>e.id);if(new Set(ids).size!==ids.length)throw new Error('duplikat w '+f)};console.log('ids ok')"`
Expected: `ids ok`.

- [ ] **Step 4: Commit planu i push**

```bash
git add docs/superpowers
git commit -m "docs: add source sync plan"
git push origin main
```
