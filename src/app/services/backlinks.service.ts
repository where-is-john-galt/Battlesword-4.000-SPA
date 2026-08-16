import { Injectable, computed, inject } from '@angular/core';
import type {
  Armor,
  Belt,
  CharacterClass,
  CombatAbility,
  CompendiumType,
  HandItem,
  MagicItem,
  Monster,
  NamedAbility,
  Perk,
  Profession,
  Race,
  Rule,
  Stat,
  Weapon,
} from '../models/compendium';
import { CompendiumService } from './compendium.service';
import { RulesLinkService } from './rules-link.service';

export interface Backlink {
  type: CompendiumType;
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class BacklinksService {
  private readonly compendium = inject(CompendiumService);
  private readonly rulesLink = inject(RulesLinkService);

  private readonly map = computed(() => {
    const backlinks = new Map<string, Backlink[]>();

    for (const entry of this.compendium.index()) {
      const snippets = this.snippetsOf(entry.type, entry.id);
      for (const snippet of snippets) {
        for (const token of this.rulesLink.linkify(snippet)) {
          if (!token.link) {
            continue;
          }
          const targetKey = `${token.link.type}:${token.link.id}`;
          const selfKey = `${entry.type}:${entry.id}`;
          if (targetKey === selfKey) {
            continue;
          }
          const list = backlinks.get(targetKey) ?? [];
          if (!list.some((b) => b.type === entry.type && b.id === entry.id)) {
            list.push({ type: entry.type, id: entry.id, name: entry.name });
          }
          backlinks.set(targetKey, list);
        }
      }
    }

    for (const list of backlinks.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    }

    return backlinks;
  });

  backlinksFor(type: CompendiumType, id: string): Backlink[] {
    return this.map().get(`${type}:${id}`) ?? [];
  }

  private snippetsOf(type: CompendiumType, id: string): string[] {
    const entry = this.compendium.byId(type, id);
    if (!entry) {
      return [];
    }
    const snippets: string[] = [];

    const pushAbility = (a?: NamedAbility) => {
      if (!a) {
        return;
      }
      if (a.description) {
        snippets.push(a.description);
      }
      for (const effect of a.effects ?? []) {
        snippets.push(effect);
      }
    };

    const pushCombatAbility = (a?: CombatAbility) => {
      if (!a) {
        return;
      }
      for (const requirement of a.requirements ?? []) {
        snippets.push(requirement);
      }
      for (const cost of a.activationCost ?? []) {
        snippets.push(cost);
      }
      if (a.description) {
        snippets.push(a.description);
      }
      for (const enhancement of a.enhancements ?? []) {
        snippets.push(enhancement);
      }
    };

    switch (type) {
      case 'race': {
        const r = entry as Race;
        for (const bonus of r.bonuses ?? []) {
          snippets.push(bonus);
        }
        for (const ability of r.passiveAbilities ?? []) {
          pushAbility(ability);
        }
        for (const ability of r.activeAbilities ?? []) {
          pushAbility(ability);
        }
        break;
      }
      case 'profession': {
        const p = entry as Profession;
        for (const item of p.startingEquipment ?? []) {
          snippets.push(item);
        }
        for (const ability of p.passiveAbilities ?? []) {
          pushAbility(ability);
        }
        for (const ability of p.activeAbilities ?? []) {
          pushAbility(ability);
        }
        pushAbility(p.professionalBreak);
        break;
      }
      case 'class': {
        const c = entry as CharacterClass;
        for (const item of c.startingEquipment ?? []) {
          snippets.push(item);
        }
        for (const line of c.hitPoints ?? []) {
          snippets.push(line);
        }
        for (const ability of c.combatAbilities?.starting ?? []) {
          pushCombatAbility(ability);
        }
        for (const ability of c.combatAbilities?.purchasable ?? []) {
          pushCombatAbility(ability);
        }
        for (const ability of c.explorationAbilities ?? []) {
          pushAbility(ability);
        }
        break;
      }
      case 'perk': {
        const p = entry as Perk;
        if (p.requirements) {
          snippets.push(p.requirements);
        }
        if (p.description) {
          snippets.push(p.description);
        }
        break;
      }
      case 'weapon': {
        const w = entry as Weapon;
        if (w.usage) {
          snippets.push(w.usage);
        }
        for (const feature of w.specialFeatures ?? []) {
          snippets.push(feature);
        }
        break;
      }
      case 'armor': {
        const a = entry as Armor;
        if (a.requirements) {
          snippets.push(a.requirements);
        }
        break;
      }
      case 'belt': {
        const b = entry as Belt;
        if (b.effect) {
          snippets.push(b.effect);
        }
        break;
      }
      case 'handItem': {
        const h = entry as HandItem;
        if (h.effect) {
          snippets.push(h.effect);
        }
        break;
      }
      case 'magicItem': {
        const m = entry as MagicItem;
        if (m.baseItem) {
          snippets.push(m.baseItem);
        }
        for (const effect of m.effects ?? []) {
          snippets.push(effect);
        }
        for (const modifier of m.modifiers ?? []) {
          snippets.push(modifier);
        }
        for (const effect of m.corrupted ?? []) {
          snippets.push(effect);
        }
        if (m.description) {
          snippets.push(m.description);
        }
        pushCombatAbility(m.newAbility ?? undefined);
        break;
      }
      case 'monster': {
        const m = entry as Monster;
        for (const ability of m.traits ?? []) {
          pushAbility(ability);
        }
        for (const action of m.actions ?? []) {
          if (action.effect) {
            snippets.push(action.effect);
          }
        }
        break;
      }
      case 'stat': {
        snippets.push((entry as Stat).definition);
        break;
      }
      case 'mechanic':
      case 'combat': {
        snippets.push((entry as Rule).definition);
        break;
      }
      case 'miscItem':
        break;
    }

    return snippets;
  }
}
