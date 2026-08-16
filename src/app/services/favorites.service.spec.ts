import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    const service = new FavoritesService();
    expect(service.favorites()).toEqual([]);
  });

  it('toggles favorites and persists', () => {
    const service = new FavoritesService();

    service.toggle('race', 'człowiek');
    expect(service.has('race', 'człowiek')).toBe(true);
    expect(JSON.parse(localStorage.getItem('bs4k.favorites') ?? '[]')).toEqual([
      { type: 'race', id: 'człowiek' },
    ]);

    service.toggle('race', 'człowiek');
    expect(service.has('race', 'człowiek')).toBe(false);
    expect(service.favorites()).toEqual([]);
  });

  it('removes a single favorite', () => {
    const service = new FavoritesService();
    service.toggle('race', 'a');
    service.toggle('perk', 'b');
    service.remove('race', 'a');
    expect(service.favorites()).toEqual([{ type: 'perk', id: 'b' }]);
  });

  it('hydrates from localStorage', () => {
    localStorage.setItem('bs4k.favorites', JSON.stringify([{ type: 'monster', id: 'szkielet' }]));
    const service = new FavoritesService();
    expect(service.favorites()).toEqual([{ type: 'monster', id: 'szkielet' }]);
  });

  it('ignores malformed storage', () => {
    localStorage.setItem('bs4k.favorites', '{not json');
    const service = new FavoritesService();
    expect(service.favorites()).toEqual([]);
  });
});
