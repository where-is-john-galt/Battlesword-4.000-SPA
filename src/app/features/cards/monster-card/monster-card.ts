import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Monster } from '../../../models/compendium';
import { RulesLinkService } from '../../../services/rules-link.service';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { AbilityBlock } from '../../../ui/ability-block/ability-block';
import { LinkedText } from '../../../ui/linked-text/linked-text';

@Component({
  selector: 'app-monster-card',
  imports: [CardShell, Tag, AbilityBlock, LinkedText, RouterLink],
  templateUrl: './monster-card.html',
  styleUrl: './monster-card.scss',
})
export class MonsterCard {
  private readonly rulesLink = inject(RulesLinkService);

  readonly monster = input.required<Monster>();

  protected readonly tierTarget = computed(() => {
    const tier = this.monster().tier;
    return tier ? this.rulesLink.resolve(tier) : undefined;
  });

  protected readonly resistanceLinks = computed(() =>
    (this.monster().resistances ?? []).map((name) => ({ name, target: this.rulesLink.resolve(name) })),
  );

  protected readonly vulnerabilityLinks = computed(() =>
    (this.monster().vulnerabilities ?? []).map((name) => ({ name, target: this.rulesLink.resolve(name) })),
  );
}
