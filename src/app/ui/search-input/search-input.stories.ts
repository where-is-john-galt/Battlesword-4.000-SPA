import type { Meta, StoryObj } from '@storybook/angular';
import { SearchInput } from './search-input';

const meta: Meta<SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    submitted: { action: 'submitted' },
  },
  args: { placeholder: 'Szukaj...' },
};

export default meta;
type Story = StoryObj<SearchInput>;

export const Default: Story = {};
