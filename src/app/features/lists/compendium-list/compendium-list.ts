import { Component, computed, effect, inject, input, signal } from '@angular/core';
import type {
  BaseEntry,
  CharacterClass,
  CompendiumType,
  MagicItem,
  MagicItemRarity,
} from '../../../models/compendium';
import { RARITY_ORDER } from '../../../models/compendium';
import { CompendiumService } from '../../../services/compendium.service';
import { FilterBar, type FilterGroup } from '../../../ui/filter-bar/filter-bar';
import { EntityCard } from '../../cards/entity-card/entity-card';

type FilterGetter = (entry: BaseEntry) => string[];

interface FilterDim {
  key: string;
  label: string;
  get: FilterGetter;
}

const FILTER_DIMS: Partial<Record<CompendiumType, FilterDim[]>> = {
  class: [
    { key: 'archetype', label: 'Archetyp', get: (c) => [(c as CharacterClass).archetype ?? 'Inne'] },
  ],
  weapon: [
    { key: 'category', label: 'Kategoria', get: (w) => [(w as { category?: string }).category ?? ''] },
    { key: 'baseStat', label: 'Statystyka', get: (w) => [(w as { baseStat?: string }).baseStat ?? ''] },
  ],
  armor: [
    { key: 'category', label: 'Kategoria', get: (a) => [(a as { category?: string }).category ?? ''] },
  ],
  handItem: [
    { key: 'category', label: 'Kategoria', get: (h) => [(h as { category?: string }).category ?? ''] },
  ],
  magicItem: [
    { key: 'rarity', label: 'Rzadkość', get: (m) => [(m as MagicItem).rarity] },
    { key: 'type', label: 'Typ', get: (m) => [(m as MagicItem).type] },
  ],
  monster: [
    { key: 'tier', label: 'Typ', get: (m) => [(m as { tier?: string }).tier ?? ''] },
    { key: 'tags', label: 'Tagi', get: (m) => (m as { tags?: string[] }).tags ?? [] },
  ],
};

@Component({
  selector: 'app-compendium-list',
  imports: [FilterBar, EntityCard],
  templateUrl: './compendium-list.html',
  styleUrl: './compendium-list.scss',
})
export class CompendiumList {
  private readonly compendium = inject(CompendiumService);

  readonly type = input.required<CompendiumType>();

  protected readonly loading = this.compendium.loading;
  protected readonly error = this.compendium.error;

  private readonly _selection = signal<Record<string, string[]>>({});
  protected readonly selection = this._selection.asReadonly();

  constructor() {
    this.compendium.load();
    effect(() => {
      this.type();
      this._selection.set({});
    });
  }

  protected readonly entries = computed(() => this.compendium.byType(this.type())());

  protected readonly filterGroups = computed<FilterGroup[]>(() => {
    const dims = FILTER_DIMS[this.type()] ?? [];
    return dims
      .map((dim) => {
        const values = new Set<string>();
        for (const entry of this.entries()) {
          for (const value of dim.get(entry)) {
            if (value) {
              values.add(value);
            }
          }
        }
        let sorted = [...values];
        if (dim.key === 'rarity') {
          sorted.sort(
            (a, b) =>
              RARITY_ORDER.indexOf(a as MagicItemRarity) - RARITY_ORDER.indexOf(b as MagicItemRarity),
          );
        } else {
          sorted.sort((a, b) => a.localeCompare(b, 'pl'));
        }
        return { key: dim.key, label: dim.label, values: sorted };
      })
      .filter((group) => group.values.length > 0);
  });

  protected readonly filtered = computed<BaseEntry[]>(() => {
    const sorted = this.sortEntries(this.type(), this.entries());
    const selection = this._selection();
    const active = Object.entries(selection).filter(([, values]) => values.length > 0);
    if (active.length === 0) {
      return sorted;
    }
    return sorted.filter((entry) =>
      active.every(([key, values]) => {
        const dims = FILTER_DIMS[this.type()] ?? [];
        const dim = dims.find((d) => d.key === key);
        if (!dim) {
          return true;
        }
        const entryValues = dim.get(entry);
        return values.some((value) => entryValues.includes(value));
      }),
    );
  });

  protected onToggle(event: { key: string; value: string }): void {
    const current = this._selection()[event.key] ?? [];
    const next = current.includes(event.value)
      ? current.filter((value) => value !== event.value)
      : [...current, event.value];
    this._selection.update((selection) => ({ ...selection, [event.key]: next }));
  }

  protected clearFilters(): void {
    this._selection.set({});
  }

  private sortEntries(type: CompendiumType, entries: BaseEntry[]): BaseEntry[] {
    const byName = (a: BaseEntry, b: BaseEntry) => a.name.localeCompare(b.name, 'pl');
    const detailed = entries.filter((entry) => entry.status === 'detailed');
    const stubs = entries.filter((entry) => entry.status === 'stub');

    if (type === 'class') {
      detailed.sort((a, b) => {
        const aa = (a as CharacterClass).archetype;
        const bb = (b as CharacterClass).archetype;
        if (aa && bb) {
          return aa.localeCompare(bb, 'pl') || byName(a, b);
        }
        if (aa && !bb) {
          return -1;
        }
        if (!aa && bb) {
          return 1;
        }
        return byName(a, b);
      });
    } else if (type === 'magicItem') {
      detailed.sort((a, b) => {
        const ai = RARITY_ORDER.indexOf((a as MagicItem).rarity);
        const bi = RARITY_ORDER.indexOf((b as MagicItem).rarity);
        return ai - bi || byName(a, b);
      });
    } else {
      detailed.sort(byName);
    }

    stubs.sort(byName);
    return [...detailed, ...stubs];
  }
}
