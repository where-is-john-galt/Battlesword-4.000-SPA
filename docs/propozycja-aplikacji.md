# Propozycja aplikacji — Battlesword 4.000 Kompendium

Dokument opisuje propozycję aplikacji internetowej (SPA), która w przystępny sposób prezentuje zasady
systemu RPG **Battlesword 4.000** w formie **kompendium** — przeszukiwalnego, nawigowalnego zbioru
informacji o systemie.

Źródłem prawdy o zasadach jest submodule `Battlesword-4.000/` (pliki Markdown). Aplikacja **nie**
zastępuje tych plików — jest warstwą prezentacyjną na ich bazie.

> **Aktualny status:** dane zostały już wyekstrahowane z submodułu do ustrukturyzowanych plików
> **JSON** w `src/assets/data/` (rasy, profesje, klasy, perki, ekwipunek, bestiariusz, glosariusz
> oraz zagregowany indeks `index.json`). Aplikacja **nie czyta już Markdowna** — konsumuje te pliki
> JSON jako statyczne assety. Kompendium to jedyna planowana sekcja aplikacji.

Zakres celowo **ograniczony do kompendium**: bez kreatora postaci, bez cyfrowej karty postaci, bez
kalkulatorów i trackerów walki, bez przeglądarki zasad w formie renderowanego Markdowna. To leksykon
i podręcznik referencyjny oparty na gotowych danych JSON.

---

## 1. Cel i filozofia

- **Kompendium treści** — rasy, profesje, klasy, perki, ekwipunek i bestiariusz jako przeglądalne,
  filtrowalne karty.
- **Szybkie wyszukiwanie** — znalezienie statystyki, broni czy przeciwnika w kilka sekund.
- **Glosariusz** — definicje pojęć z tooltipami podpiętymi pod całą aplikację.
- **Zawsze aktualne** — treść pochodzi z wygenerowanych plików JSON, dzięki czemu zmiany zasad
  upstream są widoczne po ponownej generacji danych i aktualizacji submodułu.

