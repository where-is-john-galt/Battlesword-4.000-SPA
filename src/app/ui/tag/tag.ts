import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CompendiumType } from '../../models/compendium';

export type TagVariant = 'default' | 'gold' | 'muted' | 'danger';

export interface TagLink {
  type: CompendiumType;
  id: string;
}

@Component({
  selector: 'app-tag',
  imports: [RouterLink],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
  host: { '[attr.data-variant]': 'variant()' },
})
export class Tag {
  readonly label = input.required<string>();
  readonly variant = input<TagVariant>('default');
  readonly link = input<TagLink>();
}
