import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Race } from '../../../models/compendium';
import { RulesLinkService } from '../../../services/rules-link.service';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { AbilityBlock } from '../../../ui/ability-block/ability-block';
import { LinkedText } from '../../../ui/linked-text/linked-text';

@Component({
  selector: 'app-race-card',
  imports: [CardShell, Tag, AbilityBlock, LinkedText, RouterLink],
  templateUrl: './race-card.html',
  styleUrl: './race-card.scss',
})
export class RaceCard {
  private readonly rulesLink = inject(RulesLinkService);

  readonly race = input.required<Race>();

  protected readonly resistanceLinks = computed(() =>
    (this.race().resistances ?? []).map((name) => ({ name, target: this.rulesLink.resolve(name) })),
  );

  protected readonly vulnerabilityLinks = computed(() =>
    (this.race().vulnerabilities ?? []).map((name) => ({ name, target: this.rulesLink.resolve(name) })),
  );
}
