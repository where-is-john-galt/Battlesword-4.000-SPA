import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Monster } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { AbilityBlock } from '../../../ui/ability-block/ability-block';

@Component({
  selector: 'app-monster-card',
  imports: [CardShell, Tag, AbilityBlock, RouterLink],
  templateUrl: './monster-card.html',
  styleUrl: './monster-card.scss',
})
export class MonsterCard {
  readonly monster = input.required<Monster>();
}
