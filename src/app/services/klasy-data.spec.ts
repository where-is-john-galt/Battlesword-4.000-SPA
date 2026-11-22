import type { CharacterClass, IndexEntry } from '../models/compendium';
import klasyJson from '../../assets/data/klasy.json';
import indexJson from '../../assets/data/index.json';

const klasy = klasyJson as unknown as CharacterClass[];
const index = indexJson as unknown as IndexEntry[];
const SOURCE = 'tworzenie_postaci/klasy/skrytobójca_(nieskończone).md';

describe('klasy.json — zmiana nazwy pliku skrytobójcy', () => {
  it('zachowuje identyfikator i aktualizuje źródło', () => {
    const entry = klasy.find((item) => item.id === 'skrytobójca');
    if (!entry) throw new Error('Brak klasy "skrytobójca" w klasy.json');

    expect(entry.name).toBe('Skrytobójca');
    expect(entry.source).toBe(SOURCE);
  });

  it('aktualizuje źródło w indeksie wyszukiwania', () => {
    const entry = index.find((item) => item.id === 'skrytobójca' && item.type === 'class');
    if (!entry) throw new Error('Brak wpisu indeksu "skrytobójca"');

    expect(entry.source).toBe(SOURCE);
  });
});
