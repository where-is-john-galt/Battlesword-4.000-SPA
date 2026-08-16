import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CompendiumType } from '../../models/compendium';
import { CompendiumService } from '../../services/compendium.service';
import { RulesLinkService } from '../../services/rules-link.service';

@Component({
  selector: 'app-linked-text',
  imports: [RouterLink],
  templateUrl: './linked-text.html',
  styleUrl: './linked-text.scss',
})
export class LinkedText {
  private readonly compendium = inject(CompendiumService);
  private readonly rulesLink = inject(RulesLinkService);

  readonly text = input.required<string>();

  protected readonly tokens = computed(() => this.rulesLink.linkify(this.text()));

  protected definition(type: CompendiumType, id: string): string | undefined {
    return this.compendium.definitionOf(type, id);
  }
}
