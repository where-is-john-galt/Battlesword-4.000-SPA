import { Component, computed, input } from '@angular/core';
import type { CompendiumType } from '../../models/compendium';
import { typeIcon } from '../../models/icons';

export type IconSize = 'lg' | '2x' | '3x' | '4x' | '5x';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input<string>();
  readonly type = input<CompendiumType>();
  readonly size = input<IconSize>();
  readonly fixedWidth = input(false);

  protected readonly iconName = computed(() => this.name() ?? (this.type() ? typeIcon(this.type()!) : ''));

  protected readonly classes = computed(() => {
    const parts = ['ra', `ra-${this.iconName()}`];
    if (this.size()) {
      parts.push(`ra-${this.size()}`);
    }
    if (this.fixedWidth()) {
      parts.push('ra-fw');
    }
    return parts.join(' ');
  });
}
