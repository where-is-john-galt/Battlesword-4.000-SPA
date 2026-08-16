import { Component, input } from '@angular/core';
import type { NamedAbility } from '../../models/compendium';

@Component({
  selector: 'app-ability-block',
  templateUrl: './ability-block.html',
  styleUrl: './ability-block.scss',
})
export class AbilityBlock {
  readonly ability = input.required<NamedAbility>();
}
