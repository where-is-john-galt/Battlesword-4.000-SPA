import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { isCompendiumType, type CompendiumType } from '../../../models/compendium';
import { typeMeta } from '../../../models/sections';
import { BacklinksService } from '../../../services/backlinks.service';
import { CompendiumService } from '../../../services/compendium.service';
import { DecoLine } from '../../../ui/deco-line/deco-line';
import { EntityCard } from '../../cards/entity-card/entity-card';

@Component({
  selector: 'app-karta-page',
  imports: [DecoLine, EntityCard, RouterLink],
  templateUrl: './karta-page.html',
  styleUrl: './karta-page.scss',
})
export class KartaPage {
  private readonly route = inject(ActivatedRoute);
  private readonly compendium = inject(CompendiumService);
  private readonly backlinksService = inject(BacklinksService);
  private readonly params = toSignal(this.route.params);

  protected readonly loading = this.compendium.loading;

  constructor() {
    this.compendium.load();
  }

  private readonly rawType = computed(() => this.params()?.['type'] ?? '');
  private readonly id = computed(() => this.params()?.['id'] ?? '');

  protected readonly isValidType = computed(() => isCompendiumType(this.rawType()));

  protected readonly type = computed<CompendiumType>(() =>
    isCompendiumType(this.rawType()) ? this.rawType() : 'race',
  );

  protected readonly meta = computed(() =>
    this.isValidType() ? typeMeta(this.type()) : undefined,
  );

  protected readonly entry = computed(() => {
    if (!this.isValidType() || !this.id()) {
      return undefined;
    }
    return this.compendium.byType(this.type())().find((entry) => entry.id === this.id());
  });

  protected readonly backlinks = computed(() => {
    if (!this.isValidType() || !this.id()) {
      return [];
    }
    return this.backlinksService.backlinksFor(this.type(), this.id()).slice(0, 20);
  });
}
