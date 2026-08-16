import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { FavoritesService } from '../../services/favorites.service';
import { FavoriteButton } from './favorite-button';

const meta: Meta<FavoriteButton> = {
  title: 'Components/FavoriteButton',
  component: FavoriteButton,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [FavoritesService] })],
  args: { type: 'race', id: 'człowiek' },
};

export default meta;
type Story = StoryObj<FavoriteButton>;

export const Default: Story = {};
