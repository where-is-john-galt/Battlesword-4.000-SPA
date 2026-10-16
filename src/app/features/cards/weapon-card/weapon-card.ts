import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Weapon } from '../../../models/compendium';
import { RulesLinkService } from '../../../services/rules-link.service';
import { CardShell } from '../../../ui/card-shell/card-shell';
import { Tag, type TagLink } from '../../../ui/tag/tag';

@Component({
  selector: 'app-weapon-card',
  imports: [CardShell, Tag, RouterLink],
  templateUrl: './weapon-card.html',
  styleUrl: './weapon-card.scss',
})
export class WeaponCard {
  private readonly rulesLink = inject(RulesLinkService);

  readonly weapon = input.required<Weapon>();

  /**
   * Cechy specjalne są hasłami słowniczka z ekwipunek/broń.md — jeśli istnieje
   * odpowiadające im hasło w kompendium, etykieta staje się odnośnikiem.
   */
  protected featureLink(feature: string): TagLink | undefined {
    return this.rulesLink.resolve(feature);
  }
}
