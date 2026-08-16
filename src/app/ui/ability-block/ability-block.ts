import { Component, input } from '@angular/core';
import type { NamedAbility } from '../../models/compendium';
import { LinkedText } from '../linked-text/linked-text';

@Component({
  selector: 'app-ability-block',
  imports: [LinkedText],
  templateUrl: './ability-block.html',
  styleUrl: './ability-block.scss',
})
export class AbilityBlock {
  readonly ability = input.required<NamedAbility>();
}
