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

const MAGE_BLOOD_SOURCE = 'ekwipunek/przedmioty_magiczne/boskie/krew_maga.md';
const HEAD_HUNTER_SOURCE = 'ekwipunek/przedmioty_magiczne/boskie/łowca_głów.md';

describe('przedmioty_magiczne.json — audyt Krew Maga i Łowcy Głów', () => {
  it('odwzorowuje Krew Maga dokładnie tak, jak w źródle', () => {
    expect(magicItem('krew_maga')).toEqual({
      id: 'krew_maga',
      name: 'Krew Maga',
      source: MAGE_BLOOD_SOURCE,
      status: 'detailed',
      type: 'Pas',
      rarity: 'Boskie',
      handItemSlots: 3,
      effects: ['+1 Pancerza', '+1 bazowej Staminy / Many'],
      modifiers: [
        'Siła +2',
        'Zręczność +2',
        'Percepcja +2',
        'Uniemożliwia wykorzystywanie przedmiotów podręcznych.',
        'Użytkownik jest stale pod wpływem wyekwipowanych przedmiotów podręcznych. Efekty mikstur energetycznych nakładane są na początku każdej tury. Efekty eliksirów adaptujących trwają aż do ich odekwipowania.',
      ],
      description:
        'Rzeki potęgi płyną poprzez ich żyły. Teraz ta siła jest twoja, na dobre i na złe.\n\nPas wyposażony są jest w igły, podajniki i pompy, które dozują mikstury dożylnie.',
    });
  });

  it('odwzorowuje Łowcę Głów dokładnie tak, jak w źródle', () => {
    expect(magicItem('łowca_głów')).toEqual({
      id: 'łowca_głów',
      name: 'Łowca Głów',
      source: HEAD_HUNTER_SOURCE,
      status: 'detailed',
      type: 'Pas',
      rarity: 'Boskie',
      handItemSlots: 3,
      effects: ['+1 Pancerza', '+1 bazowej Staminy / Many'],
      modifiers: [
        'Siła +3',
        'Zręczność +3',
        'Max HP +5',
        'Zabicie przeciwnika natychmiast zwiększa Staminę lub Manę o jej bazową wartość',
      ],
      description:
        '"Dusza ludzka włada z jaskini kości, uczy się i osądza przez okna urodzone z ciała. Serce to mięso. Człowiek rezyduje w głowie."\n\n~ Armando Lotniski, marszałek Gwardii Imperialnej',
    });
  });

  it('zachowuje dosłowny zapis modyfikatora Łowcy Głów o zabiciu przeciwnika', () => {
    expect(magicItem('łowca_głów').modifiers).toContain(
      'Zabicie przeciwnika natychmiast zwiększa Staminę lub Manę o jej bazową wartość',
    );
  });

  it('normalizuje rzadkość obu pasów do formy "Boskie" używanej w kompendium', () => {
    expect(magicItem('krew_maga').rarity).toBe('Boskie');
    expect(magicItem('łowca_głów').rarity).toBe('Boskie');
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const mageBlood = indexEntry('krew_maga');
    expect(mageBlood.name).toBe('Krew Maga');
    expect(mageBlood.source).toBe(MAGE_BLOOD_SOURCE);

    const headHunter = indexEntry('łowca_głów');
    expect(headHunter.name).toBe('Łowca Głów');
    expect(headHunter.source).toBe(HEAD_HUNTER_SOURCE);
  });

  it('zachowuje odnotowane sprzeczność i literówkę Krew Maga w Niespójnościach i indeksie', () => {
    const ids = ['krew_maga_handItemSlots_sprzecznosc', 'krew_maga_typo_wyposażony_są'];

    for (const id of ids) {
      const inconsistency = inconsistencies.find((entry) => entry.id === id);
      expect(inconsistency).toBeDefined();
      expect(inconsistency?.source).toBe(MAGE_BLOOD_SOURCE);
      expect(inconsistency?.status).toBe('detailed');
      expect(inconsistency?.relatedEntryIds).toEqual(['krew_maga']);

      const indexed = index.find((entry) => entry.type === 'inconsistency' && entry.id === id);
      expect(indexed).toBeDefined();
      expect(indexed?.source).toBe(MAGE_BLOOD_SOURCE);
      expect(indexed?.name).toBe(inconsistency?.name);
    }

    expect(
      inconsistencies.find((entry) => entry.id === 'krew_maga_handItemSlots_sprzecznosc')?.kind,
    ).toBe('conflict');
    expect(
      inconsistencies.find((entry) => entry.id === 'krew_maga_typo_wyposażony_są')?.evidence,
    ).toBe('Pas wyposażony są jest w igły, podajniki i pompy');
  });
});

const FROZEN_GRIP_SOURCE =
  'ekwipunek/przedmioty_magiczne/mityczny/bezczynny_chwyt_północnej_zimy.md';
const DIVINE_WILL_SOURCE = 'ekwipunek/przedmioty_magiczne/mityczny/boska_wola.md';

