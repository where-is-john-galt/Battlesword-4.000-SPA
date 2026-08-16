import { Component, input } from '@angular/core';

@Component({
  selector: 'app-deco-line',
  templateUrl: './deco-line.html',
  styleUrl: './deco-line.scss',
})
export class DecoLine {
  readonly width = input('190px');
}
