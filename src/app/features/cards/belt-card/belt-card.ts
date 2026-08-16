import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Belt } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';

@Component({
  selector: 'app-belt-card',
  imports: [CardShell, RouterLink],
  templateUrl: './belt-card.html',
  styleUrl: './belt-card.scss',
})
export class BeltCard {
  readonly belt = input.required<Belt>();
}
