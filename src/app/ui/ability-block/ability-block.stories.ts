import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { AbilityBlock } from './ability-block';

const meta: Meta<AbilityBlock> = {
  title: 'Components/AbilityBlock',
  component: AbilityBlock,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideHttpClient()] })],
  args: {
    ability: {
      name: 'Ferwor wiary',
      description: 'W ramach akcji pozwala na wykonanie testu Szczęścia.',
      effects: ['+1 do statystyki', 'Uleczenie za 25%+1k4 HP'],
    },
  },
};

export default meta;
type Story = StoryObj<AbilityBlock>;

export const Default: Story = {};
