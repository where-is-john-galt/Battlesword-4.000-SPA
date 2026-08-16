import { Component, input } from '@angular/core';

export type FrameVariant = 'default' | 'success' | 'info' | 'error';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.html',
  styleUrl: './frame.scss',
  host: { '[attr.data-variant]': 'variant()' },
})
export class Frame {
  readonly variant = input<FrameVariant>('default');
}
