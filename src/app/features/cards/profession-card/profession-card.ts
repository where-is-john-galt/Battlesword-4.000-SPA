import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Profession } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Predispositions } from '../../../ui/predispositions/predispositions';
import { AbilityBlock } from '../../../ui/ability-block/ability-block';
import { GlossaryTooltip } from '../../../ui/glossary-tooltip/glossary-tooltip';

@Component({
  selector: 'app-profession-card',
  imports: [CardShell, Predispositions, AbilityBlock, GlossaryTooltip, RouterLink],
  templateUrl: './profession-card.html',
  styleUrl: './profession-card.scss',
})
export class ProfessionCard {
  readonly profession = input.required<Profession>();
}
