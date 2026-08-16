import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CharacterClass, IndexEntry } from '../../../models/compendium';
import { cleanItemName, CompendiumService } from '../../../services/compendium.service';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Predispositions } from '../../../ui/predispositions/predispositions';
import { AbilityBlock } from '../../../ui/ability-block/ability-block';
import { CombatAbilityBlock } from '../../../ui/combat-ability-block/combat-ability-block';
import { LinkedText } from '../../../ui/linked-text/linked-text';

@Component({
  selector: 'app-class-card',
  imports: [CardShell, Predispositions, AbilityBlock, CombatAbilityBlock, LinkedText, RouterLink],
  templateUrl: './class-card.html',
  styleUrl: './class-card.scss',
})
export class ClassCard {
  private readonly compendium = inject(CompendiumService);

  readonly classEntry = input.required<CharacterClass>();

  protected readonly equipmentLinks = computed(() =>
    (this.classEntry().startingEquipment ?? []).map((item) => ({
      text: item,
      target: this.compendium.resolveByName(cleanItemName(item)),
    })),
  );
}
