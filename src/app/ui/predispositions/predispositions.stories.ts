import type { Meta, StoryObj } from '@storybook/angular';
import { Predispositions } from './predispositions';

const meta: Meta<Predispositions> = {
  title: 'Components/Predispositions',
  component: Predispositions,
  tags: ['autodocs'],
  args: {
    predispositions: {
      primary: ['Inteligencja'],
      secondary: ['Majsterkowanie', 'Medycyna'],
      defensive: ['Unik'],
    },
  },
};

export default meta;
type Story = StoryObj<Predispositions>;

export const Default: Story = {};
