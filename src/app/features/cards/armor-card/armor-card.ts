import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Armor } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag } from '../../../ui/tag/tag';
import { GlossaryTooltip } from '../../../ui/glossary-tooltip/glossary-tooltip';

@Component({
  selector: 'app-armor-card',
  imports: [CardShell, Tag, GlossaryTooltip, RouterLink],
  templateUrl: './armor-card.html',
  styleUrl: './armor-card.scss',
})
export class ArmorCard {
  readonly armor = input.required<Armor>();
}
