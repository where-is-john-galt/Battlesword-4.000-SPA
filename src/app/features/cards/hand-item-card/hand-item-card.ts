import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HandItem } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';

@Component({
  selector: 'app-hand-item-card',
  imports: [CardShell, Tag, RouterLink],
  templateUrl: './hand-item-card.html',
  styleUrl: './hand-item-card.scss',
})
export class HandItemCard {
  readonly handItem = input.required<HandItem>();
}
