import type { Inconsistency, IndexEntry, Rule } from '../models/compendium';
import indexJson from '../../assets/data/index.json';
import mechanikiJson from '../../assets/data/mechaniki.json';
import niespojnosciJson from '../../assets/data/niespojnosci.json';

const mechaniki = mechanikiJson as unknown as Rule[];
const index = indexJson as unknown as IndexEntry[];
const inconsistencies = niespojnosciJson as unknown as Inconsistency[];
const SYNC_REVISION = 'd8a352450e093cdb4d1bb032f5b3b8d70db9ac9d';

describe('mechaniki.json — trening po źródłowej zmianie 0.1.26', () => {
  it('odwzorowuje nową zasadę treningu', () => {
    const entry = mechaniki.find((item) => item.id === 'trening');
    if (!entry) throw new Error('Brak wpisu "trening" w mechaniki.json');

    expect(entry.definition).toContain('test statystyki');
    expect(entry.definition).toContain('ilość sukesców / 3');
    expect(entry.definition).toContain('zaokrąglone w górę');
    expect(entry.definition).not.toContain('zwiększa się o 1');
  });

  it('rejestruje trening w indeksie wyszukiwania', () => {
    expect(index.some((entry) => entry.id === 'trening' && entry.type === 'mechanic')).toBe(true);
  });

  it('odnotowuje literówkę "sukesców" w Niespójnościach', () => {
    const entry = inconsistencies.find((item) => item.id === 'przerwy_typo_sukescow');
    if (!entry) throw new Error('Brak wpisu Niespójności "przerwy_typo_sukescow"');

    expect(entry.kind).toBe('typo');
    expect(entry.evidence).toContain('sukesców');
    expect(entry.revision).toBe(SYNC_REVISION);
    expect(
      index.some((item) => item.type === 'inconsistency' && item.id === entry.id),
    ).toBe(true);
  });
});


describe('mechaniki.json — rzadkość przedmiotów z Majętności', () => {
  const entry = () => mechaniki.find((e) => e.id === 'rzadkosc_przedmiotow_majetnosc');

  it('ma źródło ekwipunek/majętność.md', () => {
    expect(entry()?.source).toBe('ekwipunek/majętność.md');
  });

  it('odwzorowuje całą skalę', () => {
    expect(entry()?.definition).toContain('Niezwykłe - Zapewniają jeden prosty bonus');
    expect(entry()?.definition).toContain('Rzadkie - Zapewniają dwa proste bonusy');
    expect(entry()?.definition).toContain('Boskie - Pozwalają na kształtowanie');
  });

  it('jest w indeksie', () => {
    expect(
      index.some((e) => e.id === 'rzadkosc_przedmiotow_majetnosc' && e.type === 'mechanic'),
    ).toBe(true);
  });
});


describe('mechaniki.json — crafting z mechaniki_bazowe/crafting.md', () => {
  const ids = [
    'testy_wytworstwa',
    'baza_przedmiotu',
    'eksperymentalna_rzadkosc',
    'eksperymentalne_bonusy_niezwykle_rzadkie',
    'eksperymentalne_bonusy_potezne',
  ];

  it('ma wszystkie sekcje i wpisy w indeksie', () => {
    for (const id of ids) {
      expect(mechaniki.find((e) => e.id === id)?.source).toBe('mechaniki_bazowe/crafting.md');
      expect(index.some((e) => e.id === id && e.type === 'mechanic')).toBe(true);
    }
  });

  it('odwzorowuje tabele', () => {
    const niezwykle = mechaniki.find(
      (e) => e.id === 'eksperymentalne_bonusy_niezwykle_rzadkie',
    )!.definition;
    expect(niezwykle.split('\n').filter((l) => /^\d+-\d+:/.test(l))).toHaveLength(48);
    expect(niezwykle).toContain('99-100: Poczytalność (Ułatwienie) +3');

    const potezne = mechaniki.find(
      (e) => e.id === 'eksperymentalne_bonusy_potezne',
    )!.definition;
    expect(potezne.split('\n').filter((l) => /^\d+-\d+:/.test(l))).toHaveLength(33);
    expect(potezne).toContain('100: Podwojenie zadanych obrażeń');
    expect(mechaniki.find((e) => e.id === 'eksperymentalna_rzadkosc')!.definition).toContain(
      '100: Boska',
    );
  });
});


describe('mechaniki.json — Poczytalność i Szczęście', () => {
  it('odwzorowuje tabelę Delirium', () => {
    const delirium = mechaniki.find((e) => e.id === 'delirium')!.definition;
    for (const text of [
      'Wypaczenie przedmiotu',
      'Panika',
      'Zamknięcie się w sobie',
      'Zwidy',
      'Irracjonalność',
      'Bezsenność',
      'Przygnębienie',
      'Złamana wola',
      'Otępienie',
      'Szał bojowy',
    ]) {
      expect(delirium).toContain(text);
    }
    expect(delirium).toContain('1k5');
    expect(delirium).toContain('-10');
  });

  it('ma testy poczytalności i zwiększanie szczęścia', () => {
    expect(mechaniki.find((e) => e.id === 'testy_poczytalnosci')?.definition).toContain('1k100');
    expect(mechaniki.find((e) => e.id === 'zwiekszanie_szczescia')?.definition).toContain(
      'koniec każdej sesji',
    );
  });
});


describe('mechaniki.json — reguła trudności wytwórstwa eksperymentalnego', () => {
  it('zawiera poziom trudności równy Majętności bazy', () => {
    const entry = mechaniki.find((e) => e.id === 'wytworstwo_eksperymentalne');
    expect(entry?.definition).toContain(
      'poziom trudności wytworzenia takiego przedmiotu jest równy wymaganej Majętności przedmiotu bazowego',
    );
  });
});
