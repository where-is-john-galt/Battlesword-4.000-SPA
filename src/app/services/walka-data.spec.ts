import type { IndexEntry, Rule } from '../models/compendium';
import indexJson from '../../assets/data/index.json';
import walkaJson from '../../assets/data/walka.json';

const walka = walkaJson as unknown as Rule[];
const index = indexJson as unknown as IndexEntry[];

function combat(id: string): Rule {
  const entry = walka.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Brak wpisu walki o id "${id}" w walka.json`);
  }
  return entry;
}

function indexEntry(id: string): IndexEntry {
  const entry = index.find((item) => item.id === id && item.type === 'combat');
  if (!entry) {
    throw new Error(`Brak wpisu indeksu "${id}" typu combat w index.json`);
  }
  return entry;
}

describe('walka.json — statusy z walka/statusy.md', () => {
  it('nie zawiera zduplikowanych identyfikatorów', () => {
    const ids = walka.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('zawiera status Osłabienie zgodny ze źródłem', () => {
    const entry = combat('osłabienie');

    expect(entry.name).toBe('Osłabienie');
    expect(entry.source).toBe('walka/statusy.md');
    expect(entry.status).toBe('detailed');
    expect(entry.definition).toContain('zmniejszone o połowę');
    expect(entry.definition).toContain('niezależnie od odporności i podatności');
    expect(entry.aliases).toContain('osłabienia');
  });

  it('zawiera status Pąkle zgodny ze źródłem', () => {
    const entry = combat('pąkle');

    expect(entry.name).toBe('Pąkle');
    expect(entry.source).toBe('walka/statusy.md');
    expect(entry.status).toBe('detailed');
    expect(entry.definition).toContain('1k10 obrażeń fizycznych');
    expect(entry.definition).toContain('Sztuki Przetrwania lub Medycyny');
    expect(entry.aliases).toContain('pąkli');
  });

  it('rejestruje oba nowe statusy w indeksie wyszukiwania', () => {
    expect(indexEntry('osłabienie').name).toBe('Osłabienie');
    expect(indexEntry('osłabienie').source).toBe('walka/statusy.md');
    expect(indexEntry('pąkle').name).toBe('Pąkle');
    expect(indexEntry('pąkle').source).toBe('walka/statusy.md');
  });

  it('wymienia nowe statusy w opisach grup statusów', () => {
    expect(combat('statusy_pojedyncze').definition).toContain('Osłabienie');
    expect(combat('statusy_wielokrotne').definition).toContain('Pąkle');
  });

  it('uzupełnia reguły pominięte w opisach istniejących statusów', () => {
    expect(combat('bramy_śmierci').definition).toContain('koniec przygody');
    expect(combat('pochwycenie').definition).toContain('nie może wykonywać akcji ruchu');
    expect(combat('panika').definition).toContain('odporność na zadawane obrażenia');
    expect(combat('podpalenie').definition).toContain('Pokiereszowania');
    expect(combat('pokiereszowanie').definition).toContain('których nie może odzyskiwać');
    expect(combat('zamrożenie').definition).toContain('2k10 HP');
    expect(combat('zmęczenie').definition).toContain('których nie może odzyskiwać');
  });
});

describe('walka.json — wierzchowce z walka/pojazdy_i_wierzchowce.md', () => {
  it('zawiera tabelę wierzchowców z wymaganą Majętnością i Jeździectwem', () => {
    const entry = combat('wierzchowce');

    expect(entry.name).toBe('Wierzchowce');
    expect(entry.source).toBe('walka/pojazdy_i_wierzchowce.md');
    expect(entry.status).toBe('detailed');
    expect(entry.definition).toContain('Koń pociągowy (15/1)');
    expect(entry.definition).toContain('Koń wierzchowy (45/5)');
    expect(entry.definition).toContain('Rumak (60/10)');
    expect(entry.definition).toContain('Pegaz (80/12)');
    expect(entry.definition).toContain('Gryf (100/14)');
  });

  it('rejestruje regułę wierzchowców w indeksie wyszukiwania', () => {
    const entry = indexEntry('wierzchowce');

    expect(entry.name).toBe('Wierzchowce');
    expect(entry.source).toBe('walka/pojazdy_i_wierzchowce.md');
    expect(entry.status).toBe('detailed');
  });
});
