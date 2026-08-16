export type EntryStatus = 'detailed' | 'stub';

export type CompendiumType =
  | 'race'
  | 'profession'
  | 'class'
  | 'perk'
  | 'weapon'
  | 'armor'
  | 'belt'
  | 'handItem'
  | 'magicItem'
  | 'monster'
  | 'miscItem'
  | 'glossary';

export interface BaseEntry {
  id: string;
  name: string;
  source: string;
  status: EntryStatus;
}

export interface NamedAbility {
  name?: string;
  description: string;
  effects?: string[];
}

export interface Predispositions {
  primary: string[];
  secondary: string[];
  defensive?: string[];
}

export interface Race extends BaseEntry {
  bonuses?: string[];
  size?: string;
  passiveAbilities?: NamedAbility[];
  activeAbilities?: NamedAbility[];
  resistances?: string[];
  vulnerabilities?: string[];
}

export interface Profession extends BaseEntry {
  predispositions?: Predispositions;
  startingWealth?: number;
  fame?: number;
  passiveAbilities?: NamedAbility[];
  activeAbilities?: NamedAbility[];
  startingEquipment?: string[];
  professionalBreak?: NamedAbility;
}

export interface CombatAbility {
  name: string;
  activationTime?: string;
  duration?: string;
  range?: string;
  area?: string;
  requirements?: string[];
  activationCost?: string[];
  purchaseCost?: string;
  description?: string;
  enhancements?: string[];
}

export interface CharacterClass extends BaseEntry {
  archetype?: string | null;
  predispositions?: Predispositions;
  startingEquipment?: string[];
  hitPoints?: string[];
  combatAbilities?: {
    starting: CombatAbility[];
    purchasable: CombatAbility[];
  };
  explorationAbilities?: NamedAbility[];
}

export interface Perk extends BaseEntry {
  requirements?: string;
  cost?: string;
  description?: string;
}

export interface Weapon extends BaseEntry {
  category: 'Biała' | 'Zasięgowa';
  damage?: string;
  usage?: string;
  baseStat?: string;
  range?: string;
  specialFeatures?: string[];
  requiredWealth?: number;
}

export interface Armor extends BaseEntry {
  category: string;
  requirements?: string;
  requiredWealth?: number;
  barrier?: number;
  armor?: number;
}

export interface Belt extends BaseEntry {
  requiredWealth?: number;
  handItemSlots?: number;
  effect?: string;
}

export interface HandItem extends BaseEntry {
  category: string;
  requiredWealth?: number;
  uses?: number;
  effect?: string;
}

export interface MagicItem extends BaseEntry {
  type: string;
  rarity: string;
  damage?: string;
  usage?: string;
  baseStat?: string;
  range?: string;
  specialFeatures?: string[];
  armor?: number;
  barrier?: number;
  requirements?: string;
  handItemSlots?: number;
  effects?: string[];
  modifiers?: string[];
  corrupted?: string[];
  newAbility?: CombatAbility | null;
  description?: string;
}

export interface MonsterAction {
  name: string;
  range?: string;
  test?: string;
  effect?: string;
}

export interface Monster extends BaseEntry {
  tier?: string;
  tags?: string[];
  size?: string;
  resistances?: string[];
  vulnerabilities?: string[];
  hp?: string;
  armor?: string;
  traits?: NamedAbility[];
  actions?: MonsterAction[];
}

export interface MiscItem extends BaseEntry {
  requiredWealth?: number;
}

export interface GlossaryEntry extends BaseEntry {
  term: string;
  definition: string;
}

export interface IndexEntry {
  id: string;
  type: CompendiumType;
  name: string;
  source: string;
  status: EntryStatus;
}
