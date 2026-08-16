import { Component, input } from '@angular/core';
import type { CompendiumType, Rule } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { LinkedText } from '../../../ui/linked-text/linked-text';

@Component({
  selector: 'app-rule-card',
  imports: [CardShell, LinkedText],
  templateUrl: './rule-card.html',
  styleUrl: './rule-card.scss',
})
export class RuleCard {
  readonly type = input.required<CompendiumType>();
  readonly entry = input.required<Rule>();
}