describe('przedmioty_magiczne.json — audyt Bezczynnego Chwytu Północnej Zimy i Boskiej Woli', () => {
  it('odwzorowuje Bezczynny Chwyt Północnej Zimy dokładnie tak, jak w źródle', () => {
    expect(magicItem('bezczynny_chwyt_północnej_zimy')).toEqual({
      id: 'bezczynny_chwyt_północnej_zimy',
      name: 'Bezczynny Chwyt Północnej Zimy',
      source: FROZEN_GRIP_SOURCE,
      status: 'detailed',
      type: 'Rękawice',
      rarity: 'Mityczne',
      modifiers: [
        'Zręczność +1',
        'Unik +1',
        'Zwinne Dłonie +2',
        'Zadawane obrażenia fizyzne zwiększone są o 2k10%',
        'Zwiększa zadawane obrażenia o 5% za każdy cios krytyczny',
        'Ciosy krytyczne generują o 1 kostkę obrażeń więcje niż zwykle',
        'Zadawane obrażenia od zimna zwiększone są o 2k10%',
        'Odpornośc na obrażenia od zimna',
        'Podwaja nakładane poziomy Zamrożenia',
        'Pozwala na zyskanie dodatkowej akcji kosztem 25% bazowej Energii',
        'Bazowa Energia +1',
      ],
      description:
        'Walcz z zapałem Pradawnych.\n\nPo erupcji, niebo zszarzało i zaczęło spadać, a potem nadszedł mróz...\n\nDiabeł zawsze znajdzie zajęcie dla bezczynnych dłoni.',
    });
  });

  it('odwzorowuje Boską Wolę dokładnie tak, jak w źródle', () => {
    expect(magicItem('boska_wola')).toEqual({
      id: 'boska_wola',
      name: 'Boska Wola',
      source: DIVINE_WILL_SOURCE,
      status: 'detailed',
      type: 'Peleryna',
      rarity: 'Mityczne',
      modifiers: [
        'Skradanie +4',
        'Wytrzymałość +2',
        'Pancerz +3',
        'Zastraszanie +4',
        'Ostrożność +1',
        'Jeździectwo +4',
      ],
      corrupted: [
        'Akcja: Odepchnięcie wszystkich przeciwników do sąsiednich sektrorów',
        'Każde użycie spaczonego modyfikatora powoduje zyskanie 1k4 poziomów Krwawienia',
      ],
      description:
        'Śmierć będzie twym kompasem.\n\nDzierż boską wolę jako swą pochodnię, nią niszcz cienie.\n\nMały umysł łatwo wypełnić wiarą.',
    });
  });

  it('zachowuje literówki obu źródeł bez ich poprawiania', () => {
    const frozenGrip = magicItem('bezczynny_chwyt_północnej_zimy');
    expect(frozenGrip.modifiers).toContain('Zadawane obrażenia fizyzne zwiększone są o 2k10%');
    expect(frozenGrip.modifiers).toContain(
      'Ciosy krytyczne generują o 1 kostkę obrażeń więcje niż zwykle',
    );
    expect(frozenGrip.modifiers).toContain('Odpornośc na obrażenia od zimna');

    expect(magicItem('boska_wola').corrupted).toContain(
      'Akcja: Odepchnięcie wszystkich przeciwników do sąsiednich sektrorów',
    );
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const frozenGrip = indexEntry('bezczynny_chwyt_północnej_zimy');
    expect(frozenGrip.name).toBe('Bezczynny Chwyt Północnej Zimy');
    expect(frozenGrip.source).toBe(FROZEN_GRIP_SOURCE);

    const divineWill = indexEntry('boska_wola');
    expect(divineWill.name).toBe('Boska Wola');
    expect(divineWill.source).toBe(DIVINE_WILL_SOURCE);
  });

  it('odnotowuje odwołanie do Energii oraz wszystkie literówki z obu źródeł', () => {
    const ambiguity = inconsistencies.find(
      (entry) => entry.id === 'bezczynny_chwyt_północnej_zimy_energia',
    );
    expect(ambiguity).toMatchObject({
      kind: 'ambiguity',
      source: FROZEN_GRIP_SOURCE,
      evidence: '* Pozwala na zyskanie dodatkowej akcji kosztem 25% bazowej Energii',
      relatedEntryIds: ['bezczynny_chwyt_północnej_zimy'],
    });

    const typoIds = [
      'bezczynny_chwyt_północnej_zimy_typo_fizyzne',
      'bezczynny_chwyt_północnej_zimy_typo_więcje',
      'bezczynny_chwyt_północnej_zimy_typo_odpornośc',
      'boska_wola_typo_sektrorów',
    ];

    for (const id of typoIds) {
      const typo = inconsistencies.find((entry) => entry.id === id);
      expect(typo).toBeDefined();
      expect(typo?.kind).toBe('typo');
      expect(typo?.status).toBe('detailed');
      expect(typo?.source).toBe(
        id.startsWith('boska_wola') ? DIVINE_WILL_SOURCE : FROZEN_GRIP_SOURCE,
      );
      expect(typo?.revision).not.toBe('');

      const indexed = index.find((entry) => entry.type === 'inconsistency' && entry.id === id);
      expect(indexed).toBeDefined();
      expect(indexed?.source).toBe(typo?.source);
      expect(indexed?.name).toBe(typo?.name);
    }

    expect(
      inconsistencies.find((entry) => entry.id === 'bezczynny_chwyt_północnej_zimy_typo_odpornośc'),
    ).toMatchObject({
      evidence: '* Odpornośc na obrażenia od zimna',
      relatedEntryIds: ['bezczynny_chwyt_północnej_zimy'],
    });
    expect(
      inconsistencies.find((entry) => entry.id === 'boska_wola_typo_sektrorów')?.evidence,
    ).toBe('* Akcja: Odepchnięcie wszystkich przeciwników do sąsiednich sektrorów');
  });
});

const DRAGON_CROWN_SOURCE = 'ekwipunek/przedmioty_magiczne/mityczny/korona_ze_smoczych_zębów.md';
const DRAGON_GREAVES_SOURCE =
  'ekwipunek/przedmioty_magiczne/mityczny/nagolenniki_ze_smoczych_kości.md';

