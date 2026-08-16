import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { MiscItem } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';

@Component({
  selector: 'app-misc-item-card',
  imports: [CardShell, RouterLink],
  templateUrl: './misc-item-card.html',
  styleUrl: './misc-item-card.scss',
})
export class MiscItemCard {
  readonly miscItem = input.required<MiscItem>();
}
