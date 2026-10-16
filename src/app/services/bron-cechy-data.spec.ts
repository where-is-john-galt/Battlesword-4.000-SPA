import type { Inconsistency, Rule, Weapon } from '../models/compendium';
import type { IndexEntry } from '../models/compendium';
import bronJson from '../../assets/data/bron.json';
import mechanikiJson from '../../assets/data/mechaniki.json';
import niespojnosciJson from '../../assets/data/niespojnosci.json';
import indexJson from '../../assets/data/index.json';

const weapons = bronJson as unknown as Weapon[];
const mechanics = mechanikiJson as unknown as Rule[];
const inconsistencies = niespojnosciJson as unknown as Inconsistency[];
const index = indexJson as unknown as IndexEntry[];

function normalize(value: string): string {
  return value
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function findMechanic(name: string): Rule | undefined {
  const target = normalize(name);
  return mechanics.find(
    (entry) => [entry.name, ...(entry.aliases ?? [])].some((form) => normalize(form) === target),
  );
}

describe('bron.json — słowniczek cech specjalnych z ekwipunek/broń.md', () => {
  const features = Array.from(
    new Set(weapons.flatMap((weapon) => weapon.specialFeatures ?? [])),
  ).sort();

  it('wymienia cechy specjalne w danych', () => {
    expect(features).toEqual([
      'Dowodzący',
      'Druzgocący',
      'Głośny',
      'Kanalizujący',
      'Kawalerysjki',
      'Krytyczny',
      'Krótki',
      'Magiczny',
      'Miażdżący',
      'Niebezpieczny',
      'Ogłuszający',
      'Parujący',
      'Przeciwpancerny',
      'Rąbiący',
      'Skrytobójczy',
      'Szybkostrzelny',
      'Wszechtronny',
      'Wyprzedzający',
      'Wysysający',
    ]);
  });

  it('każda cecha z bron.json ma odpowiadające hasło słowniczka', () => {
    for (const feature of features) {
      const mechanic = findMechanic(feature);
      expect(mechanic, `brak hasła dla cechy "${feature}"`).toBeDefined();
      expect(mechanic?.source).toBe('ekwipunek/broń.md');
    }
  });

  it('odwzorowuje słownikowe hasła bez auto-linkowania w tekstach', () => {
    const glossary = mechanics.filter((entry) => entry.source === 'ekwipunek/broń.md');
    expect(glossary).toHaveLength(19);
    for (const entry of glossary) {
      expect(entry.id.startsWith('cecha_')).toBe(true);
      expect(entry.autoLink).toBe(false);
    }
  });

  it('zachowuje literówki źródła w definicjach i aliasach', () => {
    expect(findMechanic('Wszechtronny')?.name).toBe('Wszechstronny');
    expect(findMechanic('Kawalerysjki')?.name).toBe('Kawaleryjski');
    expect(findMechanic('Parujący')?.definition).toContain('automatyczie');
    expect(findMechanic('Ogłuszający')?.definition).toContain('wmocnienie');
    expect(findMechanic('Ogłuszający')?.definition).toContain('odpowiednia');
  });

  it('rejestruje każde hasło słowniczka w indeksie wyszukiwania', () => {
    for (const entry of mechanics.filter((m) => m.source === 'ekwipunek/broń.md')) {
      const indexed = index.find((item) => item.type === 'mechanic' && item.id === entry.id);
      expect(indexed, `brak wpisu indeksu dla "${entry.id}"`).toBeDefined();
      expect(indexed?.name).toBe(entry.name);
    }
  });
});

describe('niespojnosci.json — konflikt rzadkości przedmiotów', () => {
  it('zapisuje rozbieżność między majętność.md a crafting.md', () => {
    const conflict = inconsistencies.find(
      (entry) => entry.id === 'majetnosc_rzadkosc_przedmiotow_konflikt',
    );

    expect(conflict).toBeDefined();
    expect(conflict?.kind).toBe('conflict');
    expect(conflict?.source).toBe('ekwipunek/majętność.md');
    expect(conflict?.relatedSources).toEqual([
      'ekwipunek/majętność.md',
      'mechaniki_bazowe/crafting.md',
    ]);
    expect(conflict?.relatedEntryIds).toContain('rzadkosc_przedmiotow');
    expect(conflict?.details).toContain('kaliber');
    expect(conflict?.details).toContain('bonus');
  });

  it('jest widoczny w indeksie wyszukiwania', () => {
    const indexed = index.find(
      (item) => item.type === 'inconsistency' && item.id === 'majetnosc_rzadkosc_przedmiotow_konflikt',
    );

    expect(indexed).toBeDefined();
    expect(indexed?.source).toBe('ekwipunek/majętność.md');
  });
});
