import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CompendiumService } from './compendium.service';
import { BacklinksService } from './backlinks.service';

describe('BacklinksService', () => {
  let service: BacklinksService;
  let compendium: CompendiumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BacklinksService);
    compendium = TestBed.inject(CompendiumService);

    compendium.combat.set([
      {
        id: 'porażenie',
        name: 'Porażenie',
        definition: 'x',
        source: 's',
        status: 'detailed',
        aliases: ['porażenia'],
      },
    ]);
    compendium.classes.set([
      {
        id: 'grzybiarz',
        name: 'Grzybiarz',
        source: 's',
        status: 'detailed',
        combatAbilities: {
          starting: [],
          purchasable: [
            { name: 'Nekrofagiczne mycelia', enhancements: ['Nakłada 1 poziom porażenia - 1 many'] },
          ],
        },
      },
    ]);
    compendium.index.set([
      { id: 'porażenie', type: 'combat', name: 'Porażenie', source: 's', status: 'detailed' },
      { id: 'grzybiarz', type: 'class', name: 'Grzybiarz', source: 's', status: 'detailed' },
    ]);
  });

  it('finds entries that reference a target', () => {
    expect(service.backlinksFor('combat', 'porażenie')).toEqual([
      { type: 'class', id: 'grzybiarz', name: 'Grzybiarz' },
    ]);
  });

  it('returns empty for unreferenced targets', () => {
    expect(service.backlinksFor('combat', 'nieznany')).toEqual([]);
  });
});
