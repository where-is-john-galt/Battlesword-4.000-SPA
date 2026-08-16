import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { CompendiumService } from '../../services/compendium.service';
import type { Rule } from '../../models/compendium';
import { LinkedText } from './linked-text';

const combat = signal<Rule[]>([
  {
    id: 'porażenie',
    name: 'Porażenie',
    definition:
      'Zwiększa otrzymywane obrażenia o 1 kostkę. Każde otrzymane obrażenia zmniejsza poziom statusu o 1.',
    source: 'walka/statusy.md',
    status: 'detailed',
    aliases: ['porażenia', 'porażeniem'],
  },
]);

const compendiumMock = {
  stats: signal([]),
  mechanics: signal([]),
  combat,
  definitionOf: (type: string, id: string) =>
    type === 'combat' ? combat().find((entry) => entry.id === id)?.definition : undefined,
};

const meta: Meta<LinkedText> = {
  title: 'Components/LinkedText',
  component: LinkedText,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [{ provide: CompendiumService, useValue: compendiumMock }] }),
  ],
  args: { text: 'Nakłada 1 poziom porażenia - 1 many' },
};

export default meta;
type Story = StoryObj<LinkedText>;

export const Default: Story = {};
