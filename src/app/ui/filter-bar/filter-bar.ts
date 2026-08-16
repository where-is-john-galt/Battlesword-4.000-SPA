import { Component, input, output } from '@angular/core';

export interface FilterGroup {
  key: string;
  label: string;
  values: string[];
}

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar {
  readonly groups = input.required<FilterGroup[]>();
  readonly selection = input.required<Record<string, string[]>>();
  readonly toggled = output<{ key: string; value: string }>();
  readonly cleared = output<void>();

  protected isActive(key: string, value: string): boolean {
    return this.selection()[key]?.includes(value) ?? false;
  }

  protected hasSelection(): boolean {
    return Object.values(this.selection()).some((values) => values.length > 0);
  }
}
