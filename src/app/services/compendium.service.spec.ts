import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CompendiumService } from './compendium.service';

describe('CompendiumService', () => {
  let service: CompendiumService;
  let http: HttpTestingController;

  const FILES = [
    'rasy.json',
    'profesje.json',
    'klasy.json',
    'perki.json',
    'bron.json',
    'pancerze.json',
    'paski.json',
    'przedmioty_podreczne.json',
    'przedmioty_magiczne.json',
    'reszta_ekwipunku.json',
    'bestiariusz.json',
    'glosariusz.json',
    'index.json',
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CompendiumService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads all data files and populates signals', () => {
    service.load();
    expect(service.loading()).toBe(true);

    for (const file of FILES) {
      const request = http.expectOne(`assets/data/${file}`);
      if (file === 'rasy.json') {
        request.flush([
          { id: 'człowiek', name: 'Człowiek', source: 'rasy/człowiek.md', status: 'detailed' },
        ]);
      } else if (file === 'index.json') {
        request.flush([{ id: 'człowiek', type: 'race', name: 'Człowiek', source: 'x', status: 'detailed' }]);
      } else {
        request.flush([]);
      }
    }

    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
    expect(service.races()).toHaveLength(1);
    expect(service.index()).toHaveLength(1);
  });

  it('exposes entries through byType and byId', () => {
    service.load();
    http.expectOne('assets/data/rasy.json').flush([
      { id: 'człowiek', name: 'Człowiek', source: 'rasy/człowiek.md', status: 'detailed' },
    ]);
    for (const file of FILES.slice(1)) {
      http.expectOne(`assets/data/${file}`).flush([]);
    }

    expect(service.byType('race')()).toHaveLength(1);
    expect(service.byId('race', 'człowiek')?.name).toBe('Człowiek');
    expect(service.byId('race', 'elf')).toBeUndefined();
  });

  it('does not fetch twice on repeated load calls', () => {
    service.load();
    service.load();
    for (const file of FILES) {
      http.expectOne(`assets/data/${file}`).flush([]);
    }
    expect(service.races()).toEqual([]);
  });
});
