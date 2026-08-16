import type { Meta, StoryObj } from '@storybook/angular';
import { Frame } from './frame';

const meta: Meta<Frame> = {
  title: 'Components/Frame',
  component: Frame,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'success', 'info', 'error'] },
  },
  args: { variant: 'default' },
};

export default meta;
type Story = StoryObj<Frame>;

const template = (content: string) => ({
  template: `<app-frame [variant]="variant">${content}</app-frame>`,
});

export const Default: Story = {
  render: (args) => ({ props: args, ...template('Framed content') }),
};

export const Success: Story = {
  args: { variant: 'success' },
  render: (args) => ({ props: args, ...template('Success state') }),
};

export const Info: Story = {
  args: { variant: 'info' },
  render: (args) => ({ props: args, ...template('Info state') }),
};

export const Error: Story = {
  args: { variant: 'error' },
  render: (args) => ({ props: args, ...template('Error state') }),
};
