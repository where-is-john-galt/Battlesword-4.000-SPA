import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { MagicItem } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { CombatAbilityBlock } from '../../../ui/combat-ability-block/combat-ability-block';

@Component({
  selector: 'app-magic-item-card',
  imports: [CardShell, Tag, CombatAbilityBlock, RouterLink],
  templateUrl: './magic-item-card.html',
  styleUrl: './magic-item-card.scss',
})
export class MagicItemCard {
  readonly magicItem = input.required<MagicItem>();
}