describe('przedmioty_magiczne.json — audyt Korony ze Smoczych Zębów i Nagolenników ze Smoczych Kości', () => {
  it('odwzorowuje Koronę ze Smoczych Zębów dokładnie tak, jak w źródle', () => {
    expect(magicItem('korona_ze_smoczych_zębów')).toEqual({
      id: 'korona_ze_smoczych_zębów',
      name: 'Korona ze Smoczych Zębów',
      source: DRAGON_CROWN_SOURCE,
      status: 'detailed',
      type: 'Hełm',
      rarity: 'Mityczne',
      modifiers: ['Inteligencja +2', 'Bazowa Mana +3'],
      description:
        'Korona wykonana jest z zielonej smoczej łuski, która przyczepiona jest do stelażu ze smoczych zębów. W stalażu oprawiono również dodatkowo elegancko rubiny.',
    });
  });

  it('odwzorowuje Nagolenniki ze Smoczych Kości dokładnie tak, jak w źródle', () => {
    expect(magicItem('nagolenniki_ze_smoczych_kości')).toEqual({
      id: 'nagolenniki_ze_smoczych_kości',
      name: 'Nagolenniki ze Smoczych Kości',
      source: DRAGON_GREAVES_SOURCE,
      status: 'detailed',
      type: 'Buty',
      rarity: 'Mityczne',
      modifiers: [
        'Zwiększa szybkość przemieszczania się do 2 sektorów w ramach jednej akcji',
        'Bazowa Mana +3',
      ],
      description:
        'Skórzane buty z wysokimi cholewami zostały wmocnione grubymi, smoczymi kościami, chroniąc golenie użytkownika. Buty są niezwykle wytrzymałe i lekkie, umożliwiając szybkie przemieszczenie oraz czerpanie energii z ziemi.',
    });
  });

  it('zachowuje literówki obu źródeł bez ich poprawiania', () => {
    expect(magicItem('korona_ze_smoczych_zębów').description).toContain('W stalażu oprawiono');
    expect(magicItem('nagolenniki_ze_smoczych_kości').description).toContain(
      'zostały wmocnione grubymi, smoczymi kościami',
    );
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const crown = indexEntry('korona_ze_smoczych_zębów');
    expect(crown.name).toBe('Korona ze Smoczych Zębów');
    expect(crown.source).toBe(DRAGON_CROWN_SOURCE);
    expect(crown.status).toBe('detailed');

    const greaves = indexEntry('nagolenniki_ze_smoczych_kości');
    expect(greaves.name).toBe('Nagolenniki ze Smoczych Kości');
    expect(greaves.source).toBe(DRAGON_GREAVES_SOURCE);
    expect(greaves.status).toBe('detailed');
  });

  it('odnotowuje adnotacje o braku identyfikacji oraz literówki w Niespójnościach i indeksie', () => {
    const expected = [
      {
        id: 'korona_ze_smoczych_zębów_niezidentyfikowana',
        kind: 'missing_detail',
        source: DRAGON_CROWN_SOURCE,
        evidence: '**Niezidentyfikowana**',
        relatedEntryIds: ['korona_ze_smoczych_zębów'],
      },
      {
        id: 'korona_ze_smoczych_zębów_typo_stelażu',
        kind: 'typo',
        source: DRAGON_CROWN_SOURCE,
        evidence: 'W stalażu oprawiono również dodatkowo elegancko rubiny.',
        relatedEntryIds: ['korona_ze_smoczych_zębów'],
      },
      {
        id: 'nagolenniki_ze_smoczych_kości_niezidentyfikowane',
        kind: 'missing_detail',
        source: DRAGON_GREAVES_SOURCE,
        evidence: '**Niezidentyfikowane**',
        relatedEntryIds: ['nagolenniki_ze_smoczych_kości'],
      },
      {
        id: 'nagolenniki_ze_smoczych_kości_typo_wmocnione',
        kind: 'typo',
        source: DRAGON_GREAVES_SOURCE,
        evidence: 'zostały wmocnione grubymi, smoczymi kościami',
        relatedEntryIds: ['nagolenniki_ze_smoczych_kości'],
      },
    ];

    for (const expectedEntry of expected) {
      const inconsistency = inconsistencies.find((entry) => entry.id === expectedEntry.id);
      expect(inconsistency).toMatchObject(expectedEntry);
      expect(inconsistency?.status).toBe('detailed');
      expect(inconsistency?.revision).not.toBe('');

      const indexed = index.find(
        (entry) => entry.type === 'inconsistency' && entry.id === expectedEntry.id,
      );
      expect(indexed).toBeDefined();
      expect(indexed?.source).toBe(expectedEntry.source);
      expect(indexed?.name).toBe(inconsistency?.name);
    }
  });
});

const ALARMING_CLOAK_SOURCE = 'ekwipunek/przedmioty_magiczne/niezwykłe/alarmująca_peleryna.md';
const OATHBOUND_DOOR_SOURCE =
  'ekwipunek/przedmioty_magiczne/mityczny/zaprzysiężona_framuga_dębowego_oporu.md';

