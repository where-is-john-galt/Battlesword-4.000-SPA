import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SearchInput } from '../../ui/search-input/search-input';
import { Icon } from '../../ui/icon/icon';
import { SECTIONS } from '../../models/sections';
import { sectionIcon } from '../../models/icons';
import { SOURCE_PATCH_NOTES_URL, SOURCE_REVISION, SOURCE_VERSION } from '../../models/source';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SearchInput, Icon],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);
  protected readonly sourceVersion = SOURCE_VERSION;
  protected readonly sourceRevision = SOURCE_REVISION;
  protected readonly patchNotesUrl = SOURCE_PATCH_NOTES_URL;

  protected readonly navItems: NavItem[] = [
    ...SECTIONS.map((section) => ({ path: section.path, label: section.label })),
    { path: 'ulubione', label: 'Ulubione' },
  ];

  protected onSearch(query: string): void {
    this.menuOpen.set(false);
    this.router.navigate(['/szukaj'], { queryParams: query ? { q: query } : {} });
  }

  protected iconFor(path: string): string {
    return sectionIcon(path);
  }
}
