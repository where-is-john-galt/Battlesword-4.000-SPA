import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { SectionDef } from '../../../models/sections';

@Component({
  selector: 'app-section-tabs',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './section-tabs.html',
  styleUrl: './section-tabs.scss',
})
export class SectionTabs {
  readonly section = input.required<SectionDef>();
}
