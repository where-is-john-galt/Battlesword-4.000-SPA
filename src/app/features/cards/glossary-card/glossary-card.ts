import { Component, input } from '@angular/core';
import type { GlossaryEntry } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';

@Component({
  selector: 'app-glossary-card',
  imports: [CardShell],
  templateUrl: './glossary-card.html',
  styleUrl: './glossary-card.scss',
})
export class GlossaryCard {
  readonly entry = input.required<GlossaryEntry>();
}
