# Niespójności w źródle Battlesword 4.000

**Stan:** 2026-11-24, źródło `8956f4d` (merge PR z poprawkami literówek), plik `src/assets/data/niespojnosci.json`.

Po poprawkach w źródle usunięto **180 rozwiązanych wpisów typu literówka**. Zostało **198** wpisów, w tym 31 literówek, które są niepewne, nie są literówkami albo dotyczą nazw/formatowania. Ten plik opisuje **źródło zasad**, nie błędy aplikacji.

## 1. Podsumowanie

### Historia liczby wpisów

| Etap | Wpisy |
| --- | ---: |
| Pierwotny audyt | 553 |
| Po deduplikacji | 378 |
| Po synchronizacji poprawek literówek (2026-11-24) | **198** |

Łącznie wyeliminowano **355 wpisów**: 175 duplikatów i 180 rozwiązanych literówek.

| Kategoria | Wpisy |
| --- | ---: |
| Literówki i zapisy | 31 |
| Braki szczegółów | 108 |
| Niejasności | 24 |
| Konflikty | 7 |
| Asymetrie | 3 |
| Uwagi strukturalne | 25 |
| **Razem** | **198** |

| Obszar źródła | Wpisy |
| --- | ---: |
| Mechaniki bazowe | 91 |
| Tworzenie postaci | 44 |
| Ekwipunek | 42 |
| Walka | 16 |
| Bestiariusz | 5 |

### Co nadal się powtarza

| Wzorzec | Wpisy | Uwaga |
| --- | ---: | --- |
| Crafting: negatywny efekt bonusu eksperymentalnego | 50 | Jeden brak reguły rozbity na 50 bonusów; nadal otwarty. |
| Lista klas: klasa dopisana do archetypu | 9 | Uwagi informacyjne, nie błąd mechaniki. |
| Lista profesji: profesja z osobnym opisem | 8 | Uwagi informacyjne, nie błąd. |
| Testy: kumulowanie ułatwień | 3 | Ta sama niejasność w trzech wpisach. |
| Rzadkość przedmiotu vs folder | 2 | Przedmiot ma rzadkość inną niż folder. |

Pozostałe 31 literówek to w większości **false positives** z pierwotnego audytu (np. `wytrychowej`, `inkrustowana`, `spatynowanym`), nazwy własne (`Wrzoścce`, `Teunìlaa`) albo formatowanie (`25%+1d4`). Zostawiono je, bo poprawka wymaga decyzji autora, a nie mechanicznej zamiany.

---

## 2. Literówki i zapisy (31)

### Tworzenie postaci

- **Bagiennik: literówka 'znaduje'** — `tworzenie_postaci/profesje/bagiennik.md`
  W pliku Bagiennika nie występuje 'znaduje'; literówka 'znaduje' występuje w pliku Botanika. Ten wpis dotyczy Bagiennika i nie powinien być tu raportowany.
  Dowód: „Pana, bagno - Bagiennik nie ponosi żadnych kar za poruszanie się po ciężkim terenie.”
  Powiązane: `bagiennik`

