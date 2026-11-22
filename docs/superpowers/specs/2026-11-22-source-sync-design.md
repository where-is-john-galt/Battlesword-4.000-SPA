# Synchronizacja SPA ze źródłem 0.1.24–0.1.26 — design

**Data:** 2026-11-22

## Cel

Przenieść do kompendium zmiany z 8 commitów źródła `Iwanuss/Battlesword-4.000`
(`0f32397..d8a3524`, 21.10–18.11.2026), zachowując wierność zasadom, stabilne
identyfikatory i dotychczasowy wygląd aplikacji.

## Zakres

- 8 nowych/zmienionych przedmiotów magicznych, w tym aktualizacja Zadumy po hotfixach.
- Nowy status walki „Wrażliwość”.
- Nowa zasada Treningu.
- Zmiana ścieżki pliku klasy skrytobójcy (bez zmiany `id`).
- Wpisy w „Niespójnościach” dla literówek i odmiany rzadkości w nowych plikach.
- Wpisy w `index.json` i testy danych.

## Poza zakresem

- Zmiany UI, nowe typy i rzadkości.
- Pozostałe pliki starszego audytu i odtwarzanie automatu.
- `tools/validate-data.mjs` (nieużywany, z nieaktualnymi licznikami).

## Podejście

Jedna sensowna droga: ręczna aktualizacja commitowanych JSON-ów na podstawie
źródła + testy jednostkowe. Generatora danych nie ma, a parsowanie Markdowna
w runtime łamie założenie statycznej SPA.

## Decyzje

- `id` przedmiotów z nazw plików, zgodnie z istniejącą konwencją.
- „Właściwości” z `amulet.md` trafiają do `effects` (jak „Efekty” w Krew Maga).
- `Arcymistrzowski`/`Arcymistrzowska` normalizowane do enuma `Arcymistrzowskie`,
  rozbieżność odnotowana w Niespójnościach.
- `zaduma…` traci wymagania Siła 10/Inteligencja 6 i cały angielski tekst.
- Stare wpisy Niespójności zachowują historyczne `revision` i ścieżki; nowe
  dostają `d8a352450e093cdb4d1bb032f5b3b8d70db9ac9d`.
- Testy aktualizowane razem z danymi; żadna istniejąca asercja nie jest osłabiana
  poza dostosowaniem do nowej treści źródła.
