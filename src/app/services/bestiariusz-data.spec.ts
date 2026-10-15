import type { Inconsistency, IndexEntry, Monster, Rule } from '../models/compendium';
import bestiariuszJson from '../../assets/data/bestiariusz.json';
import walkaJson from '../../assets/data/walka.json';
import niespojnosciJson from '../../assets/data/niespojnosci.json';
import indexJson from '../../assets/data/index.json';

const bestiariusz = bestiariuszJson as unknown as Monster[];
const walka = walkaJson as unknown as Rule[];
const niespojnosci = niespojnosciJson as unknown as Inconsistency[];
const index = indexJson as unknown as IndexEntry[];

function monster(id: string): Monster {
  const entry = bestiariusz.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Brak potwora o id "${id}" w bestiariusz.json`);
  }
  return entry;
}

function combat(id: string): Rule {
  const entry = walka.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Brak wpisu walki o id "${id}" w walka.json`);
  }
  return entry;
}

function indexEntry(id: string, type: IndexEntry['type']): IndexEntry {
  const entry = index.find((item) => item.id === id && item.type === type);
  if (!entry) {
    throw new Error(`Brak wpisu indeksu "${id}" typu ${type} w index.json`);
  }
  return entry;
}

describe('bestiariusz.json — zombie z bestiariusz/nieumarli/zombie.md', () => {
  it('nie zawiera zduplikowanych identyfikatorów', () => {
    const ids = bestiariusz.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('odwzorowuje blok statystyk Zombie zgodnie ze źródłem', () => {
    const entry = monster('zombie');

    expect(entry.name).toBe('Zombie');
    expect(entry.source).toBe('bestiariusz/nieumarli/zombie.md');
    expect(entry.status).toBe('detailed');
    expect(entry.tier).toBe('Trep');
    expect(entry.tags).toEqual(['Nieumarły', 'Szkielet']);
    expect(entry.resistances).toEqual(['Chaotyczne']);
    expect(entry.vulnerabilities).toEqual(['Święte']);
    expect(entry.hp).toBe('20');
    expect(entry.armor).toBe('Brak');
  });

  it('zachowuje cechę Nieumarły upór i akcję Atak mieczem', () => {
    const entry = monster('zombie');

    expect(entry.traits).toHaveLength(1);
    expect(entry.traits?.[0].name).toBe('Nieumarły upór');
    expect(entry.traits?.[0].description).toContain('truposza');
    expect(entry.traits?.[0].description).toContain('Dopiero drugi osiąga zamierzony efekt');

    expect(entry.actions).toEqual([
      { name: 'Atak mieczem', range: 'Zwarcie', test: 'Wytrzymałość', effect: '1k6+3 fizycznych' },
    ]);
  });

  it('rejestruje Zombie w indeksie wyszukiwania', () => {
    const entry = indexEntry('zombie', 'monster');
    expect(entry.name).toBe('Zombie');
    expect(entry.source).toBe('bestiariusz/nieumarli/zombie.md');
    expect(entry.status).toBe('detailed');
  });

  it('odnotowuje w Niespójnościach błędny tag Szkielet w źródle Zombie', () => {
    const inconsistency = niespojnosci.find((item) => item.id === 'zombie_tag_szkielet');

    expect(inconsistency).toBeDefined();
    expect(inconsistency?.kind).toBe('conflict');
    expect(inconsistency?.source).toBe('bestiariusz/nieumarli/zombie.md');
    expect(inconsistency?.evidence).toContain('Szkielet');
    expect(inconsistency?.relatedSources).toContain('bestiariusz/nieumarli/szkielet.md');
    expect(inconsistency?.relatedEntryIds).toContain('zombie');
  });
});

describe('bestiariusz.json — zwierzaki z bestiariusz/zwierzaki/*.md', () => {
  it('odwzorowuje blok statystyk Gryfa zgodnie ze źródłem', () => {
    const entry = monster('gryf');

    expect(entry.name).toBe('Gryf');
    expect(entry.source).toBe('bestiariusz/zwierzaki/gryf.md');
    expect(entry.status).toBe('detailed');
    expect(entry.tier).toBe('Elita');
    expect(entry.tags).toEqual(['Zwierzak', 'Wierzchowiec', 'Latający']);
    expect(entry.size).toBe('Duży (2x2)');
    expect(entry.resistances).toEqual(['Fizyczne']);
    expect(entry.vulnerabilities).toEqual(['Ogień']);
    expect(entry.hp).toBe('300');
    expect(entry.armor).toBe('Średni');
  });

  it('zachowuje cechę Władca Pomorza oraz trzy akcje Gryfa', () => {
    const entry = monster('gryf');

    expect(entry.traits).toHaveLength(1);
    expect(entry.traits?.[0].name).toBe('Władca Pomorza');
    expect(entry.traits?.[0].description).toContain('2 sektory na akcję');
    expect(entry.traits?.[0].description).toContain('latać');
    expect(entry.traits?.[0].description).toContain('odporne na Panikę i Pokiereszowanie');

    expect(entry.actions).toEqual([
      {
        name: 'Ugryzienie',
        range: 'Zwarcie',
        test: 'Unik',
        effect: '2k8+6 fizycznych; 1k4 poziomy Krwawienia',
      },
      {
        name: 'Szpony',
        range: 'Zwarcie',
        test: 'Ostrożność',
        effect: '2k8+6 fizycznych; Pochwycenie',
      },
      {
        name: 'Okrutny krzyk',
        range: 'Zwarcie, Cały sektor',
        test: 'Siła Woli',
        effect: '1k6+6 fizycznych; 1k4 poziomy Paniki',
      },
    ]);
  });

  it('odwzorowuje blok statystyk Konika błotnego zgodnie ze źródłem', () => {
    const entry = monster('konik_błotny');

    expect(entry.name).toBe('Konik błotny');
    expect(entry.source).toBe('bestiariusz/zwierzaki/konik_błotny.md');
    expect(entry.status).toBe('detailed');
    expect(entry.tier).toBe('Trep');
    expect(entry.tags).toEqual(['Zwierzak', 'Nieagresywny', 'Wierzchowiec']);
    expect(entry.size).toBe('Duży (2x2)');
    expect(entry.resistances).toEqual(['Zimno']);
    expect(entry.vulnerabilities).toEqual(['Ogień']);
    expect(entry.hp).toBe('45');
    expect(entry.armor).toBe('Lekki');
  });

  it('zachowuje cechę Błotnisty łowca dżdżownic oraz akcje Konika błotnego', () => {
    const entry = monster('konik_błotny');

    expect(entry.traits).toHaveLength(1);
    expect(entry.traits?.[0].name).toBe('Błotnisty łowca dżdżownic');
    expect(entry.traits?.[0].description).toContain('Ignoruje kary za ciężki teren');
    expect(entry.traits?.[0].description).toContain('błotnistych sektorów');
    expect(entry.traits?.[0].description).toContain('prędkośc to 2 sektory na akcję');

    expect(entry.actions).toEqual([
      {
        name: 'Dziobnięcie',
        range: 'Zwarcie',
        test: 'Wytrzymałość (+2)',
        effect: '1k6+3 fizycznych; 1k4 Krwawienia',
      },
      {
        name: 'Wbicie w błoto',
        range: 'Zwarcie',
        test: 'Unik (+2)',
        effect: '1k8+3 fizycznych; Pochwycenie',
      },
    ]);
  });

  it('rejestruje Gryfa i Konika błotnego w indeksie wyszukiwania', () => {
    const gryf = indexEntry('gryf', 'monster');
    expect(gryf.name).toBe('Gryf');
    expect(gryf.source).toBe('bestiariusz/zwierzaki/gryf.md');
    expect(gryf.status).toBe('detailed');

    const konik = indexEntry('konik_błotny', 'monster');
    expect(konik.name).toBe('Konik błotny');
    expect(konik.source).toBe('bestiariusz/zwierzaki/konik_błotny.md');
    expect(konik.status).toBe('detailed');
  });

  it('odnotowuje w Niespójnościach literówkę "prędkośc" ze źródła Konika błotnego', () => {
    const inconsistency = niespojnosci.find((item) => item.id === 'konik_blotny_typo_predkosc');

    expect(inconsistency).toBeDefined();
    expect(inconsistency?.kind).toBe('typo');
    expect(inconsistency?.source).toBe('bestiariusz/zwierzaki/konik_błotny.md');
    expect(inconsistency?.evidence).toContain('prędkośc');
    expect(inconsistency?.relatedEntryIds).toContain('konik_błotny');
  });
});

describe('walka.json — rodzaje oponentów z bestiariusz/rodzaje_oponentów.md', () => {
  it('odwzorowuje wszystkie tiery jako osobne wpisy', () => {
    const tiers: [string, string][] = [
      ['trep', 'Trep'],
      ['elita', 'Elita'],
      ['mistrz', 'Mistrz'],
      ['boss', 'Boss'],
      ['uber_boss', 'Uber boss'],
    ];

    for (const [id, name] of tiers) {
      const entry = combat(id);
      expect(entry.name).toBe(name);
      expect(entry.source).toBe('bestiariusz/rodzaje_oponentów.md');
      expect(entry.status).toBe('detailed');
    }

    expect(combat('trep').definition).toContain('mięso armatnie');
    expect(combat('elita').definition).toContain('wyspecjalizowani w jednej dziedzinie walki');
    expect(combat('mistrz').definition).toContain('szeroką paletą akcji');
    expect(combat('uber_boss').definition).toContain('Finalny przeciwnik całej kampanii');
  });

  it('uzupełnia regułę Bossa o brak własnej, dedykowanej rundy', () => {
    const entry = combat('boss');
    expect(entry.definition).toContain('pomiędzy turami każdego bohatera');
    expect(entry.definition).toContain('nie posiadając własnej, dedykowanej rundy');
  });

  it('odwzorowuje pełne zasady hord, w tym tworzenie ad hoc i rozwiązanie po ataku', () => {
    const entry = combat('horda');

    expect(entry.name).toBe('Horda');
    expect(entry.source).toBe('bestiariusz/rodzaje_oponentów.md');
    expect(entry.definition).toContain('tworzone są ad hoc');
    expect(entry.definition).toContain('Minimalna ilość członków hordy wynosi 3 trepów');
    expect(entry.definition).toContain('modyfikatorem (-2)');
    expect(entry.definition).toContain('o jedną kość za każde 2 członków');
    expect(entry.definition).toContain('horda jest rozwiązywana');
    expect(entry.definition).toContain('ataki przeciwko indywidualnym celom');
  });

  it('wymienia wszystkie role specjalizacji elit', () => {
    const entry = combat('specjalizacje_elit');
    expect(entry.source).toBe('bestiariusz/rodzaje_oponentów.md');
    expect(entry.definition).toContain('zadawanie obrażeń');
    expect(entry.definition).toContain('wytrzymywanie ciosów');
    expect(entry.definition).toContain('leczenie sojuszników');
    expect(entry.definition).toContain('dowodzenie');
    expect(entry.definition).toContain('wspieranie sojuszników');
  });

  it('rejestruje reguły oponentów w indeksie wyszukiwania', () => {
    for (const id of [
      'tiery_oponentów',
      'horda',
      'trep',
      'elita',
      'mistrz',
      'boss',
      'uber_boss',
      'specjalizacje_elit',
    ]) {
      const entry = indexEntry(id, 'combat');
      expect(entry.source).toBe('bestiariusz/rodzaje_oponentów.md');
    }
  });
});
