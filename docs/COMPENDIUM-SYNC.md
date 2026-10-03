# Automatyczna synchronizacja kompendium

Workflow **Sync compendium** sprawdza repo `Iwanuss/Battlesword-4.000` co godzinę,
w 17. minucie. Pobiera HEAD domyślnej gałęzi upstreamu (obecnie `master`), ustala jego SHA,
a następnie pracuje wyłącznie na tej wersji. Kilka nowych commitów jest przetwarzanych razem.
Brak nowej wersji oznacza brak wywołań DeepSeek i brak deploymentu.

## Uruchomienie na GitHubie

1. W **Settings → Secrets and variables → Actions → Secrets** dodaj `DEEPSEEK_API_KEY`.
   Klucz jest używany tylko w kroku ekstrakcji i nigdy nie trafia do aplikacji ani artefaktów.
2. Opcjonalnie dodaj zmienną Actions `DEEPSEEK_MODEL`. Domyślnie: `deepseek-flash`.
   Model musi obsługiwać Chat Completions, JSON Output, `thinking: disabled` i limit odpowiedzi
   32768 tokenów. Zmiana modelu nie powoduje sama w sobie ponownego przetwarzania danych;
   do tego służy ręczne `full`.
3. Umieść zmiany na `main`. Repo musi dopuszczać `contents: write` dla zapisu danych
   i `actions: write` do wywołania deploymentu. Ochrona `main` wymagająca PR blokuje ten wariant
   pełnego automatu; workflow jej nie obchodzi.
4. Harmonogram jest wyłączony, dopóki zmienna Actions `COMPENDIUM_SYNC_ENABLED` nie wynosi
   dokładnie `true`. Najpierw uruchom workflow ręcznie z
   **dry_run=true** (domyślne). Próba korzysta z płatnego API, generuje kandydatów i wykonuje
   testy oraz build, ale nie zapisuje niczego w zdalnym repo ani na stronie.
5. Pobierz artefakt `compendium-sync-<run_id>` i porównaj `data/` oraz `report.json` ze źródłami
   wskazanymi przez SHA. Potem uruchom z **dry_run=false** i ustaw zmienną Actions
   `COMPENDIUM_SYNC_ENABLED=true`. Od tej chwili harmonogram publikuje automatycznie.

Nie dodawaj ręcznie pliku `.github/compendium-state.json`. Pierwsza udana synchronizacja
tworzy go dopiero po pełnym uzgodnieniu wszystkich kategorii. Dzięki temu obecny wskaźnik
submodułu nie jest błędnie traktowany jako dowód wcześniejszej walidacji danych przez importer.

## Co robi importer

- Czyta źródła bezpośrednio z obiektów Git; nie wykonuje żadnego kodu z upstreamu i nie edytuje reguł.
- Mapuje pliki na istniejące kategorie. Uwzględnia obecne pola `source`, nowe pliki, pliki usunięte
  oraz lokalne odsyłacze Markdown. Nowy nierozpoznany obszar reguł zatrzymuje synchronizację.
- Uzgadnia całe dotknięte kategorie, aby listy i osobne opisy nie tworzyły duplikatów.
  Reguły podstawowe, walka oraz dokumenty ogólne są wspólnym kontekstem; ich zmiana może
  wymagać ponownego przetworzenia wszystkich kategorii. Przedmioty magiczne uwzględniają też
  niemagiczne bronie, pancerze i paski.
- DeepSeek otrzymuje pełne źródła danej kategorii, kontekst, stare wpisy oraz stare i nowe wersje
  zmienionych plików. Źródła są danymi, nie instrukcjami. Model nie otrzymuje narzędzi ani dostępu
  do systemu plików i nie wybiera plików wyjściowych.
- Odpowiedź musi zawierać kompletną kategorię, rozliczenie źródeł i uzasadnienie każdego usunięcia.
  Błędy, sprzeczności, braki opisu i niejednoznaczności źródła trafiają do osobnej sekcji
  **Niespójności** z cytatem i odnośnikami do plików przy konkretnym SHA. Nie blokują wiernego
  zapisu pozostałych informacji ze źródła. Synchronizację zatrzymują błędy techniczne, brak
  rozliczenia źródeł albo informacja, której nie da się zapisać w modelu danych aplikacji.
- Zachowuje identyfikatory istniejących encji, również przy zmianie nazwy, źródła lub `stub → detailed`.
  Jednoczesne usunięcie i dodanie pod innym ID w tym samym źródle jest traktowane jako potencjalnie
  nierozpoznana zmiana nazwy i wymaga poprawienia wyniku/importera. Faktycznie usunięty wpis znika
  z indeksu; importer nie modyfikuje danych ulubionych zapisanych w przeglądarkach użytkowników.
- Schematy wynikają z `src/app/models/compendium.ts` poprzez kompilator TypeScript.
  Dodatkowe pola, nieprawidłowe typy, duplikaty i nieistniejące źródła są odrzucane.
  Model otrzymuje też wykaz wpisów z pozostałych kategorii. Nazwy nie są unikalnymi kluczami:
  jeśli źródło używa tej samej nazwy w różnych miejscach, wpisy zostają zachowane. Indeks jest
  generowany zwykłym skryptem, bez AI.

