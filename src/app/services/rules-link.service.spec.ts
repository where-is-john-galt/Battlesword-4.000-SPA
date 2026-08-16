import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CompendiumService } from './compendium.service';
import { RulesLinkService } from './rules-link.service';

describe('RulesLinkService', () => {
  let service: RulesLinkService;
  let compendium: CompendiumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RulesLinkService);
    compendium = TestBed.inject(CompendiumService);

    compendium.stats.set([
      { id: 'siła', name: 'Siła', group: 'pierwszorzędna', definition: 'x', source: 's', status: 'detailed', aliases: ['siły'] },
    ]);
    compendium.mechanics.set([
      { id: 'test', name: 'Test', definition: 'y', source: 's', status: 'detailed' },
      { id: 'test_przeciwstawny', name: 'Test przeciwstawny', definition: 'z', source: 's', status: 'detailed' },
    ]);
    compendium.combat.set([
      { id: 'porażenie', name: 'Porażenie', definition: 'x', source: 's', status: 'detailed', aliases: ['porażenia', 'porażeniem'] },
      { id: 'oszołomienie', name: 'Oszołomienie', definition: 'w', source: 's', status: 'detailed', aliases: ['oszołomieni'] },
    ]);
    compendium.index.set([
      { id: 'kostur', type: 'weapon', name: 'Kostur', source: 's', status: 'detailed' },
    ]);
  });

  it('returns a single plain token when nothing matches', () => {
    expect(service.linkify('zwykły tekst bez odwołań')).toEqual([{ text: 'zwykły tekst bez odwołań' }]);
  });

  it('links an exact combat term', () => {
    expect(service.linkify('Nakłada Porażenie na cel')).toEqual([
      { text: 'Nakłada ' },
      { text: 'Porażenie', link: { type: 'combat', id: 'porażenie' } },
      { text: ' na cel' },
    ]);
  });

  it('matches inflected alias forms', () => {
    expect(service.linkify('Nakłada 1 poziom porażenia - 1 many')).toEqual([
      { text: 'Nakłada 1 poziom ' },
      { text: 'porażenia', link: { type: 'combat', id: 'porażenie' } },
      { text: ' - 1 many' },
    ]);
  });

  it('matches ignoring case and diacritics', () => {
    expect(service.linkify('nakłada PORAZENIA')).toEqual([
      { text: 'nakłada ' },
      { text: 'PORAZENIA', link: { type: 'combat', id: 'porażenie' } },
    ]);
  });

  it('prefers the longest matching term', () => {
    expect(service.linkify('to jest Test przeciwstawny')).toEqual([
      { text: 'to jest ' },
      { text: 'Test przeciwstawny', link: { type: 'mechanic', id: 'test_przeciwstawny' } },
    ]);
  });

  it('links a stat name', () => {
    expect(service.linkify('zwiększ Siły o 2')).toEqual([
      { text: 'zwiększ ' },
      { text: 'Siły', link: { type: 'stat', id: 'siła' } },
      { text: ' o 2' },
    ]);
  });

  it('does not match terms inside longer words', () => {
    expect(service.linkify('wykonaj testowanie')).toEqual([{ text: 'wykonaj testowanie' }]);
  });

  it('links an entity name (with inflection alias)', () => {
    expect(service.linkify('miota Kosturem')).toEqual([
      { text: 'miota ' },
      { text: 'Kosturem', link: { type: 'weapon', id: 'kostur' } },
    ]);
  });

  it('resolves an exact term to its target', () => {
    expect(service.resolve('Porażenie')).toEqual({ type: 'combat', id: 'porażenie' });
    expect(service.resolve('porażenia')).toEqual({ type: 'combat', id: 'porażenie' });
    expect(service.resolve('nieznane')).toBeUndefined();
  });

  it('handles empty and whitespace text', () => {
    expect(service.linkify('')).toEqual([{ text: '' }]);
  });
});
