import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HandItem } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { LinkedText } from '../../../ui/linked-text/linked-text';

@Component({
  selector: 'app-hand-item-card',
  imports: [CardShell, Tag, RouterLink, LinkedText],
  templateUrl: './hand-item-card.html',
  styleUrl: './hand-item-card.scss',
})
export class HandItemCard {
  readonly handItem = input.required<HandItem>();
}