describe('przedmioty_magiczne.json — audyt Zaprzysiężonej Framugi Dębowego Oporu i Alarmującej Peleryny', () => {
  it('odwzorowuje Alarmującą Pelerynę dokładnie tak, jak w źródle', () => {
    expect(magicItem('alarmująca_peleryna')).toEqual({
      id: 'alarmująca_peleryna',
      name: 'Alarmująca Peleryna',
      source: ALARMING_CLOAK_SOURCE,
      status: 'detailed',
      type: 'Peleryna',
      rarity: 'Niezwykłe',
      modifiers: ['+1 do Ostrożności'],
      description:
        'Peleryna jest dosyć prostą tkaniną dostępną w różnych, podstawowych kolorach. Rzemieślnicy z Po-Singaru rzucili na nią urok sprawiający, że peleryna łopocze samoczynnie w momencie, w którym wykryje zbliżające się zagrożenie.',
    });
  });

  it('odwzorowuje Zaprzysiężoną Framugę Dębowego Oporu dokładnie tak, jak w źródle', () => {
    expect(magicItem('zaprzysiężona_framuga_dębowego_oporu')).toEqual({
      id: 'zaprzysiężona_framuga_dębowego_oporu',
      name: 'Zaprzysiężona Framuga Dębowego Oporu',
      source: OATHBOUND_DOOR_SOURCE,
      status: 'detailed',
      type: 'Tarcza',
      rarity: 'Mityczne',
      armor: 1,
      barrier: 6,
      modifiers: [
        'Siła +1',
        'Inteligencja +1',
        'Percepcja +1',
        'Każdy udany test defensywny generuje 1k4 Energii',
        'Podnosi rangę odbieranego leczenia o 1',
        'Odporność na obrażenia od chaosu',
        'Odporność na obrażenia żrące',
        'Odpornosć na obrażenia święte',
      ],
      corrupted: [
        'Utrudnienie w testach defensywnych',
        'Rozwinięcia statystyk defensywnych wliczają się do Pancerza zamiast do statystyk defensywnych',
      ],
      description:
        'Oby twój upór nigdy się nie ugiął.\n\nDruidzi przyrzekli, że będą bronili Lasu Altdris swoimi własnymi życiami.\n\nSzybki umysł rozwiązuje problemy zanim się pojawią.',
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const cloak = indexEntry('alarmująca_peleryna');
    expect(cloak.name).toBe('Alarmująca Peleryna');
    expect(cloak.source).toBe(ALARMING_CLOAK_SOURCE);

    const door = indexEntry('zaprzysiężona_framuga_dębowego_oporu');
    expect(door.name).toBe('Zaprzysiężona Framuga Dębowego Oporu');
    expect(door.source).toBe(OATHBOUND_DOOR_SOURCE);
  });

  it('odnotowuje odwołanie do Energii oraz literówkę "Odpornosć" Framugi', () => {
    const ambiguity = inconsistencies.find((entry) => entry.id === 'zaprzysiężona_framuga_energia');
    expect(ambiguity).toMatchObject({
      kind: 'ambiguity',
      source: OATHBOUND_DOOR_SOURCE,
      evidence: '* Każdy udany test defensywny generuje 1k4 Energii',
      relatedEntryIds: ['zaprzysiężona_framuga_dębowego_oporu'],
    });

    const typo = inconsistencies.find(
      (entry) => entry.id === 'zaprzysiężona_framuga_typo_odpornosć',
    );
    expect(typo).toMatchObject({
      kind: 'typo',
      source: OATHBOUND_DOOR_SOURCE,
      evidence: '* Odpornosć na obrażenia święte',
      relatedEntryIds: ['zaprzysiężona_framuga_dębowego_oporu'],
    });

    for (const id of ['zaprzysiężona_framuga_energia', 'zaprzysiężona_framuga_typo_odpornosć']) {
      const indexed = index.find((entry) => entry.type === 'inconsistency' && entry.id === id);
      expect(indexed).toBeDefined();
      expect(indexed?.source).toBe(OATHBOUND_DOOR_SOURCE);
    }
  });

  it('nie zgłasza nieistniejącej literówki "samoczynnie" w Alarmującej Pelerynie', () => {
    expect(magicItem('alarmująca_peleryna').description).toContain('łopocze samoczynnie');

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('alarmująca_peleryna'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === ALARMING_CLOAK_SOURCE,
      ),
    ).toEqual([]);
  });
});

const GOOD_OMEN_AMULET_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/amulet_alertu_dobrej_okazji.md';
const SAINT_CHRISTOPHER_AMULET_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/amulet_św_krzysztofa.md';

describe('przedmioty_magiczne.json — audyt Amuletu Alertu Dobrej Okazji i Amuletu Św. Krzysztofa', () => {
  it('odwzorowuje Amulet Alertu Dobrej Okazji dokładnie tak, jak w źródle', () => {
    expect(magicItem('amulet_alertu_dobrej_okazji')).toEqual({
      id: 'amulet_alertu_dobrej_okazji',
      name: 'Amulet Alertu Dobrej Okazji',
      source: GOOD_OMEN_AMULET_SOURCE,
      status: 'detailed',
      type: 'Amulet',
      rarity: 'Niezwykłe',
      modifiers: ['+2 do Znajdowania'],
      description:
        'Amulet to dosyć prosty wisiorek z wykonanym ze złota wykrzyknikiem jako wisiorkiem. Amulet podskakuje frenetycznie, alarmując uzytkownika o dobrych okazjach w okolicy.',
    });
  });

  it('odwzorowuje Amulet Św. Krzysztofa dokładnie tak, jak w źródle', () => {
    expect(magicItem('amulet_św_krzysztofa')).toEqual({
      id: 'amulet_św_krzysztofa',
      name: 'Amulet Św. Krzysztofa',
      source: SAINT_CHRISTOPHER_AMULET_SOURCE,
      status: 'detailed',
      type: 'Amulet',
      rarity: 'Niezwykłe',
      modifiers: ['+2 do Prowadzenia'],
      description:
        'Wisiorek poświęcony jest świętemu Krzysztofowi, patronowi kierowców. Oby miał w opiece właściciela tego amuletu, gdy ten chwyci za lejce lub stery czegokolwiek...',
    });
  });

  it('rejestruje oba amulety w indeksie wyszukiwania', () => {
    const goodOmen = indexEntry('amulet_alertu_dobrej_okazji');
    expect(goodOmen.name).toBe('Amulet Alertu Dobrej Okazji');
    expect(goodOmen.source).toBe(GOOD_OMEN_AMULET_SOURCE);

    const saintChristopher = indexEntry('amulet_św_krzysztofa');
    expect(saintChristopher.name).toBe('Amulet Św. Krzysztofa');
    expect(saintChristopher.source).toBe(SAINT_CHRISTOPHER_AMULET_SOURCE);
  });

  it('odnotowuje literówkę "uzytkownika" w Amulecie Alertu Dobrej Okazji', () => {
    const typo = inconsistencies.find(
      (entry) => entry.id === 'amulet_alertu_dobrej_okazji_typo_uzytkownika',
    );

    expect(typo).toMatchObject({
      kind: 'typo',
      source: GOOD_OMEN_AMULET_SOURCE,
      evidence: 'alarmując uzytkownika o dobrych okazjach w okolicy',
      relatedEntryIds: ['amulet_alertu_dobrej_okazji'],
    });
    expect(typo?.status).toBe('detailed');
    expect(typo?.revision).not.toBe('');

    const indexed = index.find(
      (entry) =>
        entry.type === 'inconsistency' &&
        entry.id === 'amulet_alertu_dobrej_okazji_typo_uzytkownika',
    );
    expect(indexed).toBeDefined();
    expect(indexed?.source).toBe(GOOD_OMEN_AMULET_SOURCE);
    expect(indexed?.name).toBe(typo?.name);
  });

  it('nie zgłasza nieistniejącej literówki "lejce" w Amulecie Św. Krzysztofa', () => {
    expect(magicItem('amulet_św_krzysztofa').description).toContain('chwyci za lejce');

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('amulet_św_krzysztofa'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) =>
          entry.type === 'inconsistency' && entry.source === SAINT_CHRISTOPHER_AMULET_SOURCE,
      ),
    ).toEqual([]);
  });
});

