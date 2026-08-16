import { Component, input } from '@angular/core';
import type { BaseEntry, CompendiumType } from '../../../models/compendium';
import { RaceCard } from '../race-card/race-card';
import { ProfessionCard } from '../profession-card/profession-card';
import { ClassCard } from '../class-card/class-card';
import { PerkCard } from '../perk-card/perk-card';
import { WeaponCard } from '../weapon-card/weapon-card';
import { ArmorCard } from '../armor-card/armor-card';
import { BeltCard } from '../belt-card/belt-card';
import { HandItemCard } from '../hand-item-card/hand-item-card';
import { MagicItemCard } from '../magic-item-card/magic-item-card';
import { MiscItemCard } from '../misc-item-card/misc-item-card';
import { MonsterCard } from '../monster-card/monster-card';
import { GlossaryCard } from '../glossary-card/glossary-card';
import { StubCard } from '../stub-card/stub-card';

@Component({
  selector: 'app-entity-card',
  imports: [
    RaceCard,
    ProfessionCard,
    ClassCard,
    PerkCard,
    WeaponCard,
    ArmorCard,
    BeltCard,
    HandItemCard,
    MagicItemCard,
    MiscItemCard,
    MonsterCard,
    GlossaryCard,
    StubCard,
  ],
  templateUrl: './entity-card.html',
  styleUrl: './entity-card.scss',
})
export class EntityCard {
  readonly type = input.required<CompendiumType>();
  readonly entry = input.required<BaseEntry>();
}
