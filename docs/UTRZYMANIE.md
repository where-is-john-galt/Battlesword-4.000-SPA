# Utrzymanie i historia rozwoju

Stan na 2026-11-22.

## Usunięty automatyczny rozwój

Repozytorium nie ma już żadnego workflow GitHub Actions.

- `b31bef5` — usunięty workflow `Autonomous compendium development`, skrypty
  `scripts/autodev/`, konfiguracja `.opencode/` i dokumentacja `docs/AUTODEV.md`;
  usunięte też: sekret `DEEPSEEK_API_KEY`, zmienna `AUTODEV_ENABLED` i gałąź
  `automation-state`.
- `d7ac3d7` — usunięty workflow `deploy.yml`.

Skutek: nie ma automatycznego rozwoju ani automatycznego deploymentu. GitHub Pages
nadal serwuje ostatni opublikowany build z gałęzi `gh-pages`.

### Wnioski z działania automatu

Automat przestał działać 21.10.2026, a kolejne uruchomienia przez miesiąc kończyły
się błędem bez żadnego powiadomienia. Wnioski, które warto zachować, jeśli rozwój
automatyczny miałby kiedyś wrócić:

- Awaria systemowa (klucz API, model, limit) spalała po 3 próby na każde zadanie
  i trwale blokowała pliki. Potrzebny jest bezpiecznik: stop po serii porażek
  i alarm.
- Zablokowane zadania nie wracały do kolejki po zmianie kodu — tylko po zmianie
  pliku źródłowego.
- Synchronizacja wskaźnika submodułu była uzależniona od ukończenia **wszystkich**
  zadań; jedno trwale zablokowane zadanie blokowało ją na zawsze.
- Stan zapisywał jeden ogólny komunikat błędu, a szczegóły ginęły w artefaktach
  po 14 dniach. `write-failure.mjs` nie był podłączony.
- Deweloper i reviewer dzielili ten sam model; „niezależne review” nie było
  niezależne modelowo.
- Agent mógł zmieniać `package.json`, `package-lock.json` i `angular.json`,
  a workflow uruchamiał potem `npm ci` i build na hoście. Chronione były tylko
  skrypty npm i katalogi automatu.
- Automat commitował bezpośrednio na `main` i deployował bez bramki człowieka.

## Ręczna aktualizacja danych ze źródła

Dane aplikacji to commitowane JSON-y w `src/assets/data/`; aplikacja nie czyta
Markdowna w runtime. Źródłem prawdy jest submoduł `Battlesword-4.000/`.

1. Pobierz aktualne źródło:

   ```bash
   git -C Battlesword-4.000 fetch origin master
   git -C Battlesword-4.000 log --oneline 0f32397..origin/master
   ```

2. Ustal różnicę względem ostatnio zsynchronizowanej wersji. Pomocniczo:
   `niespojnosci.json` przechowuje `revision` źródeł, a testy danych pokazują,
   które wpisy są już odwzorowane.

3. Dla każdego zmienionego pliku źródłowego:

   - przenieś treść 1:1 do odpowiedniego JSON-a (`przedmioty_magiczne.json`,
     `walka.json`, `mechaniki.json`, `klasy.json` itd.),
   - zachowaj literówki i błędy źródła; rozbieżności dopisz do
     `niespojnosci.json` z `revision` aktualnego SHA,
   - dodaj wpis do `index.json` z tym samym `id`, `type`, `name`, `source`
     i `status`,
   - nie zmieniaj stabilnych `id` istniejących wpisów; przy zmianie nazwy pliku
     aktualizuj tylko `source`.

4. Dodaj lub zaktualizuj testy w `src/app/services/*.spec.ts` i sprawdź:

   ```bash
   npm test -- --watch=false
   npm run build -- --base-href /Battlesword-4.000-SPA/
   ```

5. Zaktualizuj wskaźnik submodułu, jeśli dane pochodzą z nowszego commita:

   ```bash
   git -C Battlesword-4.000 checkout <sha>
   git add Battlesword-4.000
   ```

Przykład pełnej synchronizacji: `docs/superpowers/specs/2026-11-22-source-sync-design.md`
i `docs/superpowers/plans/2026-11-22-source-sync.md` (8 commitów, `0f32397..d8a3524`).

## Publikacja GitHub Pages

Deployment jest ręczny. GitHub Pages ma źródło `gh-pages` (`build_type: legacy`).

```bash
npm run build -- --base-href /Battlesword-4.000-SPA/
cp dist/battlesword-spa/browser/index.html dist/battlesword-spa/browser/404.html
```

Następnie opublikuj zawartość `dist/battlesword-spa/browser` na gałęzi `gh-pages`.
Bez `--base-href` ścieżki assetów i routingu przestaną działać.

## Znane luki

- Wskaźnik submodułu w `main` to nadal `0f32397` (14.10.2026), a dane obejmują
  źródło `d8a3524` (18.11.2026). To celowa pozostałość po usuniętym automacie;
  przed kolejną synchronizacją trzeba go zaktualizować ręcznie.
- `tools/validate-data.mjs` nie jest podłączony do żadnego skryptu ani workflow
  i ma nieaktualne, zaszyte liczniki wpisów.
- `patch_notes.md` nie jest prezentowany w aplikacji.
- Brak CI: testy i build uruchamiane są tylko lokalnie.
- Testy e2e Playwright istnieją (`npm run test:e2e`), ale nie są częścią żadnego
  automatycznego pipeline'u.
