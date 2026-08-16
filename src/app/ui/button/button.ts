import { Component, input } from '@angular/core';

export type ButtonVariant = 'default' | 'large';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: { '[attr.data-variant]': 'variant()' },
})
export class Button {
  readonly label = input.required<string>();
  readonly variant = input<ButtonVariant>('default');
  readonly disabled = input(false);
}
