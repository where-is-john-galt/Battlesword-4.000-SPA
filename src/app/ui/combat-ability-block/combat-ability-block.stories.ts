import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { CombatAbilityBlock } from './combat-ability-block';

const meta: Meta<CombatAbilityBlock> = {
  title: 'Components/CombatAbilityBlock',
  component: CombatAbilityBlock,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideHttpClient()] })],
  args: {
    ability: {
      name: 'Remiks',
      activationTime: 'Akcja',
      range: 'Bezpośredni',
      purchaseCost: '250 PD',
      description: 'Tworzy bojową miksturę i miota nią.',
      enhancements: ['+1 kość obrażeń - 1 Stamina'],
    },
  },
};

export default meta;
type Story = StoryObj<CombatAbilityBlock>;

export const Default: Story = {};
