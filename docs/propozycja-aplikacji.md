# Propozycja aplikacji — Battlesword 4.000 Kompendium

Dokument opisuje propozycję aplikacji internetowej (SPA), która w przystępny sposób prezentuje zasady
systemu RPG **Battlesword 4.000** w formie **kompendium** — przeszukiwalnego, nawigowalnego zbioru
informacji o systemie.

Źródłem prawdy o zasadach jest submodule `Battlesword-4.000/` (pliki Markdown). Aplikacja **nie**
zastępuje tych plików — jest warstwą prezentacyjną na ich bazie.

> **Aktualny status:** aplikacja prezentuje ustrukturyzowane pliki JSON w `src/assets/data/` jako
> statyczne assety.

Zakres może rosnąć wraz z systemem: poza leksykonem i podręcznikiem referencyjnym aplikacja może
otrzymać narzędzia dla graczy, kalkulatory, kreatory i nowe sposoby przeglądania zasad. Aplikacja
pozostaje statyczną SPA.

---

## 1. Cel i filozofia

- **Kompendium treści** — rasy, profesje, klasy, perki, ekwipunek i bestiariusz jako przeglądalne,
  filtrowalne karty.
- **Szybkie wyszukiwanie** — znalezienie statystyki, broni czy przeciwnika w kilka sekund.
- **Linkowanie pojęć w treści** — statystyki, mechaniki i walka są podlinkowane w opisach; nie ma osobnej sekcji Glosariusza.
- **Zawsze aktualne** — treść pochodzi z wygenerowanych plików JSON, dzięki czemu zmiany zasad
  upstream są widoczne po ponownej generacji danych i aktualizacji submodułu.

Ton: klimatyczny, dark-fantasy (spójny z `docs/DESIGN.md`, inspiracja Baldur's Gate 3), ale z
priorytetem czytelności — to narzędzie referencyjne, nie wizytówka.

---

## 2. Architektura informacji

Podział na sekcje odpowiadające kategoriom wygenerowanych danych:

| Sekcja | Zawartość (plik JSON w `src/assets/data/`) |
| --- | --- |
| **Postać** | `rasy.json`, `profesje.json`, `klasy.json`, `perki.json` |
| **Statystyki** | `statystyki.json` |
| **Mechaniki** | `mechaniki.json` |
| **Ekwipunek** | `bron.json`, `pancerze.json`, `paski.json`, `przedmioty_podreczne.json`, `przedmioty_magiczne.json`, `reszta_ekwipunku.json` |
| **Walka** | `walka.json` |
| **Bestiariusz** | `bestiariusz.json` — statblocki (Trep/Elita/Mistrz/Boss) |
| **Niespójności** | `niespojnosci.json` — ustalenia audytu źródła; poza globalnym wyszukiwaniem |
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
- **Linkowanie pojęć** — statystyki, mechaniki i walka podlinkowują się w opisach; tooltipy
  pokazują definicję bez osobnej sekcji Glosariusza.

Każda karta obiektu posiada **filtry** (np. klasy wg archetypu, broń wg bazowej statystyki) oraz
**linkowanie krzyżowe** do powiązanych obiektów (profesja → predyspozycje, klasa → archetyp).

### 3.2. Wyszukiwarka

- Wyszukiwanie po nazwach z `index.json`; wpisy Niespójności są dostępne w swojej sekcji, ale nie w globalnych wynikach.
- Wyniki pogrupowane wg typu encji z linkami do kart.

### 3.3. Ulubione

- Każda pozycja (karta rasy/profesji/klasy/perku, element ekwipunku, statblock, termin mechaniki)
  ma przycisk **dodania do ulubionych** (ikona gwiazdki/serducha).
- Osobna **zakładka Ulubione** agreguje wszystkie zapisane pozycje, z możliwością grupowania wg
  sekcji oraz usuwania pojedynczych wpisów.
- Ulubione są **trwałe**: zapisywane w `localStorage` (identyfikatory pozycji + typ), więc
  przetrwają odświeżenie i kolejne sesje na tym samym urządzeniu/przeglądarce.
- Opcjonalnie: sortowanie wg daty dodania, kolejność ręczna (przeciąganie) w przyszłości.

---

## 4. Podejście do danych

Kluczowa decyzja architektoniczna pozostaje taka: **dane są commitowane jako JSON**, a aplikacja nie
czyta Markdowna w runtime. Źródłowy Markdown jest analizowany podczas ręcznej aktualizacji danych,
a zmiany trafiają do JSON i kodu aplikacji.

- Submoduł `Battlesword-4.000/` jest źródłem prawdy i **nie jest edytowany** z tego repo.
- Proces rozwoju: analiza źródłowych zmian → zaplanowanie funkcji → aktualizacja JSON i kodu SPA →
  testy i deployment. W ramach rozwoju można dodać nowy sposób prezentacji albo narzędzie dla
  gracza, kiedy wynika to z zasad.
- Pliki tabelaryczne (broń, pancerze, paski, przedmioty podręczne) mapowane na obiekty; pliki
  opisowe (rasy, profesje, klasy, perki, bestiariusz, statystyki i mechaniki) mapowane na pola struktury
  (nazwa, sekcje, listy, wymagania, koszty).
- Aplikacja ładuje JSON jako statyczne assety (bez backendu, w pełni statyczna SPA).
- **Schemat TypeScript** w `src/app/models/compendium.ts` opisuje typy encji (`Race`, `Profession`,
  `CharacterClass`, `Perk`, `Weapon`, `Armor`, `Belt`, `HandItem`, `MagicItem`, `MiscItem`,
  `Monster`, `Stat`, `Rule`, `Inconsistency`) oraz `IndexEntry`.

**Odświeżanie:** zmiany zasad są przenoszone do plików JSON ręcznie, a aplikacja pozostaje
statyczna i niezależna od AI podczas działania w przeglądarce.

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
- GitHub Pages (statyczny hosting — bez backendu, w pełni statyczna SPA).

---

## 7. Proponowana kolejność prac (roadmap)

1. **Fundament** — layout, nawigacja per sekcja, wyszukiwarka oparta na `index.json`, linkowanie pojęć z
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
