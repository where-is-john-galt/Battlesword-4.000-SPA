import { Component, input } from '@angular/core';

export type TagVariant = 'default' | 'gold' | 'muted' | 'danger';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
  host: { '[attr.data-variant]': 'variant()' },
})
export class Tag {
  readonly label = input.required<string>();
  readonly variant = input<TagVariant>('default');
}
