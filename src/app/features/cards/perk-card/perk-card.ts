import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Perk } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { LinkedText } from '../../../ui/linked-text/linked-text';

@Component({
  selector: 'app-perk-card',
  imports: [CardShell, RouterLink, LinkedText],
  templateUrl: './perk-card.html',
  styleUrl: './perk-card.scss',
})
export class PerkCard {
  readonly perk = input.required<Perk>();
}