- **Gazeciarz: literówka 'Ukośnik'** — `tworzenie_postaci/profesje/gazeciarz.md`
  Nazwa krzyżówki 'Ukośnik' jest zapisana poprawnie w treści, ale link do Wikipedii zawiera 'Uko%C5%9Bnik' (Ukośnik), co jest zgodne. Brak błędu w nazwie.
  Dowód: „* [Ukośnik](https://pl.wikipedia.org/wiki/Uko%C5%9Bnik_(krzy%C5%BC%C3%B3wka))”
  Powiązane: `gazeciarz`

- **Sabotażysta: literówka 'oręży'** — `tworzenie_postaci/klasy/sabotażysta.md`
  W opisie umiejętności Rozbrojenie użyto zapisu 'oręży' zamiast 'oręży' (poprawna forma: 'oręży'/'oręża').
  Dowód: „Wybrany zwyczajny przeciwnik zostaje pozbawiony jednego z posiadanych oręży”
  Powiązane: `sabotażysta`

- **Szlachic: nietypowy zapis 'Teunìlaa'** — `tworzenie_postaci/profesje/szlachic.md`
  Nazwa rodu 'Teunìlaa' zawiera znak ì, który może być błędem lub celowym zapisem. Brak innych wystąpień do porównania.
  Dowód: „* Ród Teunìlaa”
  Powiązane: `szlachic`

- **Śmieciarz: zapis 'Sztuka przetrwania' małą literą** — `tworzenie_postaci/profesje/śmieciarz.md`
  W predyspozycjach drugorzędnych zapisano 'Sztuka przetrwania' małą literą, podczas gdy w innych plikach statystyka występuje jako 'Sztuka Przetrwania'.
  Dowód: „* Sztuka przetrwania”
  Powiązane: `śmieciarz`

### Ekwipunek

- **Cichy Klucz: literówka 'wytrychowej'** — `ekwipunek/przedmioty_magiczne/rzadkie/cichy_klucz.md`
  W opisie zapisano "wytrychowej" zamiast "wytrychowej" (prawdopodobnie "wytrychowej" od wytrych, ale zapis nietypowy).
  Dowód: „wygięty w kształt maleńkiej wytrychowej wiązki”
  Powiązane: `cichy_klucz`

- **Czytelnik Wód: literówka 'inkrustowana'** — `ekwipunek/przedmioty_magiczne/rzadkie/czytelnik_wód.md`
  W opisie zapisano "inkrustowana" zamiast "inkrustowana" (prawdopodobnie "inkrustowana" od inkrustować, ale zapis nietypowy).
  Dowód: „Środek tarczy zdobi inkrustowana róża wiatrów”
  Powiązane: `czytelnik_wód`

- **Kostur Żelaznego Rachmistrza: literówka 'spatynowanym'** — `ekwipunek/przedmioty_magiczne/rzadkie/kostur_żelazdnego_rachmistrza.md`
  W opisie zapisano "spatynowanym" zamiast "spatynowanym" (prawdopodobnie "spatynowanym" od patyna, ale zapis nietypowy).
  Dowód: „okutego na końcach spatynowanym mosiądzem”
  Powiązane: `kostur_żelazdnego_rachmistrza`

- **Kostur Żelaznego Rachmistrza: literówka 'zakonserwowania'** — `ekwipunek/przedmioty_magiczne/rzadkie/kostur_żelazdnego_rachmistrza.md`
  W opisie zapisano "zakonserwowania" zamiast "zakonserwowania" (prawdopodobnie "zakonserwowania" od konserwować, ale zapis nietypowy).
  Dowód: „czarne pióro w stanie magicznego zakonserwowania”
  Powiązane: `kostur_żelazdnego_rachmistrza`

- **Kostur Żelaznego Rachmistrza: literówka w nazwie** — `ekwipunek/przedmioty_magiczne/rzadkie/kostur_żelazdnego_rachmistrza.md`
  Nazwa przedmiotu zawiera zapis "Żelazdnego" zamiast "Żelaznego".
  Dowód: „# Kostur Żelazdnego Rachmistrza”
  Powiązane: `kostur_żelazdnego_rachmistrza`

- **Krasnoludzki Ładny Hełm: literówka 'perswazji'** — `ekwipunek/przedmioty_magiczne/rzadkie/krasnoludzki_ładny_hełm.md`
  W opisie zapisano "perswazji" zamiast "perswazji" (prawdopodobnie "perswazji" od perswazja, ale zapis nietypowy).
  Dowód: „zwiększenie mocy perswazji”
  Powiązane: `krasnoludzki_ładny_hełm`

- **Krasnoludzki Ładny Hełm: literówka 'zdobień'** — `ekwipunek/przedmioty_magiczne/rzadkie/krasnoludzki_ładny_hełm.md`
  W opisie zapisano "zdobień" zamiast "zdobień" (prawdopodobnie "zdobień" od zdobienie, ale zapis nietypowy).
  Dowód: „dodanie kompletnie zbędnych, ale ładnych zdobień”
  Powiązane: `krasnoludzki_ładny_hełm`

- **Krew Maga: literówka 'wyposażony są jest'** — `ekwipunek/przedmioty_magiczne/boskie/krew_maga.md`
  W opisie zapisano "Pas wyposażony są jest" zamiast poprawnej formy.
  Dowód: „Pas wyposażony są jest w igły, podajniki i pompy”
  Powiązane: `krew_maga`

- **Majętność: zapis 'Majętność zwiększa się o 0,5 punktu'** — `ekwipunek/majętność.md`
  W opisie Majętności występuje zapis 'Majętność zwiększa się o 0,5 punktu' (poprawnie gramatycznie, ale wartość 0,5 punktu Majętności jest nietypowa dla statystyki całkowitej).
  Dowód: „Porażka oznacza, że Majętność zwiększa się o 0,5 punktu.”
  Powiązane: `majętność`

- **Majętność: zapis 'Majętność zwiększa się'** — `ekwipunek/majętność.md`
  W opisie Majętności występuje zapis 'Majętność zwiększa się o 1' zamiast 'zwiększa się o 1' (brak 'o' przed '1' w jednym miejscu).
  Dowód: „Sukces oznacza, że Majętność zwiększa się o 1.”
  Powiązane: `majętność`

- **Majętność: zapis 'zmiana wartości Sławy'** — `ekwipunek/majętność.md`
  W opisie Majętności występuje zapis 'Każda zmiana wartości Sławy powinna również znajdować swoje odzwierciedlenie w Majętności.' (poprawnie gramatycznie, ale sugeruje powiązanie Majętności ze Sławą, co nie jest wyjaśnione mechanicznie).
  Dowód: „Każda zmiana wartości Sławy powinna również znajdować swoje odzwierciedlenie w Majętności.”
  Powiązane: `majętność`

- **Pas Głębinowego Uśmiechu: literówka 'rozłupujące'** — `ekwipunek/przedmioty_magiczne/rzadkie/pas_głębinowego_uśmiechu.md`
  W opisie zapisano "rozłupujące" zamiast "rozłupujące" (prawdopodobnie "rozłupujące" od rozłupywać, ale zapis nietypowy).
  Dowód: „szum przypominający fale rozbijające sie o brzeg klifu”
  Powiązane: `pas_głębinowego_uśmiechu`

- **Paski: literówka 'b nich'** — `ekwipunek/paski.md`
  W zdaniu wprowadzającym zapisano 'b nich' zamiast 'nich'.
  Dowód: „Nie oznacza to, że musi to być jedyna rzecz z bnich wynikająca.”

- **Peleryna Wędrowca Tysiąca Dachów: literówka 'nietoperza'** — `ekwipunek/przedmioty_magiczne/rzadkie/peleryna_wędrowca_tysiąca_dachów.md`
  W opisie zapisano "nietoperza" zamiast "nietoperza" (prawdopodobnie "nietoperza" od nietoperz, ale zapis nietypowy).
  Dowód: „przypominającej jednocześnie jedwab i skórę nietoperza”
  Powiązane: `peleryna_wędrowca_tysiąca_dachów`

- **Peleryna Wędrowca Tysiąca Dachów: literówka 'rozerwania'** — `ekwipunek/przedmioty_magiczne/rzadkie/peleryna_wędrowca_tysiąca_dachów.md`
  W opisie zapisano "rozerwania" zamiast "rozerwania" (prawdopodobnie "rozerwania" od rozerwać, ale zapis nietypowy).
  Dowód: „niemal niemożliwy do rozerwania”
  Powiązane: `peleryna_wędrowca_tysiąca_dachów`

- **Pierścień Odkrywcy: literówka 'astrolabium'** — `ekwipunek/przedmioty_magiczne/rzadkie/pierścień_odkrywcy.md`
  W opisie zapisano "astrolabium" zamiast "astrolabium" (prawdopodobnie "astrolabium" od astrolabium, ale zapis nietypowy).
  Dowód: „przypominający kompas lub astrolabium”
  Powiązane: `pierścień_odkrywcy`

- **Pierścień Odkrywcy: literówka 'mgiełkę'** — `ekwipunek/przedmioty_magiczne/rzadkie/pierścień_odkrywcy.md`
  W opisie zapisano "mgiełkę" zamiast "mgiełkę" (prawdopodobnie "mgiełkę" od mgiełka, ale zapis nietypowy).
  Dowód: „migoczącą, srebrzystą mgiełkę”
  Powiązane: `pierścień_odkrywcy`

- **Tarcza Milczącej Kniei: literówka 'pochłaniać'** — `ekwipunek/przedmioty_magiczne/rzadkie/tarcza_milczącej_kniei.md`
  W opisie zapisano "pochłaniać" zamiast "pochłaniać" (prawdopodobnie "pochłaniać" od pochłaniać, ale zapis nietypowy).
  Dowód: „które zdaje się pochłaniać światło”
  Powiązane: `tarcza_milczącej_kniei`

- **Targowy Bastion: literówka 'wypatrywać'** — `ekwipunek/przedmioty_magiczne/rzadkie/targowy_bastion.md`
  W opisie zapisano "wypatrywać" zamiast "wypatrywać" (prawdopodobnie "wypatrywać" od wypatrywać, ale zapis nietypowy).
  Dowód: „wypatrywać zasadzek zza wydm”
  Powiązane: `targowy_bastion`

- **Wilgotna Chwała: literówka 'wyszczerbiona'** — `ekwipunek/przedmioty_magiczne/rzadkie/wilgotna_chwała.md`
  W opisie zapisano "wyszczerbiona" zamiast "wyszczerbiona" (prawdopodobnie "wyszczerbiona" od wyszczerbić, ale zapis nietypowy).
  Dowód: „Stara, wyszczerbiona morska czapka”
  Powiązane: `wilgotna_chwała`

- **Wrzoścce Hazardowego Biegu: literówka w nazwie** — `ekwipunek/przedmioty_magiczne/arcymistrzowskie/wrzoścce_hazardowego_biegu.md`
  Nazwa przedmiotu zawiera zapis "Wrzoścce" z podwójnym c, co wygląda na literówkę.
  Dowód: „# Wrzoścce Hazardowego Biegu”
  Powiązane: `wrzoścce_hazardowego_biegu`

- **Wybebeszacz: literówka 'poząbkowane'** — `ekwipunek/przedmioty_magiczne/potężne/wybebeszacz.md`
  W opisie zapisano "poząbkowane" zamiast "poząbkowane" (prawdopodobnie "poząbkowane" od ząbków, ale zapis nietypowy).
  Dowód: „którego ostrza zostały specjalnie poząbkowane”
  Powiązane: `wybebeszacz`

- **Zbroja czerwonych łusek: literówka 'tworzących'** — `ekwipunek/przedmioty_magiczne/rzadkie/zbroja_czerwonych_łusek.md`
  W opisie zapisano "skarbów tworzących" zamiast "skarbów tworzących" (prawdopodobnie "skarbów i tworzących" lub podobne).
  Dowód: „zajmują sie przeliczaniem skarbów tworzących i sterty złota”
  Powiązane: `zbroja_czerwonych_łusek`

### Bestiariusz

- **Niedźwiedź: format leczenia w Miodku** — `bestiariusz/zwierzaki/niedźwiedź.md`
  W opisie cechy Miodek leczenie zapisano jako '(25%+1d4)', mieszając zapis procentowy z kością k4 używaną w innych miejscach podręcznika.
  Dowód: „uzyskać małe leczenie (25%+1d4)”
  Powiązane: `niedźwiedź`

### Mechaniki bazowe

- **Przerwy: niekonsekwentna kapitalizacja 'nekromanta'** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  We wstępie zapisano 'nekromanta' małą literą w środku zdania, podczas gdy inne nazwy profesji/klas pisane są wielką literą.
  Dowód: „Botanik może chcieć tworzyć swój własny ogród w trakcie swojej przerwy, a nekromanta przeprowadzać magiczne eksperymenty”
  Powiązane: `przerwy_miedzy_przygodami`

- **Testy: wulgaryzm 'Pojebanie trudny'** — `mechaniki_bazowe/testy.md`
  W tabeli poziomów trudności zapisano 'Pojebanie trudny' zamiast 'Pojebanie trudny' (wulgaryzm, prawdopodobnie zamierzony).
  Dowód: „* Pojebanie trudny -5”
  Powiązane: `poziomy_trudności`

## 3. Braki szczegółów (108)

### Mechaniki bazowe

- **×3** — **Testy: niejasne kumulowanie ułatwień i utrudnień** — `mechaniki_bazowe/testy.md`
  Sekcja o ułatwieniach i utrudnieniach podaje listę czynników, ale nie precyzuje, czy ułatwienia i utrudnienia się kumulują, ani czy jedno ułatwienie i jedno utrudnienie znoszą się.
  Dowód: „W przypadku ułatwienia, test wykonywany jest przy pomocy dwóch k20, spośród których do ustalenia wyniku testu wybierana jest ta bardziej korzystna dla BG.”
  Powiązane: `ułatwienie`, `utrudnienie`

- **×2** — **Crafting: niejasna negatywna interpretacja 'Bariera +5'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Bariera +5

  </details>

- **Crafting: brak procedury efektu negatywnego dla wyniku 4** — `mechaniki_bazowe/crafting.md`
  Sekcja o spaczeniu mówi, że po rzucie k4 na efekt pozytywny należy rzucić na efekt negatywny, ale dla wyniku 4 (dodaje eksperymentalny bonus potężny+) nie precyzuje, jak wyznaczyć efekt negatywny — podaje tylko procedurę dla wyników 1-3.
  Dowód: „Następnie należy rzucić na efekt negatywny, którym zostaje obarczony przedmiot.”
  Powiązane: `spaczenie`

- **Crafting: brak proporcji podziału poziomu trudności** — `mechaniki_bazowe/crafting.md`
  Sekcja 'Testy wytwórstwa' mówi, że poziom trudności należy podzielić na ilość sukcesów niezbędnych do zebrania w danym teście, a proporcje powinny zależeć od tego, które umiejętności mają najwyższy wkład, ale nie podaje konkretnej metody podziału.
  Dowód: „Poziom trudności należy podzielić na ilość sukcesów niezbędnych do zebrania w danym teście, by ukończyć prace nad przedmiotem. Proporcje powinny zależeć od tego, które umiejętnośc…”
  Powiązane: `crafting`

- **Crafting: brak wartości modyfikatora wyjątkowych materiałów** — `mechaniki_bazowe/crafting.md`
  Sekcja o wyjątkowych materiałach stwierdza, że modyfikator zależy od wyjątkowości materiału oraz jego związku z wytwarzanym przedmiotem, ale nie podaje żadnej konkretnej wartości ani tabeli modyfikatorów.
  Dowód: „Modyfikator zależy od wyjątkowości materiału oraz jego związku z wytwarzanym przedmiotem.”
  Powiązane: `crafting`

- **Crafting: niejasna negatywna interpretacja 'Akrobatyka +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Akrobatyka +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Analiza +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Analiza +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Arkana +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Arkana +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Atletyka +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Atletyka +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Charyzma +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Charyzma +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Dowodzenie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Dowodzenie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Gadanina +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Gadanina +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'HP +3'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  HP +3

  </details>

- **Crafting: niejasna negatywna interpretacja 'Inteligencja +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Inteligencja +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Jeździectwo +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Jeździectwo +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Kowalstwo +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Kowalstwo +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Księgowość +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Księgowość +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Lingwistyka +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Lingwistyka +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Majsterkowanie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Majsterkowanie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Medycyna +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Medycyna +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Nawigacja +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Nawigacja +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Odporność na Śmierć +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Odporność na Śmierć +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Ostrożność +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Ostrożność +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Oszustwo +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Oszustwo +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Otwieranie zamków +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Otwieranie zamków +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Pancerz +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Pancerz +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Percepcja +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Percepcja +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Pływanie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Pływanie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Poczytalność (Ułatwienie) +3'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Poczytalność (Ułatwienie) +3

  </details>

- **Crafting: niejasna negatywna interpretacja 'Prowadzenie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Prowadzenie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Przekonywanie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Przekonywanie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Psychologia +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Psychologia +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Siła +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Siła +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Siła Woli +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Siła Woli +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Skradanie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Skradanie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Spostrzegawczość +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Spostrzegawczość +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Spryt +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Spryt +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Stamina / Mana +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Stamina / Mana +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Szczęście (Ułatwienie)'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Szczęście (Ułatwienie)

  </details>

- **Crafting: niejasna negatywna interpretacja 'Sztuka +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Sztuka +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Sztuka Przetrwania +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Sztuka Przetrwania +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Targowanie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Targowanie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Unik +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Unik +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Wiedza +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Wiedza +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Wspinaczka +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Wspinaczka +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Wynalazczość +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Wynalazczość +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Wytrzymałość +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Wytrzymałość +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Zastraszanie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Zastraszanie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Znajdowanie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Znajdowanie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Zręczność +1'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Zręczność +1

  </details>

- **Crafting: niejasna negatywna interpretacja 'Zwinne dłonie +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Zwinne dłonie +2

  </details>

- **Crafting: niejasna negatywna interpretacja 'Żeglarstwo +2'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Żeglarstwo +2

  </details>

- **Crafting: niejasna negatywna interpretacja wpisów 'Ułatwienie'** — `mechaniki_bazowe/crafting.md`
  Tabela bonusów eksperymentalnych podaje efekt pozytywny, ale nie mówi, jaki jest jego negatywny odpowiednik przy spaczeniu. To jeden brak reguły rozbity na 50 wpisów — po jednym na bonus.
  <details><summary>Bonusy objęte problemem (1)</summary>

  Ułatwienie

  </details>

- **Crafting: niejasna relacja tabeli k10 do efektu negatywnego** — `mechaniki_bazowe/crafting.md`
  Dla wyniku 4 w rzucie na efekt pozytywny podano tabelę k10 negatywnych skutków użycia spaczonego modyfikatora, ale nie wskazano, czy zastępuje ona ogólny 'efekt negatywny', czy jest dodatkowym efektem.
  Dowód: „W przypadku wyniku 4 w rzucie na efekt pozytywny, należy wykonać rzut k10:”
  Powiązane: `spaczenie`

- **Crafting: niejasne czy kara -3 do HP dotyczy Max HP** — `mechaniki_bazowe/crafting.md`
  W tabeli eksperymentalnych bonusów (niezwykłe / rzadkie) wynik 92-94 to 'HP +3', a w przykładzie negatywnego zastosowania podano 'wynik 93 nałoży karę -3 do HP'. Nie jest jasne, czy chodzi o maksymalne HP, czy o bieżące HP.
  Dowód: „np. wynik 93 nałoży karę -3 do HP.”
  Powiązane: `spaczenie`

- **Przerwy: niejasny charakter rozwoju kompana** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Behawiorystyka' mówi, że sukces pozwala na rozwinięcie jednej cechy lub umiejętności kompana, ale nie precyzuje, czy chodzi o rozwinięcie w rozumieniu rozwoju postaci (PD), czy o tymczasowy bonus.
  Dowód: „Sukces pozwala na rozwinięcie jednej cechy lub umiejętności kompana.”
  Powiązane: `behawiorystyka`

- **Przerwy: niejasny charakter wzrostu Majętności** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Działalność gospodarcza' mówi, że ilość sukcesów podzielona na 3 i zaokrąglona w górę jest podniesioną wartością Majętności, ale nie precyzuje, czy wzrost jest trwały, czy tymczasowy.
  Dowód: „Ilość sukcesów podzielona na 3 i zaokrąglona w górę w tym teście jest podniesioną wartością Majętności.”
  Powiązane: `dzialalnosc_gospodarcza`

- **Przerwy: niejasny charakter zysku z inwestycji** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Inwestycje' mówi, że każdy sukces to zysk w postaci 10% wkładu, ale nie precyzuje, czy zysk jest trwały, czy tymczasowy, ani czy zainwestowane środki wracają do Majętności.
  Dowód: „Każdy sukces to zysk w postaci 10% wkładu. Porażka oznacza jednak utratę zainwestowanych środków.”
  Powiązane: `inwestycje`

- **Przerwy: niejasny sposób naliczania zysku ze sprzedaży** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Handel przedmiotami' mówi, że każdy sukces zwiększa uzyskaną Majętność o 1/3 wartości upłynnianych zasobów, ale nie precyzuje, czy chodzi o 1/3 wartości całkowitej, czy o 1/3 na sukces.
  Dowód: „Każdy sukces zwiększa uzyskaną Majętność o 1/3 wartości upłynnianych zasobów.”
  Powiązane: `handel_przedmiotami`

- **Przerwy: niejasny zakres efektu imprezy** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Impreza okolicznościowa' mówi, że każda porażka w testach Szczęścia zwiększa Szczęście o 1, ale nie precyzuje, czy dotyczy to tylko zaproszonych postaci, ani czy efekt jest trwały.
  Dowód: „Wszyscy zaproszeni mogą wykonać 3 testy Szczęścia. Każda porażka zwiększa ich Szczęście o 1.”
  Powiązane: `impreza_okolicznosciowa`

- **Przerwy: niejasny zakres efektu studiowania** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Studiowanie tajemnych tomów' mówi o zmianie wyniku na kości na 1 w dowolnym teście Wiedzy oraz Arkan kosztem 1 Szczęścia do następnej przerwy, ale nie precyzuje, czy dotyczy to jednego testu, czy wszystkich testów w tym okresie.
  Dowód: „Pozwala na zmianę wyniku na kości na 1 w dowolnym teście Wiedzy oraz Arkan kosztem 1 Szczęścia do następnej przerwy.”
  Powiązane: `studiowanie_tajemnych_tomow`

- **Przerwy: niejasny zakres efektu treningu** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Trening' mówi, że Bazowa Stamina / Mana zwiększa się o 1 do następnej przerwy, ale nie precyzuje, czy dotyczy to tylko jednej broni, czy wszystkich, ani czy efekt się kumuluje przy wielokrotnym treningu.
  Dowód: „Za każdą poświęconą na to akcję, Bazowa Stamina / Mana zwiększa się o 1 do następnej przerwy.”
  Powiązane: `trening`

- **Przerwy: niejasny zakres uleczenia w długim odpoczynku** — `mechaniki_bazowe/przerwy_miedzy_przygodami.md`
  Sekcja 'Bardzo długi odpoczynek' mówi, że wszelkiego rodzaju urazy i choroby kończą się, ale nie precyzuje, czy dotyczy to również statusów takich jak Krwawienie, Zatrucie czy Pokiereszowanie.
  Dowód: „Wszelkiego rodzaju urazy i choroby kończą się.”
  Powiązane: `bardzo_dlugi_odpoczynek`

- **Rozwój postaci: brak kosztu rozwoju Bariery** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' nie zawiera informacji o koszcie rozwijania Bariery, mimo że jest ona wymieniona jako statystyka defensywna w innych plikach.
  Dowód: „## Statystyki trzeciorzędne”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: brak kosztu rozwoju Odporności na Śmierć** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' mówi, że Odporność na Śmierć regeneruje się w tempie 1 dziennie, ale nie podaje kosztu PD za jej rozwinięcie.
  Dowód: „* Odporność na Śmierć - regeneruje się w tempie 1 dziennie.”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: brak kosztu rozwoju Pancerza** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' nie zawiera informacji o koszcie rozwijania Pancerza, mimo że jest on wymieniony jako statystyka trzeciorzędna w innych plikach.
  Dowód: „## Statystyki trzeciorzędne”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: brak kosztu rozwoju Staminy / Many** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' mówi, że bazowa wartość Staminy / Many rośnie wraz z rozwijaniem cechy powiązanej z daną bronią, ale nie podaje kosztu PD za jej rozwinięcie.
  Dowód: „* Stamina / Mana - bazowa wartość rośnie wraz z rozwijaniem cechy powiązanej z daną bronią.”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: brak kosztu rozwoju statystyk drużynowych** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Rozwój postaci' nie zawiera informacji o koszcie rozwijania statystyk drużynowych (Majętność, Sława), mimo że są one wymienione w innych plikach jako statystyki drużynowe.
  Dowód: „## Statystyki trzeciorzędne”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: brak ogólnych kosztów umiejętności i perków** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Umiejętności oraz perki' mówi, że po spełnieniu wymagań należy wydać ilość PD wyszczególnioną przy danej umiejętności lub perku, ale nie podaje ogólnych zasad ani tabeli kosztów.
  Dowód: „Po spełnieniu wymagań, należy wydać ilość PD wyszczególnioną przy danej umiejętności lub perku, aby je odblokować.”
  Powiązane: `umiejetnosci_oraz_perki`

- **Rozwój postaci: niejasny koszt przywrócenia Poczytalności** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' mówi, że przywrócenie 1% poczytalności kosztuje 100 PD, ale nie precyzuje, czy chodzi o 1 punkt procentowy, czy o 1% wartości maksymalnej.
  Dowód: „* Poczytalność - przywrócenie 1% poczytalności kosztuje 100 PD”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: niejasny status potrójnej predyspozycji** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Predyspozycje' mówi, że potrójna zniżka nie zapewnia dalszych premii, ale nie precyzuje, czy potrójna predyspozycja w ogóle istnieje, czy jest to tylko zabezpieczenie na wypadek przyszłych rozszerzeń.
  Dowód: „Potrójna zniżka nie zapewnia dalszych premii.”
  Powiązane: `predyspozycje`

- **Rozwój postaci: niejasny wzrost kosztu Max PŻ** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' mówi, że zwiększenie Max PŻ o 1 kosztuje 100 PD, a każde kolejne rozwinięcie kosztuje o 100 PD więcej, ale nie precyzuje, czy koszt rośnie liniowo w nieskończoność.
  Dowód: „* Maksymalne Punkty Życia - zwiększenie Max PŻ o 1 kosztuje 100 PD. Każde kolejne rozwinięcie kosztuje o 100 PD więcej.”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: niejasny zakres PD dla Mądrości** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' mówi, że za każde WYDANE 1000 PD wartość Mądrości rośnie o 1, ale nie precyzuje, czy dotyczy to PD wydanych na rozwój statystyk, czy również na umiejętności i perki.
  Dowód: „* Mądrość - za każde WYDANE 1000 PD, wartość Mądrości rośnie o 1”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Rozwój postaci: niejasny zakres testu Szczęścia** — `mechaniki_bazowe/rozwój_postaci.md`
  Sekcja 'Statystyki trzeciorzędne' mówi, że na koniec każdej sesji należy wykonać test Szczęścia, a w przypadku porażki wartość Szczęścia zwiększa się o 1, ale nie precyzuje, czy dotyczy to wszystkich Bohaterów, czy tylko tych, którzy brali udział w sesji.
  Dowód: „* Szczęście - na koniec każdej sesji należy wykonać test Szczęścia. W przypadku porażki, wartość Szczęścia zwiększa się o 1.”
  Powiązane: `rozwoj_statystyk_trzeciorzednych`

- **Testy: brak efektu ekstremalnej manifestacji chaosu** — `mechaniki_bazowe/testy.md`
  Sekcja o ekstremalnej manifestacji chaosu mówi, że trzecia szóstka oznacza ekstremalną manifestację chaosu, ale nie podaje żadnego efektu mechanicznego tego zdarzenia.
  Dowód: „Trzecia szóstka oznacza ekstremalną manifestację chaosu.”
  Powiązane: `ekstremalna_manifestacja_chaosu`

- **Testy: brak rozstrzygnięcia remisu w testach przeciwstawnych** — `mechaniki_bazowe/testy.md`
  Sekcja o testach przeciwstawnych mówi, że zwycięża ten kto osiągnie wyższy poziom sukcesów, ale nie precyzuje, co się dzieje w przypadku remisu.
  Dowód: „W przypadku testów przeciwstawnych, zwycięża ten kto osiągnie wyższy poziom sukcesów.”
  Powiązane: `testy_przeciwstawne`

- **Testy: brak wartości krytycznego sukcesu i porażki** — `mechaniki_bazowe/testy.md`
  Sekcja o krytycznych sukcesach i porażkach mówi, że mają one wyższą wartość od dowolnego poziomu sukcesów lub porażek, ale nie podaje konkretnej wartości mechanicznej.
  Dowód: „Mają one wyższą wartość od dowolnego poziomu sukcesów lub porażek, również w przypadku testów przeciwstawnych.”
  Powiązane: `krytyczny_sukces`, `krytyczna_porażka`

- **Testy: niejasny moment wykorzystania Szczęścia** — `mechaniki_bazowe/testy.md`
  Sekcja o Szczęściu mówi o dwóch sposobach wykorzystania puli Szczęścia, ale nie precyzuje, czy można je wykorzystać w dowolnym momencie, czy tylko przed rzutem.
  Dowód: „Każdy BG dysponuje pulą Szczęścia. Może je wykorzystać na dwa sposoby:”
  Powiązane: `test`

- **Testy: niejasny sposób liczenia poziomów sukcesu** — `mechaniki_bazowe/testy.md`
  Sekcja o sukcesach i porażkach mówi o 1 poziomie sukcesu za każdy punkt różnicy, ale nie precyzuje, czy różnica jest liczona od statystyki, czy od wyniku rzutu.
  Dowód: „W przypadku sukcesu, mamy do czynienia z 1 poziomem sukcesu za każdy punkt różnicy pomiędzy testowaną statystyką a wynikiem rzutu.”
  Powiązane: `sukcesy_i_porażki`

- **Testy: niejasny sposób stosowania modyfikatorów trudności** — `mechaniki_bazowe/testy.md`
  Sekcja o poziomach trudności podaje modyfikatory od +6 do -6, ale nie precyzuje, czy są to modyfikatory do statystyki, czy do rzutu.
  Dowód: „Modyfikatory zmieniają wartość testowanej statystyki na potrzeby rzutu:”
  Powiązane: `poziomy_trudności`

- **Testy: niejasny zakres ekstremalnej manifestacji chaosu** — `mechaniki_bazowe/testy.md`
  Sekcja o ekstremalnej manifestacji chaosu mówi o rzucie trzecią kością, ale nie precyzuje, czy dotyczy to tylko testów, czy również rzutów na obrażenia.
  Dowód: „Jeśli w teście na kości wypadnie wynik 6, należy rzucić dodatkową k20.”
  Powiązane: `ekstremalna_manifestacja_chaosu`

- **Testy: niejasny zakres krytyków** — `mechaniki_bazowe/testy.md`
  Sekcja o krytycznych sukcesach i porażkach mówi o rzucie dodatkową k20, ale nie precyzuje, czy dotyczy to tylko testów, czy również rzutów na obrażenia.
  Dowód: „Jeśli w teście na kości wypadnie wynik 1, należy rzucić dodatkową k20.”
  Powiązane: `krytyczny_sukces`, `krytyczna_porażka`

- **Testy: niejasny zakres Szczęśliwego trafu** — `mechaniki_bazowe/testy.md`
  Sekcja o Szczęściu mówi o teście Szczęścia w przypadku nieposiadania niemagicznego przedmiotu, ale nie precyzuje, czy przedmiot musi być zwykły, czy może być magiczny.
  Dowód: „W przypadku nieposiadania niemagicznego przedmiotu w swoim ekwipunku, z którego chciałoby się skorzystać, należy wykonać test Szczęścia.”
  Powiązane: `szczesliwy_traf`

- **Testy: niejasny zakres testowanych statystyk** — `mechaniki_bazowe/testy.md`
  Sekcja o testach mówi, że test wykonuje się w odniesieniu do statystyk defensywnych, drugorzędnych, szczęścia i sławy, ale nie precyzuje, czy testy statystyk pierwszorzędnych są w ogóle możliwe.
  Dowód: „Test statystyki wykonuje się w odniesieniu do statystyk defensywnych, drugorzędnych, szczęścia i sławy poprzez rzut k20.”
  Powiązane: `test`

- **Testy: niejasny zakres zwiększania Szczęścia** — `mechaniki_bazowe/testy.md`
  Sekcja o Szczęściu mówi, że na końcu każdej sesji należy wykonać test Szczęścia, a porażka oznacza, że jego wartość podnosi się o 1, ale nie precyzuje, czy dotyczy to wszystkich Bohaterów.
  Dowód: „Na końcu każdej sesji należy wykonać test Szczęścia. Porażka oznacza, że jego wartość podnosi się o 1.”
  Powiązane: `test`

### Tworzenie postaci

- **Bagiennik: brak wartości mechanicznych znalezisk** — `tworzenie_postaci/profesje/bagiennik.md`
  Lista znalezisk w przerwie profesyjnej 'Głębia Bagna' opisuje przedmioty (Bagienny szlam, Torfowe zioła, Kości/szczątki) bez podania ich wartości mechanicznych ani sposobu użycia w craftingu.
  Dowód: „* Bagienny szlam - składnik alchemiczny * Torfowe zioła - bazy do mikstur leczniczych lub trucizn oraz ich ulepszeń * Kości/szczątki - bazy pancerzy i broni oraz ich ulepszeń”
  Powiązane: `bagiennik`

- **Lista profesji: brak szczegółowych opisów dla części profesji** — `tworzenie_postaci/profesje/lista_profesji.md`
  Lista profesji wymienia wiele profesji, dla których nie istnieje osobny plik ze szczegółowym opisem (predyspozycje, majętność, sława, cechy specjalne, wyposażenie). Są one reprezentowane jako wpisy typu stub.
  Dowód: „* Akolita * Banita * Chłop”
  Powiązane: `akolita`, `banita`, `chłop`, `ciura_obozowa`, `cyrkowiec`, `doker`

- **Lista ras: brak szczegółowych opisów dla części ras** — `tworzenie_postaci/rasy/lista_ras.md`
  Lista ras wymienia rasy, dla których nie istnieje dedykowany plik opisu w źródłach: Elf, Niziołek, Gnom, Drakonid, Ork, Ryboczłek, Minotaur, Ogr, Diablę, Anielę, Wilkołak. Są one reprezentowane jako wpisy typu stub.
  Dowód: „* Elf * Niziołek * Gnom * Mykonid * Automat * Centaur * Drakonid * Ork * Ryboczłek * Minotaur * Ogr * Plazmoid * Diablę * Anielę * Wilkołak”
  Powiązane: `elf`, `niziołek`, `gnom`, `drakonid`, `ork`, `ryboczłek`

- **Mykonid: bezimienna pasywna cecha specjalna** — `tworzenie_postaci/rasy/mykonid.md`
  Trzecia pasywna cecha specjalna Mykonida (telepatia zarodnikowa na 100 metrów) nie posiada nazwy w źródle, w przeciwieństwie do dwóch pozostałych cech pasywnych. Wpisano ją bez pola name.
  Dowód: „* Mykonidy nie muszą mówić na głos do innych mykonidów. Wypuszczają niewidoczne chmury zarodników, które pozwalają im przesyłać obrazy, emocje i proste myśli w promieniu 100 metró…”
  Powiązane: `mykonid`

- **Perki: 'Szok' w Ekwilibrium żywiołów bez zdefiniowanego statusu** — `tworzenie_postaci/perki.md`
  Perk Ekwilibrium żywiołów pozwala nakładać Podpalenie, Zamrożenie i Szok, ale w kategorii walki nie istnieje status o nazwie Szok (występuje Porażenie). Nazwa użyta w perku nie odpowiada żadnemu zdefiniowanemu statusowi.
  Dowód: „Umożliwia nakładanie Podpalenia, Zamrożenia i Szoku, jeśli atak umożliwiał nałożenie jednego z nich.”
  Powiązane: `ekwilibrium_żywiołów`

- **Przewoźnik: brak przerwy profesyjnej** — `tworzenie_postaci/profesje/przewoźnik.md`
  Plik Przewoźnika nie zawiera sekcji przerwy profesyjnej, podczas gdy inne profesje (Aptekarz, Bagiennik, Botanik, Gazeciarz, Szlachic, Śmieciarz) taką sekcję posiadają.
  Dowód: „# Wyposażenie początkowe”
  Powiązane: `przewoźnik`

- **Żeglarz: brak przerwy profesyjnej** — `tworzenie_postaci/profesje/żeglarz.md`
  Plik Żeglarza nie zawiera sekcji przerwy profesyjnej, podczas gdy inne profesje taką sekcję posiadają.
  Dowód: „# Wyposażenie początkowe”
  Powiązane: `żeglarz`

### Ekwipunek

- **Broń: brak wartości liczbowych dla części cech specjalnych** — `ekwipunek/broń.md`
  Część cech specjalnych (np. Wszechstronny, Przeciwpancerny, Druzgocący, Miażdżący, Wyprzedzający, Dowodzący, Magiczny, Rąbiący, Wysysający, Skrytobójczy, Krytyczny, Szybkostrzelny, Głośny, Niebezpieczny) opisana jest słownie, ale bez pełnych wartości liczbowych lub tabel, co utrudnia jednoznaczne rozliczenie w niektórych przypadkach.
  Dowód: „* Wszechstronny - Zapewnia darmowe użycie jednego wzmocnienia umiejętności w trakcie rundy, wyłączając bezpośrednie zwiększenie obrażeń.”

- **Broń: brak zasięgu dla broni białej** — `ekwipunek/broń.md`
  Tabela broni białej nie zawiera kolumny z zasięgiem, mimo że w innych miejscach systemu rozróżniane są zasięgi (np. zwarcie, krótki). Cecha 'Krótki' sugeruje istnienie zasięgu, ale wartości nie podano.
  Dowód: „\| Nazwa \| Obrażenia \| Użycie \| Bazowa statystyka \| Cechy specjalne \| Wymagana Majętność \|”

- **Duchowa Szata Gorzkiego Rozkwitu: brak wartości Pancerza** — `ekwipunek/przedmioty_magiczne/arcymistrzowskie/duchowa_szata_gorzkiego_rozkwitu.md`
  Przedmiot typu Pancerz podaje Barierę, ale nie podaje wartości Pancerza, mimo że inne magiczne pancerze w źródłach ją zawierają.
  Dowód: „* Typ - Pancerz * Bariera - 39”
  Powiązane: `duchowa_szata_gorzkiego_rozkwitu`

- **Korona ze Smoczych Zębów: adnotacja Niezidentyfikowana** — `ekwipunek/przedmioty_magiczne/mityczny/korona_ze_smoczych_zębów.md`
  Przedmiot posiada adnotację "Niezidentyfikowana", ale źródło nie definiuje mechanicznego znaczenia tego stanu ani sposobu identyfikacji przedmiotu.
  Dowód: „**Niezidentyfikowana**”
  Powiązane: `korona_ze_smoczych_zębów`

- **Łowca Głębin: brak sekcji Opis** — `ekwipunek/przedmioty_magiczne/arcymistrzowskie/łowca_głebin.md`
  Plik zawiera jedynie typ, rzadkość i modyfikatory, bez sekcji Opis obecnej w pozostałych przedmiotach magicznych.
  Dowód: „* Złowione ryby są co najmniej niezwykłe”
  Powiązane: `łowca_głebin`

- **Nagolenniki ze Smoczych Kości: adnotacja Niezidentyfikowane** — `ekwipunek/przedmioty_magiczne/mityczny/nagolenniki_ze_smoczych_kości.md`
  Przedmiot posiada adnotację "Niezidentyfikowane", ale źródło nie definiuje mechanicznego znaczenia tego stanu ani sposobu identyfikacji przedmiotu.
  Dowód: „**Niezidentyfikowane**”
  Powiązane: `nagolenniki_ze_smoczych_kości`

- **Siła Bagna: perk "Krew Tytanów" nie istnieje w liście perków** — `ekwipunek/przedmioty_magiczne/arcymistrzowskie/siła_bagna.md`
  Przedmiot zapewnia perk o nazwie "Krew Tytanów", ale w źródle perków występuje jedynie perk "Krew gigantów". Nie jest jasne, czy to ta sama zdolność pod inną nazwą, czy brakujący perk.
  Dowód: „* Zapewnia perka "Krew Tytanów"”
  Powiązane: `siła_bagna`, `krew_gigantów`

### Walka

- **Morale: brak wartości morale dla bossa** — `walka/morale.md`
  Sekcja 'Początkowe morale' wymienia wartości dla Trepa, Elity i Mistrza, ale nie podaje wartości dla Bossa ani Uber bossa, mimo że tiery te istnieją w systemie. Nie jest jasne, jak liczyć morale, gdy w walce bierze udział boss (poza tym, że system morale jest wtedy zawieszony).
  Dowód: „Każdy przeciwnik zwiększa morale w następujący sposób: * Trep - 1 * Elita - 3 * Mistrz - 7”
  Powiązane: `morale`, `poczatkowe_morale`, `boss`, `uber_boss`

- **Morale: brak wartości morale dla uber bossa** — `walka/morale.md`
  Sekcja 'Początkowe morale' nie podaje wartości dla Uber bossa, mimo że tier ten jest zdefiniowany w bestiariuszu. Nie jest jasne, czy uber boss wpływa na morale ani jak zawieszenie morale działa w jego przypadku.
  Dowód: „5. Uber boss - Finalny przeciwnik całej kampanii”
  Powiązane: `morale`, `poczatkowe_morale`, `uber_boss`

- **Morale: brak wartości odzyskiwania dla bossa** — `walka/morale.md`
  Sekcja 'Odzyskiwanie morale' nie precyzuje, czy pokonanie bossa przez Bohaterów lub dołączenie bossa do walki wpływa na morale. Nie jest też jasne, czy boss może być traktowany jako 'posiłki'.
  Dowód: „Drużyna przeciwników zyskuje morale w następujących sytuacjach: * Do walki dołączają posiłki (wg. wzoru z początkowych morale)”
  Powiązane: `morale`, `odzyskiwanie_morale`, `boss`

- **Morale: brak wartości odzyskiwania dla uber bossa** — `walka/morale.md`
  Sekcja 'Odzyskiwanie morale' nie precyzuje, czy uber boss wpływa na morale ani czy jego pokonanie je zmienia. Nie jest jasne, czy uber boss jest traktowany jak boss w kontekście zawieszenia morale.
  Dowód: „## Bossowie Jeśli w walce bierze udział boss, system morale zostaje zawieszony.”
  Powiązane: `morale`, `odzyskiwanie_morale`, `uber_boss`

- **Morale: brak wartości ujemnych dla pokonanych** — `walka/morale.md`
  Sekcja 'Utrata morale' podaje wartości dla Trepa, Elity i Mistrza, ale nie dla Bossa ani Uber bossa. Nie jest jasne, jak liczyć utratę morale po pokonaniu bossa (choć system morale jest wtedy zawieszony).
  Dowód: „Morale spada o podwojoną wartość danego przeciwnika, czyli: * Trep - 2 * Elita - 6 * Mistrz - 14”
  Powiązane: `morale`, `utrata_morale`, `boss`, `uber_boss`

### Bestiariusz

- **Wilk: brak pola Rozmiar** — `bestiariusz/zwierzaki/wilk.md`
  Blok statystyk Wilka, w przeciwieństwie do pozostałych zwierzaków, nie zawiera wiersza 'Rozmiar'. Rozmiar ma znaczenie mechaniczne (m.in. zajmowany obszar), a dla Wilka nie został określony.
  Dowód: „* Typ - Trep * Tagi - Zwierzak * Odporności - Fizyczne * Podatności - Ogień * HP - 30 * Pancerz - Lekki”
  Powiązane: `wilk`

## 4. Niejasności (24)

### Tworzenie postaci

- **Aptekarz: efekt 22 bez wskazanego podmiotu** — `tworzenie_postaci/profesje/aptekarz.md`
  Efekt nr 22 'Obniżenie poziomu Szoku i Podpalenia do końca walki' nie precyzuje, kogo dotyczy obniżenie poziomów (postaci, przeciwników, sektora).
  Dowód: „22. Obniżenie poziomu Szoku i Podpalenia do końca walki.”
  Powiązane: `aptekarz`

- **Aptekarz: efekt 9 nie precyzuje zakresu HP -1** — `tworzenie_postaci/profesje/aptekarz.md`
  Efekt nr 9 'Zamienia wszystkie HP -1 na Barierę' nie precyzuje, czy chodzi o wszystkie brakujące punkty życia, ani jaką wartość Bariery należy przyznać.
  Dowód: „9. Zamienia wszystkie HP -1 na Barierę.”
  Powiązane: `aptekarz`

- **Perki: Awatar ognia - konwersja wszystkich obrażeń na ogień** — `tworzenie_postaci/perki.md`
  Perk stanowi, że wszystkie zadawane obrażenia są zawsze obrażeniami od ognia, nie precyzując czy dotyczy to również obrażeń eskalujących, statusów i obrażeń od broni magicznych zadających inne typy.
  Dowód: „Wszystkie zadawane obrażenia są zawsze obrażeniami od ognia.”
  Powiązane: `awatar_ognia`

- **Perki: Technika pustej dłoni - niejasne źródło 3 Staminy** — `tworzenie_postaci/perki.md`
  Opis perka mówi, że postać 'zyskuje 3 Staminy', nie precyzując czy jest to jednorazowy bonus, zwiększenie bazowej Staminy, czy efekt odnawialny.
  Dowód: „ataki bez broni zyskują cechę Krytyczny i zyskuje 3 Staminy.”
  Powiązane: `technika_pustej_dłoni`

- **Perki: Zabliźniona wiara - '1 Bariery' nieprecyzyjne** — `tworzenie_postaci/perki.md`
  Opis perka mówi o generowaniu '1 Bariery' za każdy udany test defensywny, nie precyzując czy chodzi o 1 punkt Bariery trwale, czy do końca walki/tury.
  Dowód: „Każdy udany test defensywny generuje 1 Bariery.”
  Powiązane: `zabliźniona_wiara`

- **Perki: Życie na krawędzi - HP zawsze 0 bez sprecyzowania interakcji** — `tworzenie_postaci/perki.md`
  Perk stanowi, że HP zawsze wynosi 0, a Bramy Śmierci nie nakładają kar, ale nie precyzuje, czy postać nadal wykonuje testy Odporności na Śmierć przy otrzymaniu obrażeń ani jak działa leczenie przy HP równym 0.
  Dowód: „HP zawsze wynosi 0. Bramy Śmierci nie nakładają żadnych kar.”
  Powiązane: `życie_na_krawędzi`

- **Żeglarz: odzyskanie '2k4 Energii' bez zdefiniowanej statystyki** — `tworzenie_postaci/profesje/żeglarz.md`
  Aktywna umiejętność 'Wszystkie ręce na pokład' pozwala odzyskać '2k4 Energii', ale w systemie nie zdefiniowano statystyki 'Energia' (występują Stamina i Mana).
  Dowód: „albo odzyskać 2k4 Energii”
  Powiązane: `żeglarz`

### Ekwipunek

- **Bezczynny Chwyt Północnej Zimy: odwołanie do Energii** — `ekwipunek/przedmioty_magiczne/mityczny/bezczynny_chwyt_północnej_zimy.md`
  Modyfikatory odwołują się do bazowej Energii, która nie jest zdefiniowaną statystyką w systemie. Nie jest jasne, czy chodzi o Staminę / Manę, czy o osobną statystykę.
  Dowód: „* Pozwala na zyskanie dodatkowej akcji kosztem 25% bazowej Energii”
  Powiązane: `bezczynny_chwyt_północnej_zimy`

- **Broń: niejasny zapis 'ilość rozwinięć' w Kanalizujący** — `ekwipunek/broń.md`
  Opis cechy Kanalizujący mówi o zwiększeniu bazowego poziomu Many o 'ilość rozwinięć statystyki Arkana', nie precyzując czy chodzi o rozwinięcia statystyki drugorzędnej Arkana, ani jak liczone są rozwinięcia.
  Dowód: „* Kanalizujący - Zwiększa bazowy poziom Many o ilość rozwinięć statystyki Arkana.”
  Powiązane: `kostur`

- **Broń: niejasny zasięg 'Krótki' dla broni białej** — `ekwipunek/broń.md`
  Cecha 'Krótki' występuje przy szponach i sztyletach, ale w tabeli broni białej nie ma kolumny zasięgu, więc nie jest jasne, czy 'Krótki' oznacza zasięg, czy inną właściwość.
  Dowód: „\| Szpony \| 2k6 \| 2H \| Zręczność \| Wysysający, Krótki \| 27 \|”
  Powiązane: `szpony`, `sztylet`, `sztylet_sprężynowy`

- **Pas Nuggitha: jednoczesne potrojenie i podwojenie zużycia** — `ekwipunek/przedmioty_magiczne/potężne/pas_nuggitha.md`
  Spaczony modyfikator jednocześnie potraja i podwaja ilość zużyć przedmiotów podręcznych. Nie jest jasne, czy efekty się kumulują (x6), czy jeden zastępuje drugi.
  Dowód: „* Potraja ilość zużyć przedmiotów podręcznych * Podwaja zużycie przedmiotów podręcznych”
  Powiązane: `pas_nuggitha`

- **Zaprzysiężona Framuga Dębowego Oporu: generowanie Energii** — `ekwipunek/przedmioty_magiczne/mityczny/zaprzysiężona_framuga_dębowego_oporu.md`
  Modyfikator mówi o generowaniu 1k4 Energii, ale Energia nie jest zdefiniowaną statystyką w systemie. Nie jest jasne, czy chodzi o Staminę / Manę, czy o osobny zasób.
  Dowód: „* Każdy udany test defensywny generuje 1k4 Energii”
  Powiązane: `zaprzysiężona_framuga_dębowego_oporu`

### Walka

- **Morale: niejasna wartość odzyskiwania za Bramy Śmierci** — `walka/morale.md`
  Sekcja 'Odzyskiwanie morale' podaje +1 za stanie Bohatera u progu Bram Śmierci oraz +1 za zdanie testu Odporności na Śmierć. Nie jest jasne, czy oba efekty mogą wystąpić w tej samej turze ani czy kumulują się.
  Dowód: „* Bohater Gracza staje u progu Bram Śmierci (+1) * Bohater Gracza zdaje test Odporności na Śmierć (+1)”
  Powiązane: `morale`, `odzyskiwanie_morale`, `bramy_śmierci`

- **Morale: niejasna wartość odzyskiwania za miniona** — `walka/morale.md`
  Sekcja 'Odzyskiwanie morale' podaje wartość +0,5 za pokonanie miniona lub sojusznika Drużyny Bohaterów. Nie jest jasne, czy wartość ta jest zaokrąglana ani jak łączy się z innymi wartościami całkowitymi.
  Dowód: „* Minion lub sojusznik Drużyny Bohaterów zostaje pokonany (+0,5)”
  Powiązane: `morale`, `odzyskiwanie_morale`

- **Morale: niejasna wartość odzyskiwania za śmierć Bohatera** — `walka/morale.md`
  Sekcja 'Odzyskiwanie morale' podaje +5 za śmierć lub wyeliminowanie Bohatera Gracza z walki. Nie jest jasne, czy 'wyeliminowanie' obejmuje np. ucieczkę, ogłuszenie czy inne formy wyłączenia z walki.
  Dowód: „* Bohater Gracza ginie lub w inny sposób zostaje wyeliminowany z walki (+5)”
  Powiązane: `morale`, `odzyskiwanie_morale`

- **Morale: niejasne zawieszenie morale przy bossie** — `walka/morale.md`
  Sekcja 'Bossowie' mówi, że system morale zostaje zawieszony, gdy w walce bierze udział boss, i zostaje automatycznie złamany po jego pokonaniu. Nie jest jasne, czy morale jest wtedy w ogóle śledzone ani czy inne efekty (np. Panika) nadal działają.
  Dowód: „Jeśli w walce bierze udział boss, system morale zostaje zawieszony. Morale zostaje wtedy automatycznie złamane w momencie, w którym boss zostaje pokonany i nie może zostać złamane…”
  Powiązane: `morale`, `morale_bossowie`, `boss`

- **Morale: niejasne zawieszenie morale przy uber bossie** — `walka/morale.md`
  Sekcja 'Bossowie' mówi o zawieszeniu morale przy bossie, ale nie precyzuje, czy dotyczy to również uber bossa. Nie jest jasne, czy uber boss jest traktowany jak boss w kontekście morale.
  Dowód: „## Bossowie Jeśli w walce bierze udział boss, system morale zostaje zawieszony.”
  Powiązane: `morale`, `morale_bossowie`, `uber_boss`

- **Morale: niejasny pościg za uciekającymi** — `walka/morale.md`
  Sekcja 'Złamane morale' opisuje pościg testem poruszania się z modyfikatorami, ale nie precyzuje, czy każdy Bohater wykonuje osobny test, czy jest to test grupowy, ani jak rozliczać wielu uciekających przeciwników.
  Dowód: „Jeśli Bohaterowie chcą ich dogonić i złapać, muszą wykonać test związany z poruszaniem się, zależny od terenu (Atletyka, Wspinaczka, Prowadzenie, Pływanie, itp.) obarczony modyfik…”
  Powiązane: `morale`, `zlamane_morale`

- **Morale: niejasny wpływ Paniki Bohatera na morale** — `walka/morale.md`
  Sekcja 'Utrata morale' mówi o przeciwnikach z poziomami Paniki, ale nie precyzuje, czy Panika Bohaterów Graczy wpływa na morale przeciwników. Nie jest jasne, czy morale dotyczy tylko przeciwników.
  Dowód: „Przeciwnicy tracją również morale w wyniku nakładanych statusów Paniki. Każdy przeciwnik z dowolną ilością poziomów Paniki obniża morale o 1.”
  Powiązane: `morale`, `utrata_morale`, `panika`

- **Morale: niejasny wpływ Paniki NPC na morale** — `walka/morale.md`
  Sekcja 'Utrata morale' mówi, że każdy przeciwnik z dowolną ilością poziomów Paniki obniża morale o 1. W sekcji 'Panika' statusu NPC jest liczony jako martwy na potrzeby Morale. Nie jest jasne, czy te dwa efekty kumulują się.
  Dowód: „Na potrzeby Morale, NPC jest liczony jako martwy.”
  Powiązane: `morale`, `utrata_morale`, `panika`

- **Morale: niejasny wpływ pojedynczego poziomu Paniki** — `walka/morale.md`
  Sekcja 'Utrata morale' mówi, że każdy przeciwnik z dowolną ilością poziomów Paniki obniża morale o 1. Nie jest jasne, czy chodzi o obniżenie za każdego przeciwnika z Paniką, czy o obniżenie za każdy poziom Paniki u przeciwnika.
  Dowód: „Każdy przeciwnik z dowolną ilością poziomów Paniki obniża morale o 1.”
  Powiązane: `morale`, `utrata_morale`, `panika`

- **Morale: niejasny wpływ poziomów Paniki na morale** — `walka/morale.md`
  Sekcja 'Utrata morale' mówi, że każdy przeciwnik z dowolną ilością poziomów Paniki obniża morale o 1. Nie jest jasne, czy chodzi o jednorazowe obniżenie przy nałożeniu Paniki, czy o obniżenie za każdy poziom Paniki.
  Dowód: „Przeciwnicy tracją również morale w wyniku nakładanych statusów Paniki. Każdy przeciwnik z dowolną ilością poziomów Paniki obniża morale o 1.”
  Powiązane: `morale`, `utrata_morale`, `panika`

- **Morale: niejasny wzór dla posiłków** — `walka/morale.md`
  Sekcja 'Odzyskiwanie morale' mówi, że posiłki zwiększają morale 'wg. wzoru z początkowych morale', ale nie precyzuje, czy chodzi o sumę wartości wszystkich posiłków, czy o wartość pojedynczego przeciwnika.
  Dowód: „* Do walki dołączają posiłki (wg. wzoru z początkowych morale)”
  Powiązane: `morale`, `odzyskiwanie_morale`, `poczatkowe_morale`

### Bestiariusz

- **Wilk: niejasna interakcja cechy Wataha z zasadą hord** — `bestiariusz/zwierzaki/wilk.md`
  Cecha 'Wataha' zwiększa obrażenia hordy wilków o 10% za każdego członka ponad pierwszego, podczas gdy ogólna zasada hord premiuje atak o jedną dodatkową kość za każdych 2 członków. Źródła nie precyzują, czy bonus 'Watachy' sumuje się z regułą hord, ani jak traktować wartość procentową przy niecałkowitej liczbie kości.
  Dowód: „Jeśli Wilki atakują jako horda, obrażenia są dodatkowo zwiększone o 10% za każdego członka hordy ponad pierwszego.”
  Powiązane: `wilk`, `horda`

## 5. Konflikty (7)

### Ekwipunek

- **Krew Maga: sprzeczność między przedmiotami podręcznymi a ich blokadą** — `ekwipunek/przedmioty_magiczne/boskie/krew_maga.md`
  Pas posiada 3 sloty przedmiotów podręcznych, ale jednocześnie modyfikator uniemożliwia wykorzystywanie przedmiotów podręcznych. Nie jest jasne, czy sloty służą wyłącznie do przechowywania pasywnych efektów, czy są bezużyteczne.
  Dowód: „* Uniemożliwia wykorzystywanie przedmiotów podręcznych.”
  Powiązane: `krew_maga`

- **Mocarny Nożyk Motylkowy: rzadkość Potężny mimo folderu Arcymistrzowskie** — `ekwipunek/przedmioty_magiczne/arcymistrzowskie/mocarny_nożyk_motylkowy.md`
  Plik znajduje się w katalogu arcymistrzowskich przedmiotów magicznych, ale w treści zadeklarowano rzadkość Potężny. Patch notes 0.1.16 również wymieniają ten przedmiot jako Arcymistrzowskie.
  Dowód: „* Rzadkość - Potężny”
  Powiązane: `mocarny_nożyk_motylkowy`

- **Ostrze Armageddonu: spaczone zdetonowanie odnosi się do Zamrożenia** — `ekwipunek/przedmioty_magiczne/potężne/ostrze_armageddonu.md`
  Spaczony modyfikator opisuje detonowanie Podpalenia, ale zadawane obrażenia przypisano zdetonowanym poziomom Zamrożenia. Analogiczny wpis na pierścieniu Trzask dotyczy Zamrożenia, co sugeruje możliwą pomyłkę w nazwie statusu.
  Dowód: „Każdy zdetonowany poziom Zamrożenia zadaje 2k12 obrażeń od ognia.”
  Powiązane: `ostrze_armageddonu`, `trzask`

- **Rzadkość przedmiotów: rozbieżne definicje Majętność vs Crafting** — `ekwipunek/majętność.md`
  Sekcja "Rzadkość przedmiotów" pojawia się w dwóch plikach i opisuje tę samą skalę (Niezwykłe/Niezwykły, Rzadkie, Potężne, Arcymistrzowskie, Mityczne, Boskie) w odmienny sposób. W ekwipunek/majętność.md poziomy opisane są opisowo przez "kaliber" mocy przedmiotu (np. Niezwykłe - kaliber broni +1, Rzadkie - kaliber tarczy z okiem), natomiast w mechaniki_bazowe/crafting.md te same poziomy opisane są konkretnymi wartości…
  Dowód: „ekwipunek/majętność.md: "Niezwykłe - Zapewniają jeden prosty bonus (kaliber broni +1)"; mechaniki_bazowe/crafting.md: "Niezwykły - Zapewnia bonus +1 do statystyki pierwszorzędnej …”
  Powiązane: `rzadkosc_przedmiotow`

- **Tarcza Milczącej Kniei: rzadkość Niezwykły mimo folderu Rzadkie** — `ekwipunek/przedmioty_magiczne/rzadkie/tarcza_milczącej_kniei.md`
  Plik znajduje się w katalogu rzadkich przedmiotów magicznych, ale w treści zadeklarowano rzadkość Niezwykły. Patch notes 0.1.12 wymieniają ten przedmiot jako Rzadkie.
  Dowód: „* Rzadkość - Niezwykły”
  Powiązane: `tarcza_milczącej_kniei`

### Tworzenie postaci

- **Skrytobójca: umiejętności skopiowane od Alchemika** — `tworzenie_postaci/klasy/skrytobójca_(nieskończone).md`
  Sekcja 'Aktywne umiejętności bojowe do wykupienia' Skrytobójcy zawiera umiejętności Spopielenie / Zamrożenie, Kto wie?, Trawiący kwas i Wybuch, których opisy wprost odnoszą się do Alchemika ('Alchemik popala lub zamraża...', 'Alchemik zadaje obrażenia...'). Wygląda to na błędne skopiowanie treści z pliku alchemik.md.
  Dowód: „Opis - Alchemik popala lub zamraża cały wybrany sektor w zasięgu”
  Powiązane: `skrytobójca`, `alchemik`

### Bestiariusz

- **Zombie: tag 'Szkielet'** — `bestiariusz/nieumarli/zombie.md`
  Zombie ma w polu Tagi wpisany 'Szkielet', mimo że jest osobnym stworzeniem od Szkieleta. Tag wydaje się błędnie skopiowany z bloku Szkieleta.
  Dowód: „* Tagi - Nieumarły, Szkielet”
  Powiązane: `zombie`, `szkielet`

## 6. Asymetrie (3)

### Tworzenie postaci

- **Lista klas: brak Kawalerzysty w archetypach** — `tworzenie_postaci/klasy/lista_klas.md`
  Kawalerzysta posiada własny plik opisu klasy, ale nie został wymieniony w żadnym z archetypów na liście klas. W związku z tym jego pole archetype pozostaje puste.
  Dowód: „## Żołnierze * Taktyk - skupia się na dowodzeniu i manewrach na polu bitwy”
  Powiązane: `kawalerzysta`

- **Perki: Nekromantyczny talizman - rozbieżność nazw stopni rzadkości** — `tworzenie_postaci/perki.md`
  Perk wymienia stopnie rzadkości amuletu jako 'Niezwykły, Rzadki, Potężne, Arcymistrzowskie, Mityczne, Boskie', podczas gdy w craftingu stopnie te mają formy 'Niezwykły, Rzadki, Potężny, Arcymistrzowski, Mityczny, Boski'. Formy użyte w perku są niespójne gramatycznie z resztą systemu.
  Dowód: „(Niezwykły +1/+5; Rzadki +2/+10; Potężne +3/+15; Arcymistrzowskie +4/+20; Mityczne +5/+25; Boskie +6/+30)”
  Powiązane: `nekromantyczny_talizman`

### Bestiariusz

- **Niedźwiedź: rozmiar w tagach zamiast pola Rozmiar** — `bestiariusz/zwierzaki/niedźwiedź.md`
  W przeciwieństwie do pozostałych zwierzaków, Niedźwiedź nie ma osobnego pola 'Rozmiar', a wartość 'Duży (2x2)' została wpisana w listę tagów.
  Dowód: „* Tagi - Zwierzak, Duży (2x2)”
  Powiązane: `niedźwiedź`

## 7. Uwagi strukturalne (25)

### Tworzenie postaci

- **Botanik: imiona graczy w nawiasach przy roślinach** — `tworzenie_postaci/profesje/botanik.md`
  Przy niektórych roślinach w nawiasach podano imiona (Rafał, Aurora, Mycelis, Velo, Crossword), co sugeruje przypisanie opcji do konkretnych postaci graczy. Nie jest to mechanika, ale warto odnotować jako niespójność prezentacji.
  Dowód: „Alfunas - zwiększa Odporność na Śmierć wybranej postaci o 1 lub wybrana postać zyskuje 2 Pancerza (Rafał)”
  Powiązane: `botanik`

- **Lista klas: Alchemik wymieniony w archetypie Rzemieślnicy** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Alchemik. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: Grzybiarz wymieniony w archetypie Druid** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Grzybiarz. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: Liturgista wymieniony w archetypie Kapłani** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Liturgista. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: Nekromanta wymieniony w archetypie Czarnoksiężnicy** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Nekromanta. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: nieformalny opis Jesiennego Gawędziarza** — `tworzenie_postaci/klasy/lista_klas.md`
  Opis klasy Jesienny Gawędziarz odbiega od konwencji pozostałych opisów archetypów i zawiera nieformalne sformułowanie 'dołuje wszystkich'.
  Dowód: „* Jesienny Gawędziarz - dołuje wszystkich”
  Powiązane: `jesienny_gawędziarz`

- **Lista klas: Sabotażysta wymieniony w archetypie Cienie** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Sabotażysta. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: Skrytobójca wymieniony w archetypie Cienie** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Skrytobójca. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: Taktyk wymieniony w archetypie Żołnierze** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Taktyk. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: Tytan wymieniony w archetypie Wojownicy** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Tytan. Uwaga porządkowa, nie błąd mechaniki.

- **Lista klas: Władca Lasów wymieniony w archetypie Druid** — `tworzenie_postaci/klasy/lista_klas.md`
  Klasy dopisane do archetypu: Władca Lasów. Uwaga porządkowa, nie błąd mechaniki.

- **Lista profesji wymienia Aptekarza, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Aptekarza. Uwaga porządkowa, nie błąd.

- **Lista profesji wymienia Bagiennika, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Bagiennika. Uwaga porządkowa, nie błąd.

- **Lista profesji wymienia Botanika, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Botanika. Uwaga porządkowa, nie błąd.

- **Lista profesji wymienia Gazeciarza, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Gazeciarza. Uwaga porządkowa, nie błąd.

- **Lista profesji wymienia Szlachica, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Szlachica. Uwaga porządkowa, nie błąd.

- **Lista profesji wymienia Śmieciarza, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Śmieciarza. Uwaga porządkowa, nie błąd.

- **Lista profesji wymienia Urzędnika skarbowego, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Urzędnika skarbowego. Uwaga porządkowa, nie błąd.

- **Lista profesji wymienia Żeglarza, który ma osobny opis** — `tworzenie_postaci/profesje/lista_profesji.md`
  Profesje z osobnym plikiem opisu: Żeglarza. Uwaga porządkowa, nie błąd.

- **Lista profesji: kolejność niezgodna z alfabetem** — `tworzenie_postaci/profesje/lista_profesji.md`
  Lista profesji nie jest ułożona alfabetycznie (np. Rycerz, Gladiator, Górnik po Gazeciarzu; Szuler po Handlarzu). Nie jest to błąd mechaniczny, ale utrudnia wyszukiwanie.
  Dowód: „* Gazeciarz * Rycerz * Gladiator”

- **Przewoźnik: wyposażenie początkowe jako nagłówek H1** — `tworzenie_postaci/profesje/przewoźnik.md`
  Sekcja 'Wyposażenie początkowe' w pliku Przewoźnika używa nagłówka H1 (#) zamiast H2 (##), co odbiega od struktury pozostałych plików profesji.
  Dowód: „# Wyposażenie początkowe”
  Powiązane: `przewoźnik`

- **Szlachic: gwiazdki przy niektórych opcjach rodów** — `tworzenie_postaci/profesje/szlachic.md`
  Przy części opcji rodów (sojusz/wrogość) występują gwiazdki (*) oraz dopiski w nawiasach (np. *(Rafał)), których znaczenie nie jest wyjaśnione w pliku.
  Dowód: „Sojusz - Zmniejsza koszt kupna rzadkich i potężnych przedmiotów o 1. *”
  Powiązane: `szlachic`

### Mechaniki bazowe

- **Crafting: dodano tabelę bazy przedmiotu** — `mechaniki_bazowe/crafting.md`
  W poprzedniej wersji pliku brakowało sekcji 'Baza przedmiotu' (tabela 1-10 typów przedmiotów bazowych dla wytwórstwa eksperymentalnego); w bieżącej wersji sekcja ta jest obecna. Nie jest to problem źródła w bieżącej wersji.
  Dowód: „### Baza przedmiotu 1. Hełm 2. Peleryna 3. Amulet 4. Pancerz 5. Pierścionek 6. Rękawice 7. Buty 8. Pas 9. Broń 10. Tarcza”
  Powiązane: `wytworstwo_eksperymentalne`

### Ekwipunek

- **Łowca Głębin: typ Wędka poza listą typów przedmiotów** — `ekwipunek/przedmioty_magiczne/arcymistrzowskie/łowca_głebin.md`
  Przedmiot zadeklarowano jako Wędka, co nie odpowiada żadnemu z bazowych typów przedmiotów magicznych wymienionych w tabeli bazy przedmiotu w craftingu. Nie jest jasne, do której kategorii ekwipunku należy.
  Dowód: „* Typ - Wędka”
  Powiązane: `łowca_głebin`

- **Rzadkość arcymistrzowska: odmiana w nagłówkach** — `ekwipunek/przedmioty_magiczne/arcymistrzowskie/korona_bladego_króla_za_zasłoną_nocy.md`
  W nagłówkach nowych przedmiotów rzadkość zapisano jako „Arcymistrzowski” lub „Arcymistrzowska”, podczas gdy foldery i aplikacja używają formy „Arcymistrzowskie”.
  Dowód: „* Rzadkość - Arcymistrzowski”
  Powiązane: `korona_bladego_króla_za_zasłoną_nocy`, `korona_zwycięzcy_brązowej_brody`, `plazmoidyczne_symulakrum`, `koło_wozu_skrzydlatej_fortecy`

---

## 7. Co zostaje do decyzji

1. **Crafting — negatywny efekt bonusów eksperymentalnych.** Jedna decyzja autora zamyka 50 wpisów.
2. **Testy — brakujące wartości i remisy.** Krytyki, manifestacja chaosu, poziomy sukcesu i Szczęście.
3. **Rozwój postaci — brakujące koszty PD.** Bariera, Pancerz, Odporność na Śmierć, Stamina/Mana, statystyki drużynowe.
4. **Morale — Panika, bossowie i pościg.** 16 wpisów w jednym podsystemie.
5. **Przerwy — zakres efektów aktywności.** 14 wpisów.
6. **Listy klas i profesji — porządki strukturalne.** 17 wpisów, w większości nie są błędami zasad.
7. **Pozostałe literówki i nazwy własne.** 31 wpisów wymaga decyzji autora; część to false positives.

## 8. Czego ten plik nie rozstrzyga

To inwentaryzacja, nie decyzja autora. Po każdej poprawce w źródle wpis należy usunąć, a `revision` nowych wpisów ustawić na commit z poprawką.

