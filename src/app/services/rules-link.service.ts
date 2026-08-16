import { Injectable, computed, inject } from '@angular/core';
import type { CompendiumType } from '../models/compendium';
import { CompendiumService } from './compendium.service';

export interface LinkTarget {
  type: CompendiumType;
  id: string;
}

export interface LinkToken {
  text: string;
  link?: LinkTarget;
}

interface TermEntry {
  normalized: string;
  target: LinkTarget;
}

const ENTITY_LINK_TYPES: readonly CompendiumType[] = ['weapon', 'armor', 'magicItem', 'handItem'];

const ENTITY_ALIASES: Record<string, string[]> = {
  kostur: ['kostura', 'kosturem'],
  sztylet: ['sztyletu', 'sztyletem'],
  rapier: ['rapieru', 'rapierem'],
  buława: ['buławy', 'buławą'],
  glewia: ['glewii', 'glewią'],
  berło: ['berła', 'berłem'],
  włócznia: ['włóczni', 'włócznią'],
  różdżka: ['różdżki', 'różdżką'],
  siekiera: ['siekiery', 'siekiery'],
  topór: ['topora', 'toporem'],
  szpony: ['szponów', 'szponami'],
  kopia: ['kopii', 'kopią'],
  lanca: ['lancy', 'lancą'],
  łuk: ['łuku', 'łukiem'],
  kusza: ['kuszy', 'kuszą'],
  pistolet: ['pistoletu', 'pistoletem'],
  muszkiet: ['muszkietu', 'muszkietem'],
  'długi miecz': ['długiego miecza', 'długim mieczem'],
  'krótki miecz': ['krótkiego miecza', 'krótkim mieczem'],
  'miecz dwuręczny': ['miecza dwuręcznego', 'mieczem dwuręcznym'],
  'sztylet sprężynowy': ['sztyletu sprężynowego'],
  'broń rzucana': ['broni rzucanej'],
  skórznia: ['skórni', 'skórnią'],
  kolczuga: ['kolczugi', 'kolczugą'],
  'zbroja łuskowa': ['zbroi łuskowej'],
  'zbroja płytowa': ['zbroi płytowej'],
  'kurtka pikowana': ['kurtki pikowanej'],
  'tarcza metalowa': ['tarczy metalowej'],
  'tarcza drewniana': ['tarczy drewnianej'],
};

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function isWordChar(char: string): boolean {
  return /^[a-z0-9]$/.test(char) || char === 'ł';
}

@Injectable({ providedIn: 'root' })
export class RulesLinkService {
  private readonly compendium = inject(CompendiumService);

  private readonly terms = computed<TermEntry[]>(() => {
    const entries: TermEntry[] = [];

    const add = (type: CompendiumType, name: string, aliases: readonly string[] | undefined, id: string) => {
      const forms = [name, ...(aliases ?? [])];
      for (const form of forms) {
        if (!form) {
          continue;
        }
        const normalized = normalize(form);
        if (normalized && !entries.some((e) => e.normalized === normalized)) {
          entries.push({ normalized, target: { type, id } });
        }
      }
    };

    for (const stat of this.compendium.stats()) {
      add('stat', stat.name, stat.aliases, stat.id);
    }
    for (const rule of this.compendium.mechanics()) {
      add('mechanic', rule.name, rule.aliases, rule.id);
    }
    for (const rule of this.compendium.combat()) {
      add('combat', rule.name, rule.aliases, rule.id);
    }

    for (const entry of this.compendium.index()) {
      if (!ENTITY_LINK_TYPES.includes(entry.type)) {
        continue;
      }
      add(entry.type, entry.name, ENTITY_ALIASES[normalize(entry.name)], entry.id);
    }

    return entries.sort((a, b) => b.normalized.length - a.normalized.length);
  });

  resolve(term: string): LinkTarget | undefined {
    if (!term) {
      return undefined;
    }
    const normalized = normalize(term);
    return this.terms().find((entry) => entry.normalized === normalized)?.target;
  }

  linkify(text: string): LinkToken[] {
    if (!text) {
      return [{ text: '' }];
    }
    const terms = this.terms();
    if (terms.length === 0) {
      return [{ text }];
    }

    const nText = normalize(text);
    const matches: { start: number; end: number; term: TermEntry }[] = [];
    let i = 0;
    while (i < nText.length) {
      let matched = false;
      for (const term of terms) {
        const end = i + term.normalized.length;
        if (end > nText.length || nText.slice(i, end) !== term.normalized) {
          continue;
        }
        const leftOk = i === 0 || !isWordChar(nText[i - 1]);
        const rightOk = end === nText.length || !isWordChar(nText[end]);
        if (leftOk && rightOk) {
          matches.push({ start: i, end, term });
          i = end;
          matched = true;
          break;
        }
      }
      if (!matched) {
        i += 1;
      }
    }

    if (matches.length === 0) {
      return [{ text }];
    }

    const tokens: LinkToken[] = [];
    let cursor = 0;
    for (const match of matches) {
      if (match.start > cursor) {
        tokens.push({ text: text.slice(cursor, match.start) });
      }
      tokens.push({
        text: text.slice(match.start, match.end),
        link: match.term.target,
      });
      cursor = match.end;
    }
    if (cursor < text.length) {
      tokens.push({ text: text.slice(cursor) });
    }
    return tokens;
  }
}