Walidacja sprawdza strukturę i spójność. Rozliczenie źródeł oraz interpretacja reguł nadal zależą
od modelu i nie są matematycznym dowodem kompletności lub poprawności merytorycznej.

## Publikacja i awarie

Po walidacji danych, testach importera, testach Angulara i produkcyjnym buildzie automat zapisuje
jednym commitem JSON-y, wskaźnik submodułu i metadane. Przed zapisem sprawdza listę dozwolonych
plików oraz czy `main` nie zmienił się podczas pracy. Nie wykonuje force-push ani rebase wyniku.
Jeśli `main` się zmienił, kolejny przebieg ponowi synchronizację od nowej podstawy.

Deployment jest wywoływany jawnie przez `workflow_dispatch`, ponieważ push przez `GITHUB_TOKEN`
nie uruchamia workflowu `push`. Wszystkie deploymenty mają wspólną blokadę i sprawdzają aktualność
`main` tuż przed publikacją. Dotychczasowy `base-href` GitHub Pages i fallback `404.html` są zachowane.

Przy błędzie API lub walidacji dane nie są commitowane. Przy błędzie testów/builda kandydaci
pozostają tylko na runnerze i w artefakcie. Przy błędzie wywołania deploymentu lub samego deploymentu
commit może już być na `main`: uruchom ręcznie **Deploy to GitHub Pages**. To nie wywołuje AI.

Raport jest dostępny w podsumowaniu przebiegu i artefakcie przez 14 dni. Zawiera SHA, kategorie,
zmienione ID, usunięcia, pokrycie źródeł i liczbę tokenów. Kontrole aplikacji mają osobne kroki Actions.
Katalog `responses/` w artefakcie zawiera odpowiedzi modelu, także te odrzucone przez walidację,
co pozwala zdiagnozować błąd bez ponownego płatnego wywołania. Nie zawiera klucza API.
Włącz powiadomienia GitHub Actions o nieudanych przebiegach. Cały job ma limit 30 minut;
żądanie API 3 minuty i maksymalnie 3 próby dla błędów sieci, HTTP 429 i 5xx.
Puste, ucięte lub niepoprawne odpowiedzi nie są automatycznie „naprawiane”.
Kontekst pojedynczej kategorii jest ograniczony do 700 KB; większą kategorię trzeba podzielić
w importerze. Koszt API zależy od zakresu zmian i modelu. Harmonogram po awarii może ponawiać
płatną ekstrakcję co godzinę — w razie trwałego problemu wyłącz workflow do czasu naprawy.

GitHub może opóźniać harmonogram lub wyłączyć go po 60 dniach braku aktywności w publicznym repo.
Nie jest to mechanizm gwarantujący natychmiastową reakcję na każdy commit.

Wycofanie błędnej publikacji: wyłącz **Sync compendium**, wykonaj revert całego commita synchronizacji
(łącznie z metadanymi i submodułem), a następnie opublikuj `main`. Sam revert bez wyłączenia automatu
spowoduje ponowną próbę importu tej samej wersji reguł.

## Praca lokalna

```sh
git submodule update --init
npm ci
npm run test:compendium
npm run compendium:validate
npm run compendium:plan
```

`compendium:plan` nie wywołuje API. Pokazuje zakres względem lokalnie wybranego SHA submodułu
i zapisuje raport w ignorowanym `.compendium-sync/`.

```sh
git -C Battlesword-4.000 fetch origin HEAD
# Skopiuj pełne SHA z poniższego polecenia:
git -C Battlesword-4.000 rev-parse FETCH_HEAD
npm run compendium:plan -- --target-sha <SHA>
npm run compendium:sync -- --target-sha <SHA>
npm run compendium:validate -- --data-dir .compendium-sync/data --target-sha <SHA>
```

`compendium:sync` domyślnie zapisuje tylko kandydatów i raport w `.compendium-sync/`.
Wymaga `DEEPSEEK_API_KEY` w środowisku, jeśli są kategorie do przetworzenia.
`--full` wymusza pełne uzgodnienie. `--apply` dodatkowo kopiuje zwalidowane dane i metadane do repo
oraz przestawia submoduł; wymaga czystych śledzonych plików aplikacji. Nie tworzy commita ani nie
publikuje. Skrypt `publish.mjs` jest przeznaczony wyłącznie dla końcowego, przetestowanego kroku CI.

Testy używają lokalnych repozytoriów tymczasowych i atrap odpowiedzi API; nie potrzebują klucza
i nie ponoszą kosztów DeepSeek.

Dokumentacja dostawców:

- [DeepSeek API](https://api-docs.deepseek.com/)
- [DeepSeek JSON Output](https://api-docs.deepseek.com/guides/json_mode/)
- [GitHub: harmonogram](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [GitHub: uruchamianie workflowu z workflowu](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
