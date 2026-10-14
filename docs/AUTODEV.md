# Autonomiczny rozwój kompendium

Workflow `Autonomous compendium development` co godzinę sprawdza gałąź `master` repozytorium
[`Iwanuss/Battlesword-4.000`](https://github.com/Iwanuss/Battlesword-4.000). Dzieli zmienione pliki
zasad na zadania, a przy pierwszym uruchomieniu kolejkuje audyt wszystkich źródeł Markdown oraz
`manifest.me` i `TODO`. Podczas nadrabiania zaległości najpierw łączy w jedno zadanie do czterech
plików zmienionych od ostatniej sprawdzonej wersji źródła, a pozostałe audyty grupuje po dwa pliki.
Po ukończeniu audytu wraca do jednego zadania na uruchomienie. Wskaźnik submodułu jest
aktualizowany dopiero po zakończeniu pełnego audytu.

Do pracy nad kodem używa OpenCode CLI 1.19.0 i DeepSeek V4.1 Flash. Agent może podejmować decyzje
o architekturze produktu, dodawać widoki, typy danych, narzędzia dla graczy i testy. Zachowuje
Angular, statyczne wdrożenie GitHub Pages, język polski, identyfikatory wpisów i dane użytkownika.
Zasady Battlesword pozostają specyfikacją; błędy i sprzeczności mają być przedstawiane wiernie i
opisywane w zakładce „Niespójności”. Submodułu ze źródłem agent nie modyfikuje.

Przed publikacją kontroler niezależnie sprawdza zmiany w chronionych plikach, wynik zadania, testy
jednostkowe, testy przeglądarkowe Playwright oraz produkcyjny build dla ścieżki GitHub Pages.
Zweryfikowane zmiany trafiają automatycznie na `main`; deployment jest jawnie uruchamiany dla
konkretnego SHA. Stan kolejki, pokrycia, prób i kosztów jest zapisywany w gałęzi
`automation-state`.

## Ustawienia

- Sekret repozytorium `DEEPSEEK_API_KEY` jest wymagany do wywołań modelu. Klucz przechowuje lokalna
  bramka; kontener agenta dostaje tylko token do tej bramki, nie właściwy klucz DeepSeek ani token
  zapisu GitHub.
- Zmienna repozytorium `AUTODEV_ENABLED` może zatrzymać automat, gdy ma wartość `false`. Brak
  zmiennej oznacza włączenie.
- Model jest zdefiniowany w `.opencode/opencode.json`; wersja CLI jest przypięta w
  `.github/autodev/Dockerfile`.

## Limity i awarie

Budżet to 5 USD na dobę UTC i maksymalnie 2 USD na próbę. Bramka wymusza limit wielkości kontekstu
i odpowiedzi oraz sprawdza koszty przed kolejnym wywołaniem. Stawki wylicza konserwatywnie według
cen szczytowych DeepSeek; rzeczywisty rachunek może się różnić, a bieżące stawki dostawcy mogą się
zmienić. Przerwana próba rezerwuje pełne 2 USD, aby restart workflow nie odzyskał wydanych środków.

Każde zadanie ma do trzech prób. Po trzech błędach zostaje odłożone do czasu zmiany odpowiedniego
źródła lub kodu. Awarie deploymentu nie uruchamiają ponownie AI: workflow ponawia publikację tego
samego SHA. Podsumowania Actions i artefakty raportu, logów oraz śladów przeglądarki są dostępne
przez 14 dni.

## Uruchomienie i kontrola

Workflow można uruchomić ręcznie przez `workflow_dispatch`. Bieżącą kolejkę, pokrycie źródeł,
próby i dzienny koszt pokazuje `state.json` na gałęzi `automation-state`. Szczegóły zadania, decyzje
agenta, wynik review i ślady Playwright są w podsumowaniu i artefaktach danego uruchomienia.

Ręczne sprawdzenia lokalne: `npm test -- --watch=false`, `npm run test:e2e` oraz
`npm run build -- --base-href /Battlesword-4.000-SPA/`.