const CRYSTALLIZED_EYE_AMULET_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/amulet_zastygłego_oka.md';
const SMITH_BOOTS_SOURCE = 'ekwipunek/przedmioty_magiczne/niezwykłe/buty_kowala.md';

describe('przedmioty_magiczne.json — audyt Amuletu Zastygłego Oka i Butów Kowala', () => {
  it('odwzorowuje Amulet Zastygłego Oka dokładnie tak, jak w źródle', () => {
    expect(magicItem('amulet_zastygłego_oka')).toEqual({
      id: 'amulet_zastygłego_oka',
      name: 'Amulet Zastygłego Oka',
      source: CRYSTALLIZED_EYE_AMULET_SOURCE,
      status: 'detailed',
      type: 'Amulet',
      rarity: 'Niezwykłe',
      modifiers: ['+1 do Percepcji'],
      corrupted: [
        'Pozwala na przerzucenie dowolnego testu opartego o Percepcję.',
        'Użytkownik traci 1 punkt Szczęścia.',
      ],
      description:
        'Amulet to dosyć prosty wisiorek z oprawionym w złotą ramkę zastygłym okiem tajemniczej bestii. Trzecie oko zawsze się przyda, prawda?',
    });
  });

  it('odwzorowuje Buty Kowala dokładnie tak, jak w źródle', () => {
    expect(magicItem('buty_kowala')).toEqual({
      id: 'buty_kowala',
      name: 'Buty Kowala',
      source: SMITH_BOOTS_SOURCE,
      status: 'detailed',
      type: 'Buty',
      rarity: 'Niezwykłe',
      modifiers: ['Kowalstwo +2'],
      description:
        'Buty pozwalają lepiej sie zaprzeć przy machaniu młotem w celu wykucia tego zajebistego miecza lub tej zajebistej zbroi.',
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const amulet = indexEntry('amulet_zastygłego_oka');
    expect(amulet.name).toBe('Amulet Zastygłego Oka');
    expect(amulet.source).toBe(CRYSTALLIZED_EYE_AMULET_SOURCE);

    const boots = indexEntry('buty_kowala');
    expect(boots.name).toBe('Buty Kowala');
    expect(boots.source).toBe(SMITH_BOOTS_SOURCE);
  });

  it('nie zgłasza nieistniejącej literówki "zastygłym" w Amulecie Zastygłego Oka', () => {
    expect(magicItem('amulet_zastygłego_oka').description).toContain(
      'z oprawionym w złotą ramkę zastygłym okiem',
    );

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('amulet_zastygłego_oka'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) =>
          entry.type === 'inconsistency' && entry.source === CRYSTALLIZED_EYE_AMULET_SOURCE,
      ),
    ).toEqual([]);
  });

  it('odnotowuje literówkę "sie" w Butach Kowala', () => {
    const typo = inconsistencies.find((entry) => entry.id === 'buty_kowala_typo_sie');

    expect(typo).toMatchObject({
      kind: 'typo',
      source: SMITH_BOOTS_SOURCE,
      evidence: 'Buty pozwalają lepiej sie zaprzeć',
      relatedEntryIds: ['buty_kowala'],
    });
    expect(typo?.status).toBe('detailed');
    expect(typo?.revision).not.toBe('');

    const indexed = index.find(
      (entry) => entry.type === 'inconsistency' && entry.id === 'buty_kowala_typo_sie',
    );
    expect(indexed).toBeDefined();
    expect(indexed?.source).toBe(SMITH_BOOTS_SOURCE);
    expect(indexed?.name).toBe(typo?.name);
  });
});

const HEALER_BOOTS_SOURCE = 'ekwipunek/przedmioty_magiczne/niezwykłe/buty_uzdrowiciela.md';
const ENDLESS_WANDERER_BOOTS_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/buty_wędrowca_bez_kresu.md';

