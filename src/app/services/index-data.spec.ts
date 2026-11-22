import indexJson from '../../assets/data/index.json';
import type { IndexEntry } from '../models/compendium';

const index = indexJson as unknown as IndexEntry[];

describe('index.json — unikalność identyfikatorów', () => {
  it('ma unikalne id', () => {
    const ids = index.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nie zawiera starego id walki', () => {
    expect(index.some((e) => e.id === 'stamina_mana' && e.type === 'combat')).toBe(false);
  });
});
