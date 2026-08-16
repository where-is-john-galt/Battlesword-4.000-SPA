import { Component, computed, inject, input } from '@angular/core';
import type { Stat, StatGroup } from '../../../models/compendium';
import { CompendiumService } from '../../../services/compendium.service';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { LinkedText } from '../../../ui/linked-text/linked-text';

const GROUP_LABELS: Record<StatGroup, string> = {
  pierwszorzędna: 'Pierwszorzędna',
  defensywna: 'Defensywna',
  drugorzędna: 'Drugorzędna',
  trzeciorzędna: 'Trzeciorzędna',
  drużynowa: 'Drużynowa',
};

@Component({
  selector: 'app-stat-card',
  imports: [CardShell, Tag, LinkedText],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  private readonly compendium = inject(CompendiumService);

  readonly stat = input.required<Stat>();

  protected readonly groupLabel = computed(() => GROUP_LABELS[this.stat().group]);

  protected readonly baseName = computed(() => {
    const basedOn = this.stat().basedOn;
    if (!basedOn) {
      return undefined;
    }
    return this.compendium.byId('stat', basedOn)?.name;
  });
}
