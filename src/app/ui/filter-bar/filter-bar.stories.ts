import type { Meta, StoryObj } from '@storybook/angular';
import { FilterBar } from './filter-bar';

const meta: Meta<FilterBar> = {
  title: 'Components/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  args: {
    groups: [
      { key: 'archetype', label: 'Archetyp', values: ['Wojownicy', 'Czarodzieje', 'Cienie'] },
    ],
    selection: { archetype: [] },
  },
};

export default meta;
type Story = StoryObj<FilterBar>;

export const Default: Story = {};
