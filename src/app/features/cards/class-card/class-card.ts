import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CharacterClass } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Predispositions } from '../../../ui/predispositions/predispositions';
import { AbilityBlock } from '../../../ui/ability-block/ability-block';
import { CombatAbilityBlock } from '../../../ui/combat-ability-block/combat-ability-block';
import { Tag } from '../../../ui/tag/tag';

@Component({
  selector: 'app-class-card',
  imports: [CardShell, Predispositions, AbilityBlock, CombatAbilityBlock, Tag, RouterLink],
  templateUrl: './class-card.html',
  styleUrl: './class-card.scss',
})
export class ClassCard {
  readonly classEntry = input.required<CharacterClass>();
}
