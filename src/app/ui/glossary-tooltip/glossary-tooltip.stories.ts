import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { GlossaryTooltip } from './glossary-tooltip';

const meta: Meta<GlossaryTooltip> = {
  title: 'Components/GlossaryTooltip',
  component: GlossaryTooltip,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideHttpClient()] })],
  args: { term: 'Bariera' },
};

export default meta;
type Story = StoryObj<GlossaryTooltip>;

export const Default: Story = {};
