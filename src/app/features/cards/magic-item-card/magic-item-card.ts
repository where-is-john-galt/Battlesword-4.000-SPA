import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { IndexEntry, MagicItem } from '../../../models/compendium';
import { cleanItemName, CompendiumService } from '../../../services/compendium.service';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { CombatAbilityBlock } from '../../../ui/combat-ability-block/combat-ability-block';
import { LinkedText } from '../../../ui/linked-text/linked-text';

@Component({
  selector: 'app-magic-item-card',
  imports: [CardShell, Tag, CombatAbilityBlock, LinkedText, RouterLink],
  templateUrl: './magic-item-card.html',
  styleUrl: './magic-item-card.scss',
})
export class MagicItemCard {
  private readonly compendium = inject(CompendiumService);

  readonly magicItem = input.required<MagicItem>();

  protected readonly baseItemTarget = computed<IndexEntry | undefined>(() => {
    const base = this.magicItem().baseItem;
    if (!base) {
      return undefined;
    }
    return this.compendium.resolveByName(cleanItemName(base));
  });
}
