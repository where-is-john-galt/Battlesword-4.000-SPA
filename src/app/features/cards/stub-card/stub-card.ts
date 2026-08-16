import { Component, input } from '@angular/core';
import type { BaseEntry, CompendiumType } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';

@Component({
  selector: 'app-stub-card',
  imports: [CardShell],
  templateUrl: './stub-card.html',
  styleUrl: './stub-card.scss',
})
export class StubCard {
  readonly type = input.required<CompendiumType>();
  readonly entry = input.required<BaseEntry>();
}
