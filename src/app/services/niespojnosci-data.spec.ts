import niespojnosciJson from '../../assets/data/niespojnosci.json';
import indexJson from '../../assets/data/index.json';
import type { Inconsistency, IndexEntry } from '../models/compendium';

const niespojnosci = niespojnosciJson as unknown as Inconsistency[];
const index = indexJson as unknown as IndexEntry[];

describe('niespojnosci.json — deduplikacja', () => {
  it('nie zawiera duplikatów source+details+evidence', () => {
    const keys = niespojnosci.map((e) => `${e.source}|${e.details}|${e.evidence}`);
    expect(keys.length - new Set(keys).size).toBe(0);
  });

  it('zostawia po jednym wpisie dla znanych grup', () => {
    expect(
      niespojnosci.filter((e) => e.name === 'Morale: niejasny wpływ pojedynczego poziomu Paniki'),
    ).toHaveLength(1);
    expect(niespojnosci.some((e) => e.name.includes("okreslana"))).toBe(false);
  });

  it('nie ma wpisów indeksu bez danych', () => {
    const ids = new Set(niespojnosci.map((e) => e.id));
    expect(index.filter((e) => e.type === 'inconsistency' && !ids.has(e.id))).toEqual([]);
  });

  it('nie ma martwych relatedEntryIds', () => {
    const ids = new Set(index.map((e) => e.id));
    for (const entry of niespojnosci) {
      for (const related of entry.relatedEntryIds) {
        expect(ids.has(related)).toBe(true);
      }
    }
  });

  it('ma 198 wpisów po deduplikacji i korektach', () => {
    expect(niespojnosci).toHaveLength(198);
  });
});
