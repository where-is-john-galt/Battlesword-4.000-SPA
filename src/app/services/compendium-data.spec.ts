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

const SPIRIT_ROBE_SOURCE =
  'ekwipunek/przedmioty_magiczne/arcymistrzowskie/duchowa_szata_gorzkiego_rozkwitu.md';
const DEPTH_HUNTER_SOURCE = 'ekwipunek/przedmioty_magiczne/arcymistrzowskie/łowca_głebin.md';

describe('przedmioty_magiczne.json — audyt Duchowej Szaty i Łowcy Głebin', () => {
  it('odwzorowuje Duchową Szatę Gorzkiego Rozkwitu dokładnie tak, jak w źródle', () => {
    expect(magicItem('duchowa_szata_gorzkiego_rozkwitu')).toEqual({
      id: 'duchowa_szata_gorzkiego_rozkwitu',
      name: 'Duchowa Szata Gorzkiego Rozkwitu',
      source: SPIRIT_ROBE_SOURCE,
      status: 'detailed',
      type: 'Pancerz',
      rarity: 'Arcymistrzowskie',
      barrier: 39,
      requirements: 'Inteligencja 8',
      modifiers: [
        'Inteligencja +1',
        'Spryt +1',
        'Odpornośc na obrażenia chaotyczne',
        '25% Max HP zostaje zamienione na Barierę',
        '25% zwiększona Bariera',
        'Połowa leczenia odnawia Barierę zamiast HP',
        'Flaszki Many regenerują również Barierę',
      ],
      description:
        'Wiara rozkwita mnogo na krawędzi śmierci.\n\nDusza nie może rozkwitać wewątrz wątpiącego umysłu.',
    });
  });

  it('zachowuje literówki "Odpornośc" i "wewątrz" ze źródła Duchowej Szaty', () => {
    const { modifiers, description } = magicItem('duchowa_szata_gorzkiego_rozkwitu');

    expect(modifiers).toContain('Odpornośc na obrażenia chaotyczne');
    expect(description).toContain('wewątrz wątpiącego umysłu');
  });

  it('odwzorowuje Łowcę Głebin bez uzupełniania brakującego opisu', () => {
    expect(magicItem('łowca_głebin')).toEqual({
      id: 'łowca_głebin',
      name: 'Łowca Głebin',
      source: DEPTH_HUNTER_SOURCE,
      status: 'detailed',
      type: 'Broń',
      baseItem: 'Wędka',
      rarity: 'Arcymistrzowskie',
      modifiers: [
        'Łowienie ryb +10',
        'Podwaja szansę na wyłowienie arcymistrzowskiej ryby',
        'Złowione ryby są conajmniej niezwykłe',
      ],
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const robe = indexEntry('duchowa_szata_gorzkiego_rozkwitu');
    expect(robe.name).toBe('Duchowa Szata Gorzkiego Rozkwitu');
    expect(robe.source).toBe(SPIRIT_ROBE_SOURCE);

    const hunter = indexEntry('łowca_głebin');
    expect(hunter.name).toBe('Łowca Głebin');
    expect(hunter.source).toBe(DEPTH_HUNTER_SOURCE);
  });

  it('odnotowuje braki i nietypowy typ obu przedmiotów w Niespójnościach', () => {
    const missingArmor = inconsistencies.find(
      (entry) => entry.id === 'duchowa_szata_gorzkiego_rozkwitu_brak_pancerza',
    );
    expect(missingArmor).toMatchObject({
      kind: 'missing_detail',
      source: SPIRIT_ROBE_SOURCE,
      evidence: '* Typ - Pancerz\n* Bariera - 39',
      relatedEntryIds: ['duchowa_szata_gorzkiego_rozkwitu'],
    });

    const missingDescription = inconsistencies.find(
      (entry) => entry.id === 'łowca_głebin_brak_opisu',
    );
    expect(missingDescription).toMatchObject({
      kind: 'missing_detail',
      source: DEPTH_HUNTER_SOURCE,
      relatedEntryIds: ['łowca_głebin'],
    });

    const rodType = inconsistencies.find((entry) => entry.id === 'łowca_głebin_typ_wedka');
    expect(rodType).toMatchObject({
      kind: 'other',
      source: DEPTH_HUNTER_SOURCE,
      evidence: '* Typ - Wędka',
      relatedEntryIds: ['łowca_głebin'],
    });
    expect(rodType?.relatedSources).toContain('mechaniki_bazowe/crafting.md');
  });

  it('odnotowuje wszystkie literówki z obu źródeł w Niespójnościach i indeksie', () => {
    const typoIds = [
      'duchowa_szata_gorzkiego_rozkwitu_typo_odpornośc',
      'duchowa_szata_gorzkiego_rozkwitu_typo_wewątrz',
      'łowca_głebin_typo_conajmniej',
      'łowca_głebin_typo_nazwa',
    ];

    for (const id of typoIds) {
      const typo = inconsistencies.find((entry) => entry.id === id);
      expect(typo).toBeDefined();
      expect(typo?.kind).toBe('typo');
      expect(typo?.status).toBe('detailed');
      expect(typo?.source).toBe(
        id.startsWith('duchowa_szata') ? SPIRIT_ROBE_SOURCE : DEPTH_HUNTER_SOURCE,
      );

      const indexed = index.find((entry) => entry.type === 'inconsistency' && entry.id === id);
      expect(indexed).toBeDefined();
      expect(indexed?.source).toBe(typo?.source);
      expect(indexed?.name).toBe(typo?.name);
    }

    expect(
      inconsistencies.find(
        (entry) => entry.id === 'duchowa_szata_gorzkiego_rozkwitu_typo_odpornośc',
      )?.evidence,
    ).toBe('* Odpornośc na obrażenia chaotyczne');
    expect(
      inconsistencies.find((entry) => entry.id === 'łowca_głebin_typo_conajmniej')?.evidence,
    ).toBe('* Złowione ryby są conajmniej niezwykłe');
  });
});

const BUTTERFLY_KNIFE_SOURCE =
  'ekwipunek/przedmioty_magiczne/arcymistrzowskie/mocarny_nożyk_motylkowy.md';
const INFLUENTIAL_CLOAK_SOURCE =
  'ekwipunek/przedmioty_magiczne/arcymistrzowskie/peleryna_wpływowego_cienia_tajemnego_mocarza.md';

describe('przedmioty_magiczne.json — audyt Mocarnego Nożyka Motylkowego i Peleryny Wpływowego Cienia', () => {
  it('odwzorowuje Mocarny Nożyk Motylkowy dokładnie tak, jak w źródle', () => {
    expect(magicItem('mocarny_nożyk_motylkowy')).toEqual({
      id: 'mocarny_nożyk_motylkowy',
      name: 'Mocarny Nożyk Motylkowy',
      source: BUTTERFLY_KNIFE_SOURCE,
      status: 'detailed',
      type: 'Broń',
      baseItem: 'Sztylet sprężynowy',
      rarity: 'Potężne',
      damage: '1k4',
      usage: 'Jednoręczna',
      baseStat: 'Zręczność',
      specialFeatures: ['Skrytobójczy, Krótki, Krytyczny'],
      modifiers: [
        'Siła +1',
        'Zręczność +1',
        'Zwiększa obrażenia dodatkowo o 10% za każdy cios krytyczny',
        'Jeśli w ciągu rundy broń zostanie użyta do zadania ciosu, na jej koniec postać zyskuje małe leczenie (25%+1d4)',
      ],
      description:
        'Jestem malarzem, a karmazyn to moja ulubiona farba.\n\nPotężna bestia oznacza potężną ucztę.',
    });
  });

  it('zachowuje zapis leczenia "(25%+1d4)" bez normalizowania go do innej formuły', () => {
    const { modifiers } = magicItem('mocarny_nożyk_motylkowy');

    expect(modifiers).toContain(
      'Jeśli w ciągu rundy broń zostanie użyta do zadania ciosu, na jej koniec postać zyskuje małe leczenie (25%+1d4)',
    );
  });

  it('odwzorowuje Pelerynę Wpływowego Cienia Tajemnego Mocarza dokładnie tak, jak w źródle', () => {
    expect(magicItem('peleryna_wpływowego_cienia_tajemnego_mocarza')).toEqual({
      id: 'peleryna_wpływowego_cienia_tajemnego_mocarza',
      name: 'Peleryna Wpływowego Cienia Tajemnego Mocarza',
      source: INFLUENTIAL_CLOAK_SOURCE,
      status: 'detailed',
      type: 'Peleryna',
      rarity: 'Arcymistrzowskie',
      modifiers: ['Skradanie +6', 'Atletyka +4', 'Przekonywanie +4', 'Arkana +2'],
      description:
        'Uszyty z natłuszczonej skóry bagiennego węża, farbowany korą namorzynów tak, by w mroku i szuwarach zlewał się z otoczeniem. Podszewka kryje dziesiątki potajemnych kieszeni - na kontrabandę, listy polecające i drobne fetysze kupione od zielarzy. Ten, kto go nosi, potrafi zniknąć w tłumie równie łatwo, jak w trzcinach, a jego słowa mają dziwną moc przekonywania. Mówi się, że farbę do tego płaszcza mieszano z odrobiną żywicy nasączonej Eterem.',
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const knife = indexEntry('mocarny_nożyk_motylkowy');
    expect(knife.name).toBe('Mocarny Nożyk Motylkowy');
    expect(knife.source).toBe(BUTTERFLY_KNIFE_SOURCE);

    const cloak = indexEntry('peleryna_wpływowego_cienia_tajemnego_mocarza');
    expect(cloak.name).toBe('Peleryna Wpływowego Cienia Tajemnego Mocarza');
    expect(cloak.source).toBe(INFLUENTIAL_CLOAK_SOURCE);
  });

  it('odnotowuje rozbieżność rzadkości nożyka z folderem i patch notes w Niespójnościach', () => {
    const conflict = inconsistencies.find(
      (entry) => entry.id === 'mocarny_nożyk_motylkowy_rzadkosc_niezgodna_z_folderem',
    );

    expect(conflict).toMatchObject({
      kind: 'conflict',
      source: BUTTERFLY_KNIFE_SOURCE,
      evidence: '* Rzadkość - Potężny',
      relatedEntryIds: ['mocarny_nożyk_motylkowy'],
    });
    expect(conflict?.details).toContain('katalogu arcymistrzowskich');
    expect(conflict?.details).toContain('rzadkość Potężny');
    expect(conflict?.relatedSources).toEqual([BUTTERFLY_KNIFE_SOURCE, 'patch_notes.md']);
  });

  it('pokazuje rozbieżność rzadkości nożyka w indeksie wyszukiwania', () => {
    const indexed = index.find(
      (entry) =>
        entry.type === 'inconsistency' &&
        entry.id === 'mocarny_nożyk_motylkowy_rzadkosc_niezgodna_z_folderem',
    );

    expect(indexed).toBeDefined();
    expect(indexed?.name).toBe(
      'Mocarny Nożyk Motylkowy: rzadkość Potężny mimo folderu Arcymistrzowskie',
    );
    expect(indexed?.source).toBe(BUTTERFLY_KNIFE_SOURCE);
  });
});

const HAZARD_BOOTS_SOURCE =
  'ekwipunek/przedmioty_magiczne/arcymistrzowskie/wrzoścce_hazardowego_biegu.md';
const FORGOTTEN_GUARDIAN_SOURCE =
  'ekwipunek/przedmioty_magiczne/arcymistrzowskie/zapomniany_strażnik.md';

describe('przedmioty_magiczne.json — audyt Wrzoścce Hazardowego Biegu i Zapomnianego Strażnika', () => {
  it('odwzorowuje Wrzoścce Hazardowego Biegu dokładnie tak, jak w źródle', () => {
    expect(magicItem('wrzoścce_hazardowego_biegu')).toEqual({
      id: 'wrzoścce_hazardowego_biegu',
      name: 'Wrzoścce Hazardowego Biegu',
      source: HAZARD_BOOTS_SOURCE,
      status: 'detailed',
      type: 'Buty',
      rarity: 'Arcymistrzowskie',
      modifiers: [
        'Zwiększa ruch do dwóch sektorów w ramach jednej akcji',
        'Max HP +5',
        'Podwaja redukcję wszystkich statusów',
        'Atakujący również otrzymuje 100% zadanych noszącemu obrażeń',
        'Akrobatyka +2',
        'Utrudnienie w testach Szczęścia na koniec sesji',
        'Unik +1',
        'Odporność na fizyczne obrażenia',
        'Każde utracone 5 HP w trakcie walki pozwala na darmowe przesunięcie się o 1 sektor do końca walki',
      ],
      description:
        'Druidzi kroczą po Lesie Altdris bez strachu.\n\nWszystkie twoje jutra są przed tobą, nieznane i splątane aż do ostatniego.',
    });
  });

  it('odwzorowuje Zapomnianego Strażnika bez przenoszenia Bariery z modyfikatorów do statystyk', () => {
    expect(magicItem('zapomniany_strażnik')).toEqual({
      id: 'zapomniany_strażnik',
      name: 'Zapomniany Strażnik',
      source: FORGOTTEN_GUARDIAN_SOURCE,
      status: 'detailed',
      type: 'Pancerz',
      rarity: 'Arcymistrzowskie',
      armor: 9,
      requirements: 'Siła 14',
      modifiers: ['Bariera 39', '+2 do wszystkich statystyk defensywnych'],
      description:
        'Zbroja została wykonana z poskręcanych i nachodzących na siebie gałężi wierzby. Mimo to pancerz jest równie wytrzymały co adamantyt. Dar od Bogini, zagubiony w Ciemności. Brąz nuci. Tkanina wzdycha. Żyjące części niej, pragnące by istnieć.',
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const boots = indexEntry('wrzoścce_hazardowego_biegu');
    expect(boots.name).toBe('Wrzoścce Hazardowego Biegu');
    expect(boots.source).toBe(HAZARD_BOOTS_SOURCE);

    const guardian = indexEntry('zapomniany_strażnik');
    expect(guardian.name).toBe('Zapomniany Strażnik');
    expect(guardian.source).toBe(FORGOTTEN_GUARDIAN_SOURCE);
  });

  it('odnotowuje literówki z obu źródeł w Niespójnościach i indeksie', () => {
    const typoIds = ['wrzoścce_hazardowego_biegu_typo_nazwa', 'zapomniany_strażnik_typo_gałężi'];

    for (const id of typoIds) {
      const typo = inconsistencies.find((entry) => entry.id === id);
      expect(typo).toBeDefined();
      expect(typo?.kind).toBe('typo');
      expect(typo?.status).toBe('detailed');
      expect(typo?.source).toBe(
        id.startsWith('wrzoścce') ? HAZARD_BOOTS_SOURCE : FORGOTTEN_GUARDIAN_SOURCE,
      );

      const indexed = index.find((entry) => entry.type === 'inconsistency' && entry.id === id);
      expect(indexed).toBeDefined();
      expect(indexed?.source).toBe(typo?.source);
      expect(indexed?.name).toBe(typo?.name);
    }

    expect(
      inconsistencies.find((entry) => entry.id === 'zapomniany_strażnik_typo_gałężi')?.evidence,
    ).toBe('Zbroja została wykonana z poskręcanych i nachodzących na siebie gałężi wierzby.');
  });
});
