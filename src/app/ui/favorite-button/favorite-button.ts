import { Component, computed, inject, input } from '@angular/core';
import type { CompendiumType } from '../../models/compendium';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.html',
  styleUrl: './favorite-button.scss',
})
export class FavoriteButton {
  private readonly favorites = inject(FavoritesService);

  readonly type = input.required<CompendiumType>();
  readonly id = input.required<string>();

  protected readonly active = computed(() => this.favorites.has(this.type(), this.id()));

  protected toggle(): void {
    this.favorites.toggle(this.type(), this.id());
  }
}
