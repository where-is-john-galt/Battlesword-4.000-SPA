import statsJson from '../../assets/data/statystyki.json';
import type { Stat } from '../models/compendium';

const stats = statsJson as unknown as Stat[];

describe('statystyki.json — źródłowość', () => {
  it('nie zawiera statystyki Bariera bez definicji w źródle', () => {
    expect(stats.find((e) => e.id === 'bariera')).toBeUndefined();
  });

  it('każda statystyka ma źródło i definicję', () => {
    for (const entry of stats) {
      expect(entry.source).toMatch(/\.md$/);
      expect(entry.definition.length).toBeGreaterThan(10);
    }
  });
});