describe('przedmioty_magiczne.json — audyt Butów Uzdrowiciela i Butów Wędrowca Bez Kresu', () => {
  it('odwzorowuje Buty Uzdrowiciela dokładnie tak, jak w źródle', () => {
    expect(magicItem('buty_uzdrowiciela')).toEqual({
      id: 'buty_uzdrowiciela',
      name: 'Buty Uzdrowiciela',
      source: HEALER_BOOTS_SOURCE,
      status: 'detailed',
      type: 'Buty',
      rarity: 'Niezwykłe',
      modifiers: ['Medycyna +2'],
      description:
        'Niskie skórzane buty z miękkiej bielonej skóry, wzmocnione pasami ciemnozielonego rzemienia wokół kostki i podbicia. Ich powierzchnia pokryta jest delikatnym tłoczeniem przedstawiającym wijące się łodygi ziół: krwawnika, szałwii i księżycowego mchu. Szwy wykonano srebrzystą nicią, która subtelnie połyskuje w świetle świecy niczym wilgoć o poranku.\n\nPodeszwa jest niezwykle lekka i niemal bezszelestna, pozwalając na poruszanie się szybko po leśnym poszyciu, kamieniu czy drewnianej podłodze bez wzbudzania hałasu. Wewnętrzna wyściółka pachnie suszonymi ziołami, alkoholem leczniczym i świeżą miętą.\n\nLegenda głosi, że pierwszą parę uszył medyk, który przemierzał tereny objęte zarazą, odwiedzając każdą chatę, do której inni bali się wejść. Nigdy nie przybywał za późno.',
    });
  });

  it('odwzorowuje Buty Wędrowca Bez Kresu dokładnie tak, jak w źródle', () => {
    expect(magicItem('buty_wędrowca_bez_kresu')).toEqual({
      id: 'buty_wędrowca_bez_kresu',
      name: 'Buty Wędrowca Bez Kresu',
      source: ENDLESS_WANDERER_BOOTS_SOURCE,
      status: 'detailed',
      type: 'Buty',
      rarity: 'Niezwykłe',
      modifiers: ['Bazowa Stamina / Mana +1'],
      description:
        'Para wysokich, solidnych butów wykonanych z ciemnobrązowej skóry o matowym wykończeniu, wzmocnionej przy piętach i noskach stalowoszarą okładziną. Skóra jest miękka, ale niemal niezniszczalna. Buty nie nasiąkają wodą, nie pękają od mrozu i nie parzą stóp w upale.\n\nPodeszwy utkano z mieszaniny garbowanej skóry, żywicy i pyłu z pradawnych kamiennych traktów. Pozostawiają ledwo widoczne ślady, które znikają po kilku oddechach. Sznurowadła wyglądają jak splecione z końskiego włosia i srebrnej nici, a przy każdym kroku wydają cichy dźwięk przypominający szelest suchej trawy poruszanej wiatrem.\n\nWedług starych opowieści należały do posłańca, który przebiegł całe pogranicze Imperium bez postoju, niosąc wieść o końcu wojny. Gdy dotarł do celu, podobno nie był nawet zadyszany.',
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const healerBoots = indexEntry('buty_uzdrowiciela');
    expect(healerBoots.name).toBe('Buty Uzdrowiciela');
    expect(healerBoots.source).toBe(HEALER_BOOTS_SOURCE);

    const wandererBoots = indexEntry('buty_wędrowca_bez_kresu');
    expect(wandererBoots.name).toBe('Buty Wędrowca Bez Kresu');
    expect(wandererBoots.source).toBe(ENDLESS_WANDERER_BOOTS_SOURCE);
  });

  it('nie zgłasza nieistniejącej literówki "księżycowego" w Butach Uzdrowiciela', () => {
    expect(magicItem('buty_uzdrowiciela').description).toContain('księżycowego mchu');

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('buty_uzdrowiciela'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === HEALER_BOOTS_SOURCE,
      ),
    ).toEqual([]);
  });

  it('nie zgłasza nieistniejącej literówki "nasiąkają" w Butach Wędrowca Bez Kresu', () => {
    expect(magicItem('buty_wędrowca_bez_kresu').description).toContain('nie nasiąkają wodą');

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('buty_wędrowca_bez_kresu'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === ENDLESS_WANDERER_BOOTS_SOURCE,
      ),
    ).toEqual([]);
  });
});

const TOWER_GUARD_HELM_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/hełm_strażnika_baszty.md';
const STAFF_OF_ENLIGHTENMENT_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/kostur_oświecenia.md';

describe('przedmioty_magiczne.json — audyt Hełmu Strażnika Baszty i Kostura Oświecenia', () => {
  it('odwzorowuje Hełm Strażnika Baszty dokładnie tak, jak w źródle', () => {
    expect(magicItem('hełm_strażnika_baszty')).toEqual({
      id: 'hełm_strażnika_baszty',
      name: 'Hełm Strażnika Baszty',
      source: TOWER_GUARD_HELM_SOURCE,
      status: 'detailed',
      type: 'Hełm',
      rarity: 'Niezwykłe',
      modifiers: ['Wytrzymałość +1'],
      description:
        'Ten ciężki hełm wykonano z ciemnej stali przesyconej pyłem bazaltowym. Na jego powierzchni wyryto motywy murów obronnych i blanków, a przez środek przyłbicy biegnie wąska srebrna linia przypominająca pęknięcie skały. Według legend pierwsze egzemplarze nosili strażnicy twierdz, którzy potrafili wytrwać na posterunku przez wiele dni podczas oblężeń.\n\nWnętrze hełmu wyściełane jest miękką skórą, która nigdy nie nasiąka potem ani wodą. Gdy jego właściciel staje w obronie siebie lub swoich towarzyszy, metal staje się wyraźnie cięższy i chłodniejszy w dotyku, jakby czerpał siłę z fundamentów samej ziemi.',
    });
  });

  it('odwzorowuje Kostur Oświecenia dokładnie tak, jak w źródle', () => {
    expect(magicItem('kostur_oświecenia')).toEqual({
      id: 'kostur_oświecenia',
      name: 'Kostur Oświecenia',
      source: STAFF_OF_ENLIGHTENMENT_SOURCE,
      status: 'detailed',
      type: 'Broń',
      baseItem: 'Kostur',
      rarity: 'Niezwykłe',
      modifiers: ['+1 do Inteligencji'],
      description:
        'Kostur wykonany jest z prostego kawałka drewna i opatrzony mistycznymi symbolami. Chwycenie jej pewnie w dłoniach i kanalizowanie przez nią energii magicznej nie tylko pozwala na lepszą kontrolę nad eterycznymi przepływami, ale również oczyszcza umysł, wzmacniając skupienie, koncentrację i ułatwiając myślenie nawet w ogniu walki.',
    });
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const helm = indexEntry('hełm_strażnika_baszty');
    expect(helm.name).toBe('Hełm Strażnika Baszty');
    expect(helm.source).toBe(TOWER_GUARD_HELM_SOURCE);

    const staff = indexEntry('kostur_oświecenia');
    expect(staff.name).toBe('Kostur Oświecenia');
    expect(staff.source).toBe(STAFF_OF_ENLIGHTENMENT_SOURCE);
  });

  it('nie zgłasza nieistniejącej literówki "oblężeń" w Hełmie Strażnika Baszty', () => {
    expect(magicItem('hełm_strażnika_baszty').description).toContain(
      'przez wiele dni podczas oblężeń',
    );

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('hełm_strażnika_baszty'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === TOWER_GUARD_HELM_SOURCE,
      ),
    ).toEqual([]);
  });

  it('nie zgłasza nieistniejącej literówki "kanalizowanie" w Kosturze Oświecenia', () => {
    expect(magicItem('kostur_oświecenia').description).toContain(
      'kanalizowanie przez nią energii magicznej',
    );

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('kostur_oświecenia'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === STAFF_OF_ENLIGHTENMENT_SOURCE,
      ),
    ).toEqual([]);
  });
});

