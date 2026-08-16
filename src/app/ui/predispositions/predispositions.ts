import { Component, input } from '@angular/core';
import type { Predispositions as PredispositionsModel } from '../../models/compendium';

@Component({
  selector: 'app-predispositions',
  templateUrl: './predispositions.html',
  styleUrl: './predispositions.scss',
})
export class Predispositions {
  readonly predispositions = input.required<PredispositionsModel>();
}
