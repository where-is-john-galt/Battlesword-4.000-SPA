import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BaseEntry, CompendiumType } from '../../../models/compendium';
import { typeMeta } from '../../../models/sections';
import { CompendiumService } from '../../../services/compendium.service';
import { FavoritesService, type FavoriteRef } from '../../../services/favorites.service';
import { Heading } from '../../../ui/heading/heading';
import { DecoLine } from '../../../ui/deco-line/deco-line';
import { FavoriteButton } from '../../../ui/favorite-button/favorite-button';

interface FavoriteItem {
  ref: FavoriteRef;
  entry: BaseEntry;
}

interface FavoriteGroup {
  label: string;
  items: FavoriteItem[];
}

@Component({
  selector: 'app-ulubione-page',
  imports: [Heading, DecoLine, FavoriteButton, RouterLink],
  templateUrl: './ulubione-page.html',
  styleUrl: './ulubione-page.scss',
})
export class UlubionePage {
  private readonly favorites = inject(FavoritesService);
  private readonly compendium = inject(CompendiumService);

  constructor() {
    this.compendium.load();
  }

  protected readonly items = computed<FavoriteItem[]>(() =>
    this.favorites
      .favorites()
      .map((ref) => ({ ref, entry: this.compendium.byId(ref.type, ref.id) }))
      .filter((item): item is FavoriteItem => item.entry !== undefined),
  );

  protected readonly groups = computed<FavoriteGroup[]>(() => {
    const map = new Map<string, FavoriteItem[]>();
    for (const item of this.items()) {
      const label = typeMeta(item.ref.type).sectionLabel;
      const list = map.get(label) ?? [];
      list.push(item);
      map.set(label, list);
    }
    return [...map.entries()].map(([label, items]) => ({ label, items }));
  });

  protected typeMetaLabel(type: CompendiumType): string {
    return typeMeta(type).categoryLabel;
  }
}
