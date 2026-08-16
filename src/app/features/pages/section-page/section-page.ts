import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import type { CompendiumType } from '../../../models/compendium';
import { SECTIONS } from '../../../models/sections';
import { Heading } from '../../../ui/heading/heading';
import { DecoLine } from '../../../ui/deco-line/deco-line';
import { SectionTabs } from '../../lists/section-tabs/section-tabs';
import { CompendiumList } from '../../lists/compendium-list/compendium-list';

@Component({
  selector: 'app-section-page',
  imports: [Heading, DecoLine, SectionTabs, CompendiumList],
  templateUrl: './section-page.html',
  styleUrl: './section-page.scss',
})
export class SectionPage {
  private readonly route = inject(ActivatedRoute);
  private readonly url = toSignal(this.route.url);
  private readonly paramMap = toSignal(this.route.paramMap);

  protected readonly section = computed(() => {
    const path = this.url()?.[0]?.path ?? 'postac';
    return SECTIONS.find((section) => section.path === path) ?? SECTIONS[0];
  });

  protected readonly type = computed<CompendiumType>(() => {
    const section = this.section();
    const kategoria = this.paramMap()?.get('kategoria');
    const category =
      section.categories.find((category) => category.path === kategoria) ?? section.categories[0];
    return category.type;
  });
}
