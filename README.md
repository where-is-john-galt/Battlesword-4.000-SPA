# Battlesword 4.000 — Kompendium

Statyczna SPA (Angular 22) prezentująca zasady systemu **Battlesword 4.000** jako przeszukiwalne karty: rasy, profesje, klasy, perki, ekwipunek, walkę, statystyki i bestiariusz.

Źródłem prawdy jest submoduł `Battlesword-4.000/` (pliki Markdown). Aplikacja nie czyta Markdowna w runtime — dane są commitowane jako JSON w `src/assets/data/` i aktualizowane ręcznie. Zasady synchronizacji opisuje `docs/UTRZYMANIE.md`.

## Komendy

| Zadanie | Komenda |
| --- | --- |
| Dev server | `npm start` |
| Build produkcyjny | `npm run build` |
| Testy jednostkowe | `npm test -- --watch=false` |
| Testy e2e | `npm run test:e2e` |
| Storybook | `npm run storybook` |

## Publikacja

Deployment jest ręczny — instrukcja i wymagany `--base-href` znajdują się w `docs/UTRZYMANIE.md`.
