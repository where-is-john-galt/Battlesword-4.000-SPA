import { Component, input } from '@angular/core';

export type HeadingLevel = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-heading',
  templateUrl: './heading.html',
  styleUrl: './heading.scss',
})
export class Heading {
  readonly level = input<HeadingLevel>(2);
  readonly text = input.required<string>();
  readonly gradient = input(false);
}
