import type { Inconsistency, IndexEntry, MagicItem } from '../models/compendium';
import indexJson from '../../assets/data/index.json';
import magicItemsJson from '../../assets/data/przedmioty_magiczne.json';
import niespojnosciJson from '../../assets/data/niespojnosci.json';

const magicItems = magicItemsJson as unknown as MagicItem[];
const index = indexJson as unknown as IndexEntry[];
const inconsistencies = niespojnosciJson as unknown as Inconsistency[];

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

const BRONZE_BEARD_SOURCE = 'ekwipunek/przedmioty_magiczne/arcymistrzowskie/brązowa_broda.md';
const LIMINAL_SPOOL_SOURCE = 'ekwipunek/przedmioty_magiczne/arcymistrzowskie/cewka_liminalna.md';

describe('przedmioty_magiczne.json — audyt Brązowej Brody i Cewki Liminalnej', () => {
  it('odwzorowuje Brązową Brodę dokładnie tak, jak w źródle', () => {
    expect(magicItem('brązowa_broda')).toEqual({
      id: 'brązowa_broda',
      name: 'Brązowa Broda',
      source: BRONZE_BEARD_SOURCE,
      status: 'detailed',
      type: 'Hełm',
      rarity: 'Arcymistrzowskie',
      modifiers: [
        'Inteligencja +1',
        'Percepcja +1',
        'Charyzma +1',
        'Pancerz +1',
        'Bariera +3',
        'Odporność na Zamrożenie',
        'Odpornośc na Podpalenie',
        'Odpornośc na Porażenie',
        'Max HP +5',
        'Ułatwienie w testach opartych o Percepcję',
      ],
      corrupted: [
        'Utrudnienie do testów przemieszczania (Atletyka, Wspinaczka, Jeździectwo, Prowadzenie) w trakcie walki',
        'Podatnośc na obrażenia od zimna',
      ],
      description:
        'Ciężarem jest posiadanie głowy.\n\nZiarno wielkości zasadzane jest w ciemności, rozrzedzone przez cierpienie, dbane przez desperację i rozkwitające stalowymi płatkami w zwycięstwie.',
    });
  });

  it('zachowuje literówkę "Odpornośc" ze źródła Brązowej Brody', () => {
    const { modifiers } = magicItem('brązowa_broda');

    expect(modifiers).toContain('Odpornośc na Podpalenie');
    expect(modifiers).toContain('Odpornośc na Porażenie');
    expect(modifiers).toContain('Odporność na Zamrożenie');
  });

  it('odwzorowuje Cewkę Liminalną wraz z nową umiejętnością i wzmocnieniami', () => {
    expect(magicItem('cewka_liminalna')).toEqual({
      id: 'cewka_liminalna',
      name: 'Cewka Liminalna',
      source: LIMINAL_SPOOL_SOURCE,
      status: 'detailed',
      type: 'Broń',
      baseItem: 'Kostur',
      rarity: 'Arcymistrzowskie',
      damage: '1k6',
      usage: 'Dwuręczny',
      baseStat: 'Inteligencja',
      specialFeatures: [
        'Magiczny - Stamina zamienia się w Manę pozwalającą na wzmacnianie rzucanych zaklęć.',
        'Kanalizujący - Zwiększa bazowy poziom Many o ilość rozwinięć statystyki Arkana.',
      ],
      newAbility: {
        name: 'Cewkowe Bolcowanie',
        activationTime: 'Akcja',
        range: 'Bezpośredni',
        description:
          'Przeciwnik otrzymuje dwa trafienia zadające 1k8 obrażeń. Pierwsze trafienie zadaje fizyczne obrażenia, drugie obrażenia od chaosu.',
        enhancements: [
          'Zwiększa zasięg do krótkiego - 1 Many',
          'Zwiększa zasięg do średniego - 2 Many',
          'Zwiększa zasięg do długiego - 3 Many',
          'Zwiększa ilość trafień o 2 - 2 Many',
        ],
      },
      modifiers: [
        'Inteligencja +2',
        'Zwiększa zadawane obrażenia o 25% za każdy nałożony na przeciwnika status.',
      ],
      description:
        'Kostur wykonany jest z dwóch kawałków wierzby oplatających się wzajemnie w kształt cewki. Są jak kości, które zamieniły się w gałęzie uginające się pod ciężarem ciemności. Wiją się wokół Nicości, więżąc ją w Całości.',
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const broda = indexEntry('brązowa_broda');
    expect(broda.name).toBe('Brązowa Broda');
    expect(broda.source).toBe(BRONZE_BEARD_SOURCE);

    const cewka = indexEntry('cewka_liminalna');
    expect(cewka.name).toBe('Cewka Liminalna');
    expect(cewka.source).toBe(LIMINAL_SPOOL_SOURCE);
  });

  it('odnotowuje literówkę "Odpornośc" z Brązowej Brody w Niespójnościach', () => {
    const typo = inconsistencies.find((entry) => entry.id === 'brązowa_broda_typo_odpornośc');

    expect(typo).toBeDefined();
    expect(typo?.kind).toBe('typo');
    expect(typo?.source).toBe(BRONZE_BEARD_SOURCE);
    expect(typo?.details).toContain('Odpornośc');
    expect(typo?.evidence).toBe('* Odpornośc na Podpalenie');
    expect(typo?.relatedSources).toContain(BRONZE_BEARD_SOURCE);
    expect(typo?.relatedEntryIds).toEqual(['brązowa_broda']);
  });

  it('pokazuje literówkę "Odpornośc" w indeksie wyszukiwania', () => {
    const indexed = index.find(
      (item) => item.type === 'inconsistency' && item.id === 'brązowa_broda_typo_odpornośc',
    );

    expect(indexed).toBeDefined();
    expect(indexed?.name).toBe("Brązowa Broda: literówka 'Odpornośc'");
    expect(indexed?.source).toBe(BRONZE_BEARD_SOURCE);
  });
});
