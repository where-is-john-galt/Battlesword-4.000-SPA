import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Profession } from '../../../models/compendium';
import { cleanItemName, CompendiumService } from '../../../services/compendium.service';
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
  private readonly compendium = inject(CompendiumService);

  readonly profession = input.required<Profession>();

  protected readonly equipmentLinks = computed(() =>
    (this.profession().startingEquipment ?? []).map((item) => ({
      text: item,
      target: this.compendium.resolveByName(cleanItemName(item)),
    })),
  );
}
