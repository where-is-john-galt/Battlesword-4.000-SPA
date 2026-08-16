import type { Meta, StoryObj } from '@storybook/angular';
import { Icon } from './icon';

const meta: Meta<Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'radio', options: [undefined, 'lg', '2x', '3x', '4x', '5x'] },
    fixedWidth: { control: 'boolean' },
  },
  args: { name: 'sword' },
};

export default meta;
type Story = StoryObj<Icon>;

export const Default: Story = {};

export const Sized: Story = { args: { name: 'sword', size: '3x' } };

export const FixedWidth: Story = { args: { name: 'shield', fixedWidth: true } };

export const ByType: Story = { args: { type: 'magicItem' } };
