import { Component, computed, inject, input } from '@angular/core';
import { CompendiumService } from '../../services/compendium.service';

@Component({
  selector: 'app-glossary-tooltip',
  templateUrl: './glossary-tooltip.html',
  styleUrl: './glossary-tooltip.scss',
  host: { '[attr.data-variant]': 'variant()' },
})
export class GlossaryTooltip {
  private readonly compendium = inject(CompendiumService);

  readonly term = input.required<string>();
  readonly variant = input<'default' | 'label'>('default');

  protected readonly definition = computed(() => {
    const term = this.term().toLowerCase();
    return this.compendium
      .glossary()
      .find((entry) => entry.name.toLowerCase() === term || entry.term.toLowerCase() === term)
      ?.definition;
  });
}
