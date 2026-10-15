import type { IndexEntry, MagicItem } from '../models/compendium';
import indexJson from '../../assets/data/index.json';
import magicItemsJson from '../../assets/data/przedmioty_magiczne.json';

const magicItems = magicItemsJson as unknown as MagicItem[];
const index = indexJson as unknown as IndexEntry[];

function magicItem(id: string): MagicItem {
  const entry = magicItems.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Brak przedmiotu magicznego o id "${id}" w przedmioty_magiczne.json`);
  }
  return entry;
}

function indexEntry(id: string): IndexEntry {
  const entry = index.find((item) => item.id === id && item.type === 'magicItem');
  if (!entry) {
    throw new Error(`Brak wpisu indeksu "${id}" typu magicItem w index.json`);
  }
  return entry;
}

describe('przedmioty_magiczne.json — nowe przedmioty z 0.1.23', () => {
  it('nie zawiera zduplikowanych identyfikatorów', () => {
    const ids = magicItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('zawiera Czarne Serce Potępienia zgodne ze źródłem', () => {
    const item = magicItem('czarne_serce_potępienia');

    expect(item.name).toBe('Czarne Serce Potępienia');
    expect(item.type).toBe('Pierścień');
    expect(item.rarity).toBe('Arcymistrzowskie');
    expect(item.status).toBe('detailed');
    expect(item.source).toBe(
      'ekwipunek/przedmioty_magiczne/arcymistrzowskie/czarne_serce_potępienia.md',
    );
    expect(item.modifiers).toEqual([
      'Zwiększa zadawane obrażenia od chaosu o 20%',
      'Na początku tury regeneruj 2 HP',
      'Siła Woli +1',
      'Podwaja nakładane poziomy Paniki',
      'Bazowa Energia +1',
      'Odporność na obrażenia elektryczne',
      'Każde 5 nałożonych poziomów powoduje nałożenie 6-tego za darmo!',
    ]);
    expect(item.corrupted).toBeUndefined();
    expect(item.description).toContain('Strach jest bardzo zaraźliwy.');
    expect(item.description).toContain('wirująca, czarna pustka');
  });

  it('zawiera Zadumę Świtu Otulającego Lodowy Grobowiec zgodną ze źródłem', () => {
    const item = magicItem('zaduma_świtu_otulającego_lodowy_grobowiec');

    expect(item.name).toBe('Zaduma Świtu Otulającego Lodowy Grobowiec');
    expect(item.type).toBe('Pancerz');
    expect(item.rarity).toBe('Mityczne');
    expect(item.status).toBe('detailed');
    expect(item.source).toBe(
      'ekwipunek/przedmioty_magiczne/mityczny/zaduma_świtu_otulającego_lodowy_grobowiec.md',
    );
    expect(item.armor).toBe(7);
    expect(item.barrier).toBe(12);
    expect(item.requirements).toBe('Siła 10, Inteligencja 6');
    expect(item.modifiers).toHaveLength(10);
    expect(item.corrupted).toHaveLength(6);
  });

  it('odwzorowuje nową umiejętność "Rytuał odnowy" wraz ze wzmocnieniami', () => {
    const ability = magicItem('zaduma_świtu_otulającego_lodowy_grobowiec').newAbility;

    expect(ability).toBeDefined();
    expect(ability?.name).toBe('Rytuał odnowy');
    expect(ability?.activationTime).toBe('Akcja');
    expect(ability?.range).toBe('Bezpośredni');
    expect(ability?.description).toContain('zwiększający Pancerz o 1');
    expect(ability?.enhancements).toHaveLength(7);
    expect(ability?.enhancements?.[6]).toContain('5 Bariery');
  });

  it('zachowuje polski opis i tłumaczenie z pliku źródłowego', () => {
    const { description } = magicItem('zaduma_świtu_otulającego_lodowy_grobowiec');

    expect(description).toContain('Gdy Pelor zamknie swe płonące oko');
    expect(description).toContain('- Pytonż IV z Altdris');
    expect(description).toContain('Enfolding Dawn');
    expect(description).toContain('When Solaris closes his burning eye');
    expect(description).toContain('- Cirel of Caer Tarth');
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const czarne = indexEntry('czarne_serce_potępienia');
    expect(czarne.name).toBe('Czarne Serce Potępienia');
    expect(czarne.source).toBe(
      'ekwipunek/przedmioty_magiczne/arcymistrzowskie/czarne_serce_potępienia.md',
    );

    const zaduma = indexEntry('zaduma_świtu_otulającego_lodowy_grobowiec');
    expect(zaduma.name).toBe('Zaduma Świtu Otulającego Lodowy Grobowiec');
    expect(zaduma.source).toBe(
      'ekwipunek/przedmioty_magiczne/mityczny/zaduma_świtu_otulającego_lodowy_grobowiec.md',
    );
  });
});
