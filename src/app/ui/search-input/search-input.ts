import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  readonly value = input('');
  readonly placeholder = input('Szukaj...');
  readonly submitted = output<string>();

  protected readonly query = signal(this.value());

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected submit(): void {
    this.submitted.emit(this.query().trim());
  }
}
