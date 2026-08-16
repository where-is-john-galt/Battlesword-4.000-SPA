import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import type { CompendiumType, IndexEntry } from '../../../models/compendium';
import { typeMeta } from '../../../models/sections';
import { CompendiumService } from '../../../services/compendium.service';
import { Heading } from '../../../ui/heading/heading';
import { DecoLine } from '../../../ui/deco-line/deco-line';
import { SearchInput } from '../../../ui/search-input/search-input';
import { Tag } from '../../../ui/tag/tag';

interface ResultGroup {
  type: CompendiumType;
  label: string;
  entries: IndexEntry[];
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

@Component({
  selector: 'app-szukaj-page',
  imports: [Heading, DecoLine, SearchInput, Tag, RouterLink],
  templateUrl: './szukaj-page.html',
  styleUrl: './szukaj-page.scss',
})
export class SzukajPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly compendium = inject(CompendiumService);
  private readonly queryParams = toSignal(this.route.queryParams);

  constructor() {
    this.compendium.load();
  }

  protected readonly query = computed(() => this.queryParams()?.['q'] ?? '');

  protected readonly results = computed<IndexEntry[]>(() => {
    const query = normalize(this.query());
    if (!query) {
      return [];
    }
    return this.compendium.index().filter((entry) => normalize(entry.name).includes(query));
  });

  protected readonly groups = computed<ResultGroup[]>(() => {
    const map = new Map<CompendiumType, IndexEntry[]>();
    for (const entry of this.results()) {
      const list = map.get(entry.type) ?? [];
      list.push(entry);
      map.set(entry.type, list);
    }
    return [...map.entries()].map(([type, entries]) => ({
      type,
      label: `${typeMeta(type).sectionLabel} · ${typeMeta(type).categoryLabel}`,
      entries,
    }));
  });

  protected onSearch(query: string): void {
    this.router.navigate([], { queryParams: query ? { q: query } : {}, replaceUrl: true });
  }
}
