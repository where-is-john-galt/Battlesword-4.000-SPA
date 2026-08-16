import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompendiumService } from '../../services/compendium.service';
import { RulesLinkService } from '../../services/rules-link.service';

@Component({
  selector: 'app-glossary-tooltip',
  imports: [RouterLink],
  templateUrl: './glossary-tooltip.html',
  styleUrl: './glossary-tooltip.scss',
  host: { '[attr.data-variant]': 'variant()' },
})
export class GlossaryTooltip {
  private readonly compendium = inject(CompendiumService);
  private readonly rulesLink = inject(RulesLinkService);

  readonly term = input.required<string>();
  readonly variant = input<'default' | 'label'>('default');
  readonly linkable = input(false);

  protected readonly target = computed(() => this.rulesLink.resolve(this.term()));

  protected readonly definition = computed(() => {
    const target = this.target();
    return target ? this.compendium.definitionOf(target.type, target.id) : undefined;
  });
}
