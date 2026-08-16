import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Race } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { AbilityBlock } from '../../../ui/ability-block/ability-block';

@Component({
  selector: 'app-race-card',
  imports: [CardShell, Tag, AbilityBlock, RouterLink],
  templateUrl: './race-card.html',
  styleUrl: './race-card.scss',
})
export class RaceCard {
  readonly race = input.required<Race>();
}
