import { Component, input } from '@angular/core';
import type { CompendiumType } from '../../models/compendium';
import { Frame } from '../frame/frame';
import { FavoriteButton } from '../favorite-button/favorite-button';

@Component({
  selector: 'app-card-shell',
  imports: [Frame, FavoriteButton],
  templateUrl: './card-shell.html',
  styleUrl: './card-shell.scss',
})
export class CardShell {
  readonly type = input.required<CompendiumType>();
  readonly id = input.required<string>();
}
