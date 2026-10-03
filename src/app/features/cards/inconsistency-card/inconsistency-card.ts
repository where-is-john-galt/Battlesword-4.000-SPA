import { Component, input } from '@angular/core';
import type { Inconsistency } from '../../../models/compendium';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { LinkedText } from '../../../ui/linked-text/linked-text';

const KIND_LABELS: Record<Inconsistency['kind'], string> = {
  conflict: 'Sprzeczność',
  missing_detail: 'Brak opisu',
  asymmetry: 'Różne skutki',
  ambiguity: 'Niejednoznaczność',
  typo: 'Błąd w źródle',
  other: 'Uwaga do źródła',
};

@Component({
  selector: 'app-inconsistency-card',
  imports: [CardShell, LinkedText],
  templateUrl: './inconsistency-card.html',
  styleUrl: './inconsistency-card.scss',
})
export class InconsistencyCard {
  readonly entry = input.required<Inconsistency>();
  protected readonly kindLabel = KIND_LABELS;

  protected sourceUrl(path: string): string {
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    return `https://github.com/Iwanuss/Battlesword-4.000/blob/${this.entry().revision}/${encoded}`;
  }
}