Ton: klimatyczny, dark-fantasy (spójny z `docs/DESIGN.md`, inspiracja Baldur's Gate 3), ale z
priorytetem czytelności — to narzędzie referencyjne, nie wizytówka.

---

## 2. Architektura informacji

Podział na sekcje odpowiadające kategoriom wygenerowanych danych:

| Sekcja | Zawartość (plik JSON w `src/assets/data/`) |
|--------|--------------------------------------------|
| **Postać** | `rasy.json`, `profesje.json`, `klasy.json`, `perki.json` |
| **Ekwipunek** | `bron.json`, `pancerze.json`, `paski.json`, `przedmioty_podreczne.json`, `przedmioty_magiczne.json`, `reszta_ekwipunku.json` |
| **Bestiariusz** | `bestiariusz.json` — statblocki (Trep/Elita/Mistrz/Boss) |
| **Glosariusz** | `glosariusz.json` — pojęcia typu „Bramy Śmierci", „ułatwienie", „Bariera", „Majętność" |
| **Ulubione** | — (wybór użytkownika, zapis w localStorage; nie pochodzi z danych) |

Wszystkie pozycje są też dostępne przez zagregowany indeks `index.json` (id, typ, nazwa, źródło,
status `detailed`/`stub`), który napędza wyszukiwarkę i listy.

---

## 3. Funkcje szczegółowe

### 3.1. Kompendium (karty obiektów)

- **Rasy** — karty z bonusami, rozmiarem, cechą pasywną i umiejętnością aktywną.
- **Profesje** — karty z predyspozycjami, majętnością/sławą, cechami, wyposażeniem startowym i
  przerwą profesyjną.
- **Klasy** — karty pogrupowane po archetypach, z predyspozycjami, umiejętnościami bojowymi,
  uzbrojeniem i sposobem liczenia PŻ.
- **Perki** — karty z wymaganiami, kosztem PD i opisem.
- **Ekwipunek** — broń, pancerze, paski, przedmioty podręczne i magiczne jako filtrowalne/sortowalne
  tabele (typ broni, bazowa statystyka, użycie, wymagana majętność).
- **Bestiariusz** — statblocki (typ, tagi, odporności/podatności, HP, pancerz, akcje) w czytelnej
  formie; filtrowanie po typie (Trep/Elita/Mistrz/Boss) i tagach.
- **Glosariusz** — karty terminów z definicjami; tooltipy podpięte pod nazwy obiektów w całej
  aplikacji.

Każda karta obiektu posiada **filtry** (np. klasy wg archetypu, broń wg bazowej statystyki) oraz
**linkowanie krzyżowe** do powiązanych obiektów (profesja → predyspozycje, klasa → archetyp).

### 3.2. Wyszukiwarka

- Wyszukiwanie pełnotekstowe po `index.json` (nazwy obiektów, kategorie, tagi, statusy).
- Wyniki pogrupowane wg typu encji z linkami do kart.

### 3.3. Ulubione

- Każda pozycja (karta rasy/profesji/klasy/perku, element ekwipunku, statblock, termin glosariusza)
  ma przycisk **dodania do ulubionych** (ikona gwiazdki/serducha).
- Osobna **zakładka Ulubione** agreguje wszystkie zapisane pozycje, z możliwością grupowania wg
  sekcji oraz usuwania pojedynczych wpisów.
- Ulubione są **trwałe**: zapisywane w `localStorage` (identyfikatory pozycji + typ), więc
  przetrwają odświeżenie i kolejne sesje na tym samym urządzeniu/przeglądarce.
- Opcjonalnie: sortowanie wg daty dodania, kolejność ręczna (przeciąganie) w przyszłości.

---

## 4. Podejście do danych

Kluczowa decyzja architektoniczna została już podjęta i zrealizowana: **dane są wygenerowane i
commitowane jako JSON**, a aplikacja nie dotyka Markdowna w runtime.

- Submoduł `Battlesword-4.000/` jest źródłem prawdy i **nie jest edytowany** z tego repo.
- Proces *offline* (już wykonany): konwersja Markdown submodułu → ustrukturyzowane pliki JSON w
  `src/assets/data/`, commitowane do repo.
- Pliki tabelaryczne (broń, pancerze, paski, przedmioty podręczne) mapowane na obiekty; pliki
  opisowe (rasy, profesje, klasy, perki, bestiariusz, glosariusz) mapowane na pola struktury
  (nazwa, sekcje, listy, wymagania, koszty).
- Aplikacja ładuje JSON jako statyczne assety (bez backendu, w pełni statyczna SPA).
- **Schemat TypeScript** w `src/app/models/compendium.ts` opisuje typy encji (`Race`, `Profession`,
  `CharacterClass`, `Perk`, `Weapon`, `Armor`, `Belt`, `HandItem`, `MagicItem`, `MiscItem`,
  `Monster`, `GlossaryEntry`) oraz `IndexEntry`.

**Odświeżanie:** przy aktualizacji submodułu dane generuje się ponownie i commituje jako diff —
SPA pozostaje statyczne i niezależne od procesu generacji w runtime.

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
- Dane statyczne: gotowe pliki JSON w `src/assets/data/`, ładowane jako statyczne assety.
- GitHub Pages (deployment już skonfigurowany — bez backendu, w pełni statyczna SPA).

---

## 7. Proponowana kolejność prac (roadmap)

1. **Fundament** — layout, nawigacja per sekcja, wyszukiwarka oparta na `index.json`, glosariusz z
   tooltipami.
2. **Kompendium** — ekwipunek, bestiariusz, rasy/profesje/klasy/perki jako karty + filtry.
3. **Ulubione** — przycisk dodawania na kartach + zakładka z zapisem w localStorage.
4. **Dopracowanie** — a11y, storybook dla komponentów, testy, responsywność.

---

## 8. Otwarte pytania

1. **Filtry i sortowanie** — które pola mają być filtrowalne w pierwszej wersji (np. broń wg bazowej
   statystyki, klasy wg archetypu)?
2. **Język interfejsu** — całość po polsku (spójnie z treścią zasad)?
3. **Obsługa `stub`** — jak prezentować pozycje o statusie `stub` (tylko nazwa w indeksie, bez
   pełnej karty) — ukryć, wyszarzyć, czy pokazać jako „w przygotowaniu"?
