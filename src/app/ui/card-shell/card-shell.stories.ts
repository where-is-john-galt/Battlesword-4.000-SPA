import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { FavoritesService } from '../../services/favorites.service';
import { CardShell } from './card-shell';

const meta: Meta<CardShell> = {
  title: 'Components/CardShell',
  component: CardShell,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [FavoritesService] })],
  args: { type: 'race', id: 'człowiek' },
  render: (args) => ({
    props: args,
    template: `<app-card-shell [type]="type" [id]="id"><h3>Zawartość karty</h3></app-card-shell>`,
  }),
};

export default meta;
type Story = StoryObj<CardShell>;

export const Default: Story = {};
