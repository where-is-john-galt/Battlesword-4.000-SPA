import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { CompendiumService } from '../../services/compendium.service';
import type { Stat } from '../../models/compendium';
import { GlossaryTooltip } from './glossary-tooltip';

const stats = signal<Stat[]>([
  {
    id: 'bariera',
    name: 'Bariera',
    group: 'trzeciorzędna',
    definition: 'Defensywny zasób postaci, pochłaniający obrażenia niezależnie od Punktów Życia.',
    source: 'mechaniki_bazowe/statystyki.md',
    status: 'detailed',
  },
]);

const compendiumMock = {
  stats,
  mechanics: signal([]),
  combat: signal([]),
  definitionOf: (type: string, id: string) =>
    type === 'stat' ? stats().find((entry) => entry.id === id)?.definition : undefined,
};

const meta: Meta<GlossaryTooltip> = {
  title: 'Components/GlossaryTooltip',
  component: GlossaryTooltip,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [{ provide: CompendiumService, useValue: compendiumMock }] }),
  ],
  args: { term: 'Bariera' },
};

export default meta;
type Story = StoryObj<GlossaryTooltip>;

export const Default: Story = {};

export const Linkable: Story = { args: { term: 'Bariera', linkable: true } };
