import { Injectable, signal } from '@angular/core';
import type { CompendiumType } from '../models/compendium';

export interface FavoriteRef {
  type: CompendiumType;
  id: string;
}

const STORAGE_KEY = 'bs4k.favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly _favorites = signal<FavoriteRef[]>(this.read());
  readonly favorites = this._favorites.asReadonly();

  private read(): FavoriteRef[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(
        (item): item is FavoriteRef =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as FavoriteRef).type === 'string' &&
          typeof (item as FavoriteRef).id === 'string',
      );
    } catch {
      return [];
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._favorites()));
  }

  has(type: CompendiumType, id: string): boolean {
    return this._favorites().some((item) => item.type === type && item.id === id);
  }

  toggle(type: CompendiumType, id: string): void {
    const current = this._favorites();
    const exists = current.some((item) => item.type === type && item.id === id);
    this._favorites.set(
      exists ? current.filter((item) => !(item.type === type && item.id === id)) : [...current, { type, id }],
    );
    this.persist();
  }

  remove(type: CompendiumType, id: string): void {
    this._favorites.set(this._favorites().filter((item) => !(item.type === type && item.id === id)));
    this.persist();
  }
}
