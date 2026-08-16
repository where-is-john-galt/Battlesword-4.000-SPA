import type { CompendiumType } from './compendium';

export const TYPE_ICONS: Record<CompendiumType, string> = {
  race: 'player',
  profession: 'anvil',
  class: 'crossed-swords',
  perk: 'trophy',
  weapon: 'sword',
  armor: 'shield',
  belt: 'chain',
  handItem: 'hand',
  magicItem: 'crystal-wand',
  monster: 'monster-skull',
  miscItem: 'candle',
  glossary: 'book',
};

export const SECTION_ICONS: Record<string, string> = {
  postac: 'player',
  ekwipunek: 'ammo-bag',
  bestiariusz: 'monster-skull',
  glosariusz: 'book',
  ulubione: 'two-hearts',
};

export function typeIcon(type: CompendiumType): string {
  return TYPE_ICONS[type];
}

export function sectionIcon(path: string): string {
  return SECTION_ICONS[path];
}