const CIRCUS_BELT_SOURCE = 'ekwipunek/przedmioty_magiczne/niezwykłe/pas_cyrkowca.md';
const POWERLIFTING_BELT_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/pas_powerlifterski.md';

describe('przedmioty_magiczne.json — audyt Pasa Cyrkowca i Pasa Powerlifterskiego', () => {
  it('odwzorowuje Pas Cyrkowca dokładnie tak, jak w źródle', () => {
    expect(magicItem('pas_cyrkowca')).toEqual({
      id: 'pas_cyrkowca',
      name: 'Pas Cyrkowca',
      source: CIRCUS_BELT_SOURCE,
      status: 'detailed',
      type: 'Pas',
      rarity: 'Niezwykłe',
      handItemSlots: 4,
      modifiers: ['+2 do Akrobatyki'],
      description:
        'Pasek został zaprojektowany specjalnie tak, by być lekkim, nie krępować ruchów i zachować swoją funkcjonalność, umożliwiając szybki dostęp do wszystkich niezbędnych akcesoriów podczas występów.',
    });
  });

  it('odwzorowuje Pas Powerlifterski dokładnie tak, jak w źródle', () => {
    expect(magicItem('pas_powerlifterski')).toEqual({
      id: 'pas_powerlifterski',
      name: 'Pas Powerlifterski',
      source: POWERLIFTING_BELT_SOURCE,
      status: 'detailed',
      type: 'Pas',
      rarity: 'Niezwykłe',
      handItemSlots: 3,
      effects: ['+1 Pancerza', '+1 bazowej Staminy / Many'],
      modifiers: ['Atletyka +2'],
      description: 'Pas pomaga utrzymać bebechy w środku przy podnoszeniu niezwykłych ciężarów.',
    });
  });

  it('normalizuje męską formę rzadkości Pasa Powerlifterskiego do formy kompendium', () => {
    expect(magicItem('pas_powerlifterski').rarity).toBe('Niezwykłe');
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    const circusBelt = indexEntry('pas_cyrkowca');
    expect(circusBelt.name).toBe('Pas Cyrkowca');
    expect(circusBelt.source).toBe(CIRCUS_BELT_SOURCE);

    const powerliftingBelt = indexEntry('pas_powerlifterski');
    expect(powerliftingBelt.name).toBe('Pas Powerlifterski');
    expect(powerliftingBelt.source).toBe(POWERLIFTING_BELT_SOURCE);
  });

  it('nie zgłasza nieistniejącej literówki "krępować" w Pasie Cyrkowca', () => {
    expect(magicItem('pas_cyrkowca').description).toContain('nie krępować ruchów');

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('pas_cyrkowca'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === CIRCUS_BELT_SOURCE,
      ),
    ).toEqual([]);
  });

  it('nie zgłasza nieistniejącej literówki "bebehy" w Pasie Powerlifterskim', () => {
    expect(magicItem('pas_powerlifterski').description).toContain('utrzymać bebechy w środku');

    const related = inconsistencies.filter((entry) =>
      entry.relatedEntryIds.includes('pas_powerlifterski'),
    );
    expect(related).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === POWERLIFTING_BELT_SOURCE,
      ),
    ).toEqual([]);
  });
});

const DREAM_CLOAK_SOURCE = 'ekwipunek/przedmioty_magiczne/niezwykłe/peleryna_snów.md';
const STEADFAST_RING_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/pierścień_niewzruszonego_umysłu.md';

describe('przedmioty_magiczne.json — audyt Peleryny Snów i Pierścienia Niewzruszonego Umysłu', () => {
  it('odwzorowuje Pelerynę Snów dokładnie tak, jak w źródle', () => {
    expect(magicItem('peleryna_snów')).toEqual({
      id: 'peleryna_snów',
      name: 'Peleryna Snów',
      source: DREAM_CLOAK_SOURCE,
      status: 'detailed',
      type: 'Peleryna',
      rarity: 'Niezwykłe',
      modifiers: ['+2 do Psychologii'],
      description:
        'Peleryna pokryta jest symbolami oczu a fioletowym tle. Jej widok jest o tyle niepokojący, że symbole zdają się stale pływać po całej pelerynie, jakby ta była jedynie ułudą utkaną z własnych myśli obserwatora.',
    });
  });

  it('odwzorowuje Pierścień Niewzruszonego Umysłu dokładnie tak, jak w źródle', () => {
    const item = magicItem('pierścień_niewzruszonego_umysłu');

    expect(item).toMatchObject({
      id: 'pierścień_niewzruszonego_umysłu',
      name: 'Pierścień Niewzruszonego Umysłu',
      source: STEADFAST_RING_SOURCE,
      status: 'detailed',
      type: 'Pierścień',
      rarity: 'Niezwykłe',
      modifiers: ['Niewrażliwość na Panikę'],
    });
    expect(item.description).toContain('Prosty, na pozór niepozorny pierścień');
    expect(item.description).toContain('wpatrując się w jego głąb');
    expect(item.description).toContain('artefaktem opanowania wobec grozy pola bitwy');
    expect(item.description).toContain('rodzaj wewnętrznej kotwicy');
    expect(item.description?.split('\n\n')).toHaveLength(4);
  });

  it('rejestruje oba przedmioty w indeksie wyszukiwania', () => {
    expect(indexEntry('peleryna_snów')).toEqual({
      id: 'peleryna_snów',
      type: 'magicItem',
      name: 'Peleryna Snów',
      source: DREAM_CLOAK_SOURCE,
      status: 'detailed',
    });
    expect(indexEntry('pierścień_niewzruszonego_umysłu')).toEqual({
      id: 'pierścień_niewzruszonego_umysłu',
      type: 'magicItem',
      name: 'Pierścień Niewzruszonego Umysłu',
      source: STEADFAST_RING_SOURCE,
      status: 'detailed',
    });
  });

  it('zapisuje rzeczywistą literówkę "a fioletowym tle" w Pelerynie Snów', () => {
    const entry = inconsistencies.find((item) => item.id === 'peleryna_snów_typo_a_fioletowym');

    expect(entry).toMatchObject({
      kind: 'typo',
      source: DREAM_CLOAK_SOURCE,
      evidence: 'Peleryna pokryta jest symbolami oczu a fioletowym tle.',
      relatedEntryIds: ['peleryna_snów'],
      status: 'detailed',
    });
    expect(
      index.find(
        (item) => item.id === 'peleryna_snów_typo_a_fioletowym' && item.type === 'inconsistency',
      ),
    ).toMatchObject({
      source: DREAM_CLOAK_SOURCE,
    });
  });

  it('nie zgłasza nieistniejącej literówki "głąb" w Pierścieniu Niewzruszonego Umysłu', () => {
    expect(magicItem('pierścień_niewzruszonego_umysłu').description).toContain(
      'wpatrując się w jego głąb',
    );

    expect(
      inconsistencies.filter((entry) =>
        entry.relatedEntryIds.includes('pierścień_niewzruszonego_umysłu'),
      ),
    ).toEqual([]);
    expect(
      index.filter(
        (entry) => entry.type === 'inconsistency' && entry.source === STEADFAST_RING_SOURCE,
      ),
    ).toEqual([]);
  });
});

