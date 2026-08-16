import type { CompendiumType } from './compendium';

export const TYPE_ICONS: Record<CompendiumType, string> = {
  race: 'player',
  profession: 'anvil',
  class: 'crossed-swords',
  perk: 'trophy',
  stat: 'dice-five',
  mechanic: 'scroll-unfurled',
  combat: 'sword',
  weapon: 'sword',
  armor: 'shield',
  belt: 'chain',
  handItem: 'hand',
  magicItem: 'crystal-wand',
  monster: 'monster-skull',
  miscItem: 'candle',
};

export const SECTION_ICONS: Record<string, string> = {
  postac: 'player',
  statystyki: 'dice-five',
  mechaniki: 'scroll-unfurled',
  ekwipunek: 'ammo-bag',
  walka: 'crossed-swords',
  bestiariusz: 'monster-skull',
  ulubione: 'two-hearts',
};

export function typeIcon(type: CompendiumType): string {
  return TYPE_ICONS[type];
}

export function sectionIcon(path: string): string {
  return SECTION_ICONS[path];
}
