import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'large'] },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Explore', variant: 'default', disabled: false },
};

export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {};

export const Large: Story = { args: { variant: 'large' } };

export const Disabled: Story = { args: { disabled: true } };