const STIMULATING_RING_SOURCE =
  'ekwipunek/przedmioty_magiczne/niezwykłe/pierścionek_stymulujący.md';
const TONGUE_RING_SOURCE = 'ekwipunek/przedmioty_magiczne/niezwykłe/pierścionek_z_języczkiem.md';

describe('przedmioty_magiczne.json — audyt Pierścionka Stymulującego i Pierścionka z Języczkiem', () => {
  it('odwzorowuje Pierścionek Stymulujący dokładnie tak, jak w źródle', () => {
    expect(magicItem('pierścionek_stymulujący')).toEqual({
      id: 'pierścionek_stymulujący',
      name: 'Pierścionek Stymulujący',
      source: STIMULATING_RING_SOURCE,
      status: 'detailed',
      type: 'Pierścień',
      rarity: 'Niezwykłe',
      modifiers: ['Zwinne dłonie +2'],
      description:
        'Pierścionek jest wykonany z platyny i pokryty jest niezwykle stymulującymi dla opuszczków palców grawerunkiem, zachęcając do macania go w wolnych chwilach i zarazem ćwiczenia zwinności palców.',
    });
  });

  it('odwzorowuje Pierścionek z Języczkiem dokładnie tak, jak w źródle', () => {
    expect(magicItem('pierścionek_z_języczkiem')).toEqual({
      id: 'pierścionek_z_języczkiem',
      name: 'Pierścionek z Języczkiem',
      source: TONGUE_RING_SOURCE,
      status: 'detailed',
      type: 'Pierścień',
      rarity: 'Niezwykłe',
      modifiers: ['Lingwistyka +2'],
      description:
        'Pierścionek jest wykonany z elektrum, a zamiast klejnotu, został w nim osadzony język ropuchy sułtańskiej. Jeśli pozwoli się temu językowi polizać za uchem, toksyna ropuchy pobudza częśc mózgu odpowiedzialną za rozumienie języków.',
    });
  });

  it('rejestruje oba pierścionki w indeksie wyszukiwania', () => {
    expect(indexEntry('pierścionek_stymulujący')).toEqual({
      id: 'pierścionek_stymulujący',
      type: 'magicItem',
      name: 'Pierścionek Stymulujący',
      source: STIMULATING_RING_SOURCE,
      status: 'detailed',
    });
    expect(indexEntry('pierścionek_z_języczkiem')).toEqual({
      id: 'pierścionek_z_języczkiem',
      type: 'magicItem',
      name: 'Pierścionek z Języczkiem',
      source: TONGUE_RING_SOURCE,
      status: 'detailed',
    });
  });

  it('zapisuje literówkę "opuszczków" w Pierścionku Stymulującym', () => {
    const entry = inconsistencies.find(
      (item) => item.id === 'pierścionek_stymulujący_typo_opuszczków',
    );

    expect(entry).toMatchObject({
      kind: 'typo',
      source: STIMULATING_RING_SOURCE,
      details: 'W opisie zapisano "opuszczków" zamiast "opuszków".',
      evidence: 'niezwykle stymulującymi dla opuszczków palców grawerunkiem',
      relatedEntryIds: ['pierścionek_stymulujący'],
      status: 'detailed',
    });
    expect(
      index.find(
        (item) =>
          item.id === 'pierścionek_stymulujący_typo_opuszczków' && item.type === 'inconsistency',
      ),
    ).toMatchObject({
      name: "Pierścionek Stymulujący: literówka 'opuszczków'",
      source: STIMULATING_RING_SOURCE,
    });
    expect(
      inconsistencies.filter(
        (item) =>
          item.source === STIMULATING_RING_SOURCE &&
          item.relatedEntryIds.includes('pierścionek_stymulujący'),
      ),
    ).toHaveLength(1);
  });

  it('zapisuje literówkę "częśc" w Pierścionku z Języczkiem', () => {
    const entry = inconsistencies.find((item) => item.id === 'pierścionek_z_języczkiem_typo_częśc');

    expect(entry).toMatchObject({
      kind: 'typo',
      source: TONGUE_RING_SOURCE,
      details: 'W opisie zapisano "częśc" zamiast "część".',
      evidence: 'toksyna ropuchy pobudza częśc mózgu',
      relatedEntryIds: ['pierścionek_z_języczkiem'],
      status: 'detailed',
    });
    expect(
      index.find(
        (item) =>
          item.id === 'pierścionek_z_języczkiem_typo_częśc' && item.type === 'inconsistency',
      ),
    ).toMatchObject({
      name: "Pierścionek z Języczkiem: literówka 'częśc'",
      source: TONGUE_RING_SOURCE,
    });
    expect(
      inconsistencies.filter(
        (item) =>
          item.source === TONGUE_RING_SOURCE &&
          item.relatedEntryIds.includes('pierścionek_z_języczkiem'),
      ),
    ).toHaveLength(1);
  });
});
