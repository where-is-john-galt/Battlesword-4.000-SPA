import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { SectionDef } from '../../../models/sections';
import type { CompendiumType } from '../../../models/compendium';
import { Icon } from '../../../ui/icon/icon';
import { typeIcon } from '../../../models/icons';

@Component({
  selector: 'app-section-tabs',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './section-tabs.html',
  styleUrl: './section-tabs.scss',
})
export class SectionTabs {
  readonly section = input.required<SectionDef>();

  protected iconFor(type: CompendiumType): string {
    return typeIcon(type);
  }
}
