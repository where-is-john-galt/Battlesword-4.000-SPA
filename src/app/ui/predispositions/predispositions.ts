import { Component, input } from '@angular/core';
import type { Predispositions as PredispositionsModel } from '../../models/compendium';
import { LinkedText } from '../linked-text/linked-text';

@Component({
  selector: 'app-predispositions',
  imports: [LinkedText],
  templateUrl: './predispositions.html',
  styleUrl: './predispositions.scss',
})
export class Predispositions {
  readonly predispositions = input.required<PredispositionsModel>();
}
