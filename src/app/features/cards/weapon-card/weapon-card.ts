import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Weapon } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';

@Component({
  selector: 'app-weapon-card',
  imports: [CardShell, Tag, RouterLink],
  templateUrl: './weapon-card.html',
  styleUrl: './weapon-card.scss',
})
export class WeaponCard {
  readonly weapon = input.required<Weapon>();
}
