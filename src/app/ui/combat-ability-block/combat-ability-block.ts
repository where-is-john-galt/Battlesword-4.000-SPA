import { Component, computed, input } from '@angular/core';
import type { CombatAbility } from '../../models/compendium';
import { LinkedText } from '../linked-text/linked-text';

@Component({
  selector: 'app-combat-ability-block',
  imports: [LinkedText],
  templateUrl: './combat-ability-block.html',
  styleUrl: './combat-ability-block.scss',
})
export class CombatAbilityBlock {
  readonly ability = input.required<CombatAbility>();

  protected readonly metaItems = computed(() => {
    const ability = this.ability();
    const items: string[] = [];
    if (ability.activationTime) {
      items.push(ability.activationTime);
    }
    if (ability.range) {
      items.push(ability.range);
    }
    if (ability.duration) {
      items.push(ability.duration);
    }
    if (ability.area) {
      items.push(ability.area);
    }
    return items;
  });
}
