import type { Meta, StoryObj } from '@storybook/angular';
import { DecoLine } from './deco-line';

const meta: Meta<DecoLine> = {
  title: 'Components/DecoLine',
  component: DecoLine,
  tags: ['autodocs'],
  argTypes: { width: { control: 'text' } },
  args: { width: '190px' },
};

export default meta;
type Story = StoryObj<DecoLine>;

export const Default: Story = {};
