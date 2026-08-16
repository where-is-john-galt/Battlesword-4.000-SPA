import type { Meta, StoryObj } from '@storybook/angular';
import { Heading } from './heading';

const meta: Meta<Heading> = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4] },
    text: { control: 'text' },
    gradient: { control: 'boolean' },
  },
  args: { level: 2, text: 'A Grand Adventure', gradient: false },
};

export default meta;
type Story = StoryObj<Heading>;

export const H1: Story = { args: { level: 1 } };

export const H2: Story = {};

export const H3: Story = { args: { level: 3 } };

export const H4: Story = { args: { level: 4 } };

export const Gradient: Story = { args: { gradient: true } };
