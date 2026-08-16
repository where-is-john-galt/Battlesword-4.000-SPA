# Propozycja aplikacji — Battlesword 4.000 Kompendium

Dokument opisuje propozycję aplikacji internetowej (SPA), która w przystępny sposób prezentuje zasady
systemu RPG **Battlesword 4.000** w formie **kompendium** — przeszukiwalnego, nawigowalnego zbioru
informacji o systemie.

Źródłem prawdy o zasadach jest submodule `Battlesword-4.000/` (pliki Markdown). Aplikacja **nie**
zastępuje tych plików — jest warstwą prezentacyjną na ich bazie.

Zakres celowo **ograniczony do kompendium**: bez kreatora postaci, bez cyfrowej karty postaci, bez
kalkulatorów i trackerów walki. To leksykon i podręcznik referencyjny.

---

## 1. Cel i filozofia

- **Podręcznik online** — czytelne, nawigowalne zasady zamiast surowych plików `.md`.
- **Kompendium treści** — rasy, profesje, klasy, perki, ekwipunek i bestiariusz jako przeglądalne,
  filtrowalne karty.
- **Szybkie wyszukiwanie** — znalezienie reguły, statystyki, broni czy przeciwnika w kilka sekund.
- **Zawsze aktualne** — treść generowana z submodułu, dzięki czemu zmiany zasad upstream są widoczne
  po aktualizacji submodułu.

