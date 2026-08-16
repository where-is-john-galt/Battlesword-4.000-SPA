import type { Meta, StoryObj } from '@storybook/angular';
import { Tag } from './tag';

const meta: Meta<Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'gold', 'muted', 'danger'] },
  },
  args: { label: 'Nieumarły', variant: 'default' },
};

export default meta;
type Story = StoryObj<Tag>;

export const Default: Story = {};

export const Gold: Story = { args: { variant: 'gold' } };

export const Muted: Story = { args: { variant: 'muted' } };
