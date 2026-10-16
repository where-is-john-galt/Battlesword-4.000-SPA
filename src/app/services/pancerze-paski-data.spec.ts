import type { Armor, Belt, Inconsistency, IndexEntry } from '../models/compendium';
import armorJson from '../../assets/data/pancerze.json';
import beltsJson from '../../assets/data/paski.json';
import niespojnosciJson from '../../assets/data/niespojnosci.json';
import indexJson from '../../assets/data/index.json';

const armor = armorJson as unknown as Armor[];
const belts = beltsJson as unknown as Belt[];
const inconsistencies = niespojnosciJson as unknown as Inconsistency[];
const index = indexJson as unknown as IndexEntry[];

const ARMOR_SOURCE = 'ekwipunek/pancerze.md';
const BELT_SOURCE = 'ekwipunek/paski.md';

describe('pancerze.json — audyt ekwipunek/pancerze.md', () => {
  it('nie zawiera zduplikowanych identyfikatorów', () => {
    const ids = armor.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('odwzorowuje wszystkie tabele źródła (25 wpisów, wszystkie detailed)', () => {
    expect(armor).toEqual([
      {
        id: 'prosta_szata',
        name: 'Prosta szata',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 15,
        barrier: 3,
      },
      {
        id: 'szaty_naukowca',
        name: 'Szaty naukowca',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 20,
        barrier: 6,
      },
      {
        id: 'ornat_maga',
        name: 'Ornat maga',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 25,
        barrier: 9,
      },
      {
        id: 'jedwabna_szata',
        name: 'Jedwabna szata',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 30,
        barrier: 12,
      },
      {
        id: 'szaty_mędrca',
        name: 'Szaty mędrca',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 35,
        barrier: 15,
      },
      {
        id: 'ornat_zaklinacza',
        name: 'Ornat zaklinacza',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 40,
        barrier: 18,
      },
      {
        id: 'świetlista_szata',
        name: 'Świetlista szata',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 45,
        barrier: 21,
      },
      {
        id: 'regalia_niszczyciela',
        name: 'Regalia niszczyciela',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 50,
        barrier: 24,
      },
      {
        id: 'szaty_geniusza',
        name: 'Szaty geniusza',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 55,
        barrier: 27,
      },
      {
        id: 'regalia_feniksa',
        name: 'Regalia Feniksa',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 60,
        barrier: 30,
      },
      {
        id: 'tajemny_ornat',
        name: 'Tajemny ornat',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 65,
        barrier: 33,
      },
      {
        id: 'szata_utkana_z_nocy',
        name: 'Szata utkana z nocy',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 70,
        barrier: 36,
      },
      {
        id: 'regalia_zaćmienia',
        name: 'Regalia Zaćmienia',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Szaty magiczne',
        requirements: 'Inteligencja 8',
        requiredWealth: 75,
        barrier: 39,
      },
      {
        id: 'kurtka_pikowana',
        name: 'Kurtka pikowana',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Lekkie',
        requiredWealth: 15,
        armor: 1,
      },
      {
        id: 'skórznia',
        name: 'Skórznia',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Lekkie',
        requiredWealth: 20,
        armor: 2,
      },
      {
        id: 'skórznia_ćwiekowana',
        name: 'Skórznia ćwiekowana',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Lekkie',
        requiredWealth: 25,
        armor: 3,
      },
      {
        id: 'kolczuga',
        name: 'Kolczuga',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Średnie',
        requirements: 'Siła 10',
        requiredWealth: 30,
        armor: 4,
      },
      {
        id: 'zbroja_kolcza',
        name: 'Zbroja kolcza',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Średnie',
        requirements: 'Siła 10',
        requiredWealth: 35,
        armor: 5,
      },
      {
        id: 'zbroja_łuskowa',
        name: 'Zbroja łuskowa',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Średnie',
        requirements: 'Siła 10',
        requiredWealth: 40,
        armor: 6,
      },
      {
        id: 'pancerz_półpłytowy',
        name: 'Pancerz półpłytowy',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Ciężkie',
        requirements: 'Siła 14',
        requiredWealth: 45,
        armor: 7,
      },
      {
        id: 'zbroja_płytowa',
        name: 'Zbroja płytowa',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Ciężkie',
        requirements: 'Siła 14',
        requiredWealth: 50,
        armor: 8,
      },
      {
        id: 'zbroja_adamntytowa',
        name: 'Zbroja adamntytowa',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Ciężkie',
        requirements: 'Siła 14',
        requiredWealth: 55,
        armor: 9,
      },
      {
        id: 'tarcza_drewniana',
        name: 'Tarcza drewniana',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Tarcza',
        requiredWealth: 15,
        armor: 1,
      },
      {
        id: 'tarcza_metalowa',
        name: 'Tarcza metalowa',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Tarcza',
        requiredWealth: 30,
        armor: 2,
      },
      {
        id: 'tarcza_adamntytowa',
        name: 'Tarcza adamntytowa',
        source: ARMOR_SOURCE,
        status: 'detailed',
        category: 'Tarcza',
        requiredWealth: 45,
        armor: 3,
      },
    ]);
  });

  it('nie przypisuje wymagań kategoriom Lekkie i Tarcza, zgodnie ze źródłem', () => {
    for (const entry of armor.filter((a) => a.category === 'Lekkie' || a.category === 'Tarcza')) {
      expect(entry.requirements, `nieoczekiwane wymagania w "${entry.id}"`).toBeUndefined();
    }
  });

  it('zachowuje literówki nazw materiału ze źródła', () => {
    expect(armor.find((a) => a.id === 'zbroja_adamntytowa')?.name).toBe('Zbroja adamntytowa');
    expect(armor.find((a) => a.id === 'tarcza_adamntytowa')?.name).toBe('Tarcza adamntytowa');
  });

  it('rejestruje każdy wpis w indeksie wyszukiwania', () => {
    for (const entry of armor) {
      const indexed = index.find((item) => item.type === 'armor' && item.id === entry.id);
      expect(indexed, `brak wpisu indeksu dla "${entry.id}"`).toBeDefined();
      expect(indexed?.name).toBe(entry.name);
      expect(indexed?.source).toBe(ARMOR_SOURCE);
    }
  });
});

describe('paski.json — audyt ekwipunek/paski.md', () => {
  it('nie zawiera zduplikowanych identyfikatorów', () => {
    const ids = belts.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('odwzorowuje wszystkie kolumny tabeli źródła (8 wpisów, wszystkie detailed)', () => {
    expect(belts).toEqual([
      {
        id: 'pasek',
        name: 'Pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 15,
        handItemSlots: 3,
        effect: 'Brak',
      },
      {
        id: 'szeroki_pasek',
        name: 'Szeroki pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 30,
        handItemSlots: 4,
        effect: 'Brak',
      },
      {
        id: 'długi_pasek',
        name: 'Długi pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 30,
        handItemSlots: 3,
        effect: '+1 bazowej Staminy / Many',
      },
      {
        id: 'kolczy_pasek',
        name: 'Kolczy pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 30,
        handItemSlots: 3,
        effect: '+1 Pancerza',
      },
      {
        id: 'podwójny_pasek',
        name: 'Podwójny pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 45,
        handItemSlots: 5,
        effect: 'Brak',
      },
      {
        id: 'płytowy_pasek',
        name: 'Płytowy pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 45,
        handItemSlots: 4,
        effect: '+1 Pancerza',
      },
      {
        id: 'ornamentalny_pasek',
        name: 'Ornamentalny pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 45,
        handItemSlots: 4,
        effect: '+1 bazowej Staminy / Many',
      },
      {
        id: 'ciężki_pasek',
        name: 'Ciężki pasek',
        source: BELT_SOURCE,
        status: 'detailed',
        requiredWealth: 45,
        handItemSlots: 3,
        effect: '+1 Pancerza, +1 bazowej Staminy / Many',
      },
    ]);
  });

  it('rejestruje każdy wpis w indeksie wyszukiwania', () => {
    for (const entry of belts) {
      const indexed = index.find((item) => item.type === 'belt' && item.id === entry.id);
      expect(indexed, `brak wpisu indeksu dla "${entry.id}"`).toBeDefined();
      expect(indexed?.name).toBe(entry.name);
      expect(indexed?.source).toBe(BELT_SOURCE);
    }
  });
});

describe('niespojnosci.json — literówka "adamntytowa" w ekwipunek/pancerze.md', () => {
  it('zapisuje literówkę materiału w tabelach Ciężkie i Tarcza', () => {
    const typo = inconsistencies.find((entry) => entry.id === 'pancerze_typo_adamntytowa');

    expect(typo).toBeDefined();
    expect(typo?.kind).toBe('typo');
    expect(typo?.source).toBe(ARMOR_SOURCE);
    expect(typo?.details).toContain('adamantyt');
    expect(typo?.evidence).toContain('Zbroja adamntytowa');
    expect(typo?.evidence).toContain('Tarcza adamntytowa');
    expect(typo?.relatedSources).toContain(ARMOR_SOURCE);
    expect(typo?.relatedEntryIds).toEqual(['zbroja_adamntytowa', 'tarcza_adamntytowa']);
    expect(typo?.revision).toBe('0f3239726b687f085593266a088c843f63d032ce');
  });

  it('jest widoczna w indeksie wyszukiwania', () => {
    const indexed = index.find(
      (item) => item.type === 'inconsistency' && item.id === 'pancerze_typo_adamntytowa',
    );

    expect(indexed).toBeDefined();
    expect(indexed?.name).toBe("Pancerze: literówka 'adamntytowa'");
    expect(indexed?.source).toBe(ARMOR_SOURCE);
  });
});