Ton: klimatyczny, dark-fantasy (spójny z `docs/DESIGN.md`, inspiracja Baldur's Gate 3), ale z
priorytetem czytelności — to narzędzie referencyjne, nie wizytówka.

---

## 2. Architektura informacji

Podział na sekcje odpowiadające strukturze submodułu:

| Sekcja | Zawartość (źródło w submodule) |
|--------|--------------------------------|
| **Zasady / Podręcznik** | `mechaniki_bazowe/` — testy, statystyki, rozwój postaci, poczytalność, mądrość, sława, szczęście, crafting, przerwy między przygodami; oraz `tworzenie_postaci/tworzenie_postaci.md` — proces tworzenia postaci |
| **Walka** | `walka/` — akcje, inicjatywa, ruch, rzuty na atak, obrażenia i śmierć, statusy, morale, miniony, skradanie, dual wielding, typy terenów, pojazdy i wierzchowce |
| **Postać** | `tworzenie_postaci/` — rasy, profesje, klasy, perki |
| **Ekwipunek** | `ekwipunek/` — broń, pancerze, paski, przedmioty podręczne, majętność, reszta ekwipunku |
| **Bestiariusz** | `bestiariusz/` — rodzaje oponentów, statblocki (nieumarli, zwierzaki) |
| **Patch notes** | `patch_notes.md`, `TODO` — kronika zmian i roadmapa systemu |
| **Ulubione** | — (wybór użytkownika, zapis w localStorage; nie pochodzi z submodułu) |

Dodatkowo: **glosariusz** pojęć typu „Bramy Śmierci", „ułatwienie", „obrażenia eskalujące",
„Bariera", „Majętność" — z tooltipami podpiętymi pod całą aplikację.

**Dlaczego „Tworzenie postaci" nie jest osobną sekcją:** katalog `tworzenie_postaci/` w submodule
miesza dwie rzeczy — jednorazowy **proces** tworzenia (plik `tworzenie_postaci.md`) oraz **opcje
postaci** (rasy, profesje, klasy, perki), z których gracz korzysta przez cały cykl życia bohatera:
przy tworzeniu, przy rozwoju (wydawanie PD na perki/umiejętności) i w trakcie gry (cechy pasywne,
umiejętności bojowe, wyposażenie). Dlatego w nawigacji je rozdzielamy:

- **proces tworzenia** → sekcja *Zasady / Podręcznik* (to reguła, nie treść referencyjna),
- **opcje postaci** → sekcja *Postać* jako stałe, przeszukiwalne kompendium opcji.

---

## 3. Funkcje szczegółowe

### 3.1. Podręcznik (przeglądarka zasad)

- Renderowanie plików Markdown z submodułu z **nawigacją boczną** (drzewo katalogów).
- **Wyszukiwarka pełnotekstowa** po wszystkich zasadach (np. fraza „pochwycenie" → trafienia w
  `stamina_mana_i_podsatwowe_ataki.md`, `statusy.md` itd.).
- **Linkowanie krzyżowe**: pojęcia (statystyki, statusy, bronie, klasy, perki) są automatycznie
  wykrywane i linkują do definicji / karty obiektu.
- **Tooltipy glosariusza** na terminach (np. „ułatwienie" = „rzut 2k20, wybierasz lepszy").
- Czytelne oznaczenia bloków: poziomy trudności, tabele rzutów (k100 crafting, delirium), listy
  wzmocnień kosztujących Staminę/Manę.

### 3.2. Kompendium (karty obiektów)

- **Rasy** — karty z bonusami, rozmiarem, cechą pasywną i umiejętnością aktywną.
- **Profesje** — karty z predyspozycjami, majętnością/sławą, cechami, wyposażeniem startowym i
  przerwą profesyjną.
- **Klasy** — karty pogrupowane po archetypach, z predyspozycjami, umiejętnościami bojowymi,
  uzbrojeniem i sposobem liczenia PŻ.
- **Perki** — karty z wymaganiami, kosztem PD i opisem.
- **Ekwipunek** — broń, pancerze, paski, przedmioty podręczne jako filtrowalne/sortowalne tabele
  (typ broni, bazowa statystyka, użycie, wymagana majętność).
- **Bestiariusz** — statblocki (typ, tagi, odporności/podatności, HP, pancerz, akcje) w czytelnej
  formie; filtrowanie po typie (Trep/Elita/Mistrz/Boss) i tagach.

Każda karta obiektu posiada **filtry** (np. klasy wg archetypu, broń wg bazowej statystyki) oraz
**linkowanie krzyżowe** do powiązanych obiektów (profesja → predyspozycje, klasa → archetyp).

### 3.3. Ulubione

- Każda pozycja (zasada, karta rasy/profesji/klasy/perku, element ekwipunku, statblock, wpis
  patch notes) ma przycisk **dodania do ulubionych** (ikona gwiazdki/serducha).
- Osobna **zakładka Ulubione** agreguje wszystkie zapisane pozycje, z możliwością grupowania wg
  sekcji oraz usuwania pojedynczych wpisów.
- Ulubione są **trwałe**: zapisywane w `localStorage` (identyfikatory pozycji + typ), więc
  przetrwają odświeżenie i kolejne sesje na tym samym urządzeniu/przeglądarce.
- Opcjonalnie: sortowanie wg daty dodania, kolejność ręczna (przeciąganie) w przyszłości.

### 3.4. Patch notes / roadmap

- Kronika zmian (`patch_notes.md`) i status prac (`TODO`) w formie listy wersji z filtrem.

---

## 4. Podejście do danych

Kluczowa decyzja architektoniczna: **jak zamienić Markdown submodułu na dane aplikacji**.

- Submoduł jest źródłem prawdy i **nie może być edytowany** z tego repo.
- Strategia: **opencode (zainstalowany w devcontainerze) konwertuje Markdown → ustrukturyzowany
  JSON**, w procesie *offline* (jednorazowo lub przy aktualizacji submodułu), a nie w runtime. Wynik
  zapisywany jako pliki JSON/TS w `src/assets/data/` (lub generowane moduły TS) i **commitowany do
  repo**.
- Dla plików tabelarycznych (broń, pancerze, paski, przedmioty podręczne, wierzchowce, pojazdy) —
  mapowanie tabel Markdown do obiektów.
- Dla plików opisowych (rasy, profesje, klasy, perki, bestiariusz) — mapowanie nagłówków, list i
  sekcji na pola struktury (nazwa, sekcje, listy, wymagania, koszty).
- Dla tekstu zasad — renderowanie Markdown z rozszerzeniami (tooltipy, linkowanie, komponenty
  specjalne) zamiast generowania struktury.

**Dlaczego opencode zamiast skryptu-parsera:** pliki submodułu są luźne i niespójne (swobodna
polszczyzna, mieszane tabele/listy/nagłówki, sekcje o różnej strukturze). Ręczny parser byłby kruchy
i wymagałby ciągłych poprawek przy każdej zmianie upstream. opencode (agent LLM) solidniej radzi
sobie z mapowaniem semantycznym (np. rozpoznanie, że „Koszt wykupienia"/„Wymagania"/„Opis" perka to
pola struktury), a do tego jest już dostępny w środowisku — bez dodatkowego kosztu zewnętrznego API.

**Warunki brzegowe (bez nich LLM jest ryzykowny):**

1. **Ścisły schemat JSON** per typ encji, z walidacją (liczba rekordów, kompletność pól) — łapie
   pominięcia i nadmiarowe pozycje.
2. **Ekstrakcja wierna** — bez przepisywania/streszczania; zakaz dopowiadania danych spoza źródła
   (zero halucynacji — każda wartość musi pochodzić z pliku).
3. **Zdeterminowany, wersjonowany output** — wygenerowany JSON commitowany, dzięki czemu SPA jest
   w pełni statyczne i niezależne od LLM w runtime; przy aktualizacji submodułu generujesz ponownie
   i porównujesz diff.
4. **Zadanie opencode (agent/subagent)** — zdefiniowana instrukcja dla opencode, która czyta pliki
   submodułu, zwraca JSON zgodny ze schematem i nie rusza samych plików źródłowych. Walidacja
   uruchamiana po generacji; ewentualnie wywołanie przez `opencode run` w `tools/` do automatyzacji.

**Koszty i kompromisy (do akceptacji):** koszt jest jednorazowy i ograniczony (tylko przy
generacji/aktualizacji, nigdy w runtime); wyjście bywa niedeterministyczne — stąd wymóg walidacji i
kontroli wersji (diff między generacjami pokazuje tylko rzeczywiste zmiany zasad vs. szum modelu).

---

## 5. UX i design

- Spójność z `docs/DESIGN.md` (dark, cinematic, złoto/brąz, typografia fantasy).
- Priorytet czytelności: tabele i karty muszą być skanowalne przy stole.
- Responsywność mobile-first (gra na telefonie przy stole).
- Dostępność (a11y — w repo jest już `@storybook/addon-a11y`).
- Komponenty wielokrotnego użytku w `src/app/ui/` ze storybookiem (konwencja z AGENTS.md).

---

## 6. Technologia

- Zgodnie z istniejącym stosem: **Angular 22 standalone**, Tailwind v4, Vitest, Storybook.
- Routing: `provideRouter` (już skonfigurowany) — trasy per sekcja.
- Stan: sygnały (bez NgRx); ustawienia (np. zapamiętane filtry) oraz **ulubione** w localStorage.
- Dane statyczne: generowane przy buildzie (parser), ładowane jako statyczne assety.
- GitHub Pages (deployment już skonfigurowany — bez backendu, w pełni statyczna SPA).

---

## 7. Proponowana kolejność prac (roadmap)

1. **Fundament** — generacja danych (opencode) → walidacja, layout, nawigacja, glosariusz, wyszukiwarka.
2. **Podręcznik** — renderowanie zasad z linkowaniem i tabelami.
3. **Kompendium** — ekwipunek, bestiariusz, rasy/profesje/klasy/perki jako karty + filtry.
4. **Ulubione** — przycisk dodawania na kartach + zakładka z zapisem w localStorage.
5. **Patch notes / roadmap** — kronika zmian i status prac.
6. **Dopracowanie** — a11y, storybook dla komponentów, testy, responsywność.

---

## 8. Otwarte pytania

1. **Zakres sekcji** — czy kompendium obejmuje cały podręcznik zasad (mechaniki + walka), czy
   wyłącznie karty obiektów (rasy, profesje, klasy, perki, ekwipunek, bestiariusz)?
2. **Auto-generowanie danych** — potwierdzona strategia opencode (offline, walidacja, commit
   outputu); do ustalenia: konkretna instrukcja/schemat per encja oraz jak często odświeżać (ręcznie
   vs. `opencode run` przy aktualizacji submodułu).
3. **Język interfejsu** — całość po polsku (spójnie z treścią zasad)?
4. **Filtry i sortowanie** — które pola mają być filtrowalne w pierwszej wersji (np. broń wg bazowej
   statystyki, klasy wg archetypu)?
