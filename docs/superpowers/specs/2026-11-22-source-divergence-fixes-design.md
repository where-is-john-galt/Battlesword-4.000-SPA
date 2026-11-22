# Rozjazd aplikacji i źródła — design poprawek

**Data:** 2026-11-22
**Autor:** audyt źródło ↔ SPA
**Status:** do review

## Cel

Usunąć rozjazd między kompendium a submodułem `Battlesword-4.000/`, zachowując obecny stos i nie dodając zależności. Zakres obejmuje wszystkie ustalenia audytu **poza tworzeniem postaci**, które na życzenie użytkownika zostaje poza zakresem.

## Zakres

W zakresie:

1. Zsynchronizowanie wskaźnika submodułu z wersją, z której pochodzą dane (`d8a3524`).
2. Odtworzenie brakujących treści zasad w 6 plikach, które audyt wskazał jako streszczone:
   - `walka/typy_terenów.md`,
   - `mechaniki_bazowe/crafting.md`,
   - `mechaniki_bazowe/poczytalność.md`,
   - `mechaniki_bazowe/szczęście.md`,
   - `walka/morale.md`,
   - `walka/akcje.md`.
3. Deduplikacja `niespojnosci.json` (175 dokładnych kopii) i wyłączenie meta-wpisów z globalnego wyszukiwania.
4. Usunięcie wymyślonej statystyki `Bariera`.
5. Dodanie brakującej sekcji „Rzadkość przedmiotów” z `ekwipunek/majętność.md`.
6. Doprowadzenie dokumentacji do rzeczywistości (sekcje, Glosariusz, wyszukiwanie, polityka 1:1).
7. Widoczna wersja źródła w stopce.
8. Zmiana zduplikowanego `id` `stamina_mana`.
9. Ustalenie znaczenia `status: detailed` i opisanie go w dokumentacji.

Poza zakresem:

- Tworzenie postaci (`tworzenie_postaci/tworzenie_postaci.md`) — świadomie odłożone.
- `manifest.me`, `TODO` — dokumentacja projektowa/roadmapa, nie zasady; bez zmian.
- Przebudowa schematu JSON, nowe komponenty tabel, wyszukiwanie pełnotekstowe, osobna sekcja Glosariusza.
- Zmiany wizualne poza `white-space` w karcie zasady i linkiem w stopce.

## Decyzje

1. **Bez nowego schematu.** `Rule.definition` może zawierać znaki nowej linii. Karta zasady dostaje `white-space: pre-line`, więc tabele i listy źródłowe są czytelne bez nowego komponentu.
2. **Brakujące sekcje stają się osobnymi wpisami**, a nie jednym wielkim wpisem:
   - tereny: 11 wpisów (`woda`, `bagno`, 9 terenów specjalnych),
   - crafting: 5 wpisów (testy, baza, rzadkość, bonusy niezwykłe/rzadkie, bonusy potężne+),
   - poczytalność: 1 nowy wpis (`testy_poczytalnosci`) + rozszerzone `delirium`,
   - szczęście: 1 nowy wpis (`zwiekszanie_szczescia`),
   - morale i akcje: rozszerzenie istniejących wpisów.
3. **Treść 1:1 z plikiem źródłowym**, z zachowaniem literówek (np. `sukesców`, `automatycznmie`, `Kawalerysjki`).
4. **Deduplikacja po `source + details + evidence`.** Zostaje pierwszy wpis, a `relatedSources` i `relatedEntryIds` są scalane. `index.json` usuwa wpisy usuniętych `id`.
5. **Niespójności nie pojawiają się w globalnym wyszukiwaniu.** Sekcja `/niespojnosci` pozostaje bez zmian.
6. **`Bariera` znika ze statystyk.** Nie ma definicji w `mechaniki_bazowe/statystyki.md`; wartości „bazowa Bariera” pozostają w klasach i pancerzach.
7. **`detailed` znaczy „ma kartę”, nie „1:1”.** Polityka wierności jest opisana w `docs/UTRZYMANIE.md`: tabele i statblocki 1:1, proza uzupełniana testami tokenów.
8. **Wersja źródła w stopce** to stała `SOURCE_VERSION` + `SOURCE_REVISION` w `src/app/models/source.ts`, z linkiem do `patch_notes.md` w revision.
9. **Zduplikowany `id`**: wpis walki dostaje `stamina_mana_walka`; nazwa pozostaje `Stamina / Mana (walka)`.
10. **Dokumentacja opisuje rzeczywistość, nie zamiary.** Usuwamy `glosariusz.json` i obietnicę wyszukiwania po tagach; opisujemy linkowanie pojęć w treści.

## Kryteria akceptacji

- `git ls-files -s Battlesword-4.000` wskazuje `d8a3524`.
- Każdy nowy wpis ma odpowiadający wpis w `index.json` z tym samym `id`, `type`, `name`, `source` i `status`.
- `niespojnosci.json` nie ma duplikatów `source + details + evidence`; liczba wpisów spada z 553 do 378.
- Wyszukiwanie `morale` nie pokazuje grupy „Niespójności”.
- W `statystyki.json` nie ma `bariera`.
- W `mechaniki.json` jest wpis o źródle `ekwipunek/majętność.md` z pełną skalą rzadkości.
- Karta `tereny_specjalne` na 390 px nie powoduje poziomego przewijania.
- Stopka pokazuje `0.1.24` i link do `patch_notes.md`.
- Wszystkie `id` w `index.json` są unikalne.
- `npm test -- --watch=false`, `npm run build -- --base-href /Battlesword-4.000-SPA/` i `npm run test:e2e` przechodzą.

## Ryzyka

- Ręczne kopiowanie tabel może wprowadzić literówkę sprzeczną ze źródłem; testy tokenów i review źródła to łapią.
- `white-space: pre-line` może pogorszyć wygląd krótkich definicji; sprawdzamy e2e i Storybook.
- Dedupe może usunąć wpis, do którego prowadzą `relatedEntryIds`; test scalania i brak martwych referencji.
- Wyłączenie Niespójności z wyszukiwania może zaskoczyć użytkownika; sekcja pozostaje dostępna z nawigacji.
