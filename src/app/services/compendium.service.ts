import { Injectable, inject, signal, type Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import type {
  Armor,
  BaseEntry,
  Belt,
  CharacterClass,
  CompendiumType,
  HandItem,
  IndexEntry,
  MagicItem,
  MiscItem,
  Monster,
  Perk,
  Profession,
  Race,
  Rule,
  Stat,
  Weapon,
} from '../models/compendium';

const DATA_FILES: Record<CompendiumType, string> = {
  race: 'rasy.json',
  profession: 'profesje.json',
  class: 'klasy.json',
  perk: 'perki.json',
  stat: 'statystyki.json',
  mechanic: 'mechaniki.json',
  combat: 'walka.json',
  weapon: 'bron.json',
  armor: 'pancerze.json',
  belt: 'paski.json',
  handItem: 'przedmioty_podreczne.json',
  magicItem: 'przedmioty_magiczne.json',
  monster: 'bestiariusz.json',
  miscItem: 'reszta_ekwipunku.json',
};

interface CompendiumData {
  races: Race[];
  professions: Profession[];
  classes: CharacterClass[];
  perks: Perk[];
  stats: Stat[];
  mechanics: Rule[];
  combat: Rule[];
  weapons: Weapon[];
  armor: Armor[];
  belts: Belt[];
  handItems: HandItem[];
  magicItems: MagicItem[];
  miscItems: MiscItem[];
  monsters: Monster[];
  index: IndexEntry[];
}

@Injectable({ providedIn: 'root' })
export class CompendiumService {
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly races = signal<Race[]>([]);
  readonly professions = signal<Profession[]>([]);
  readonly classes = signal<CharacterClass[]>([]);
  readonly perks = signal<Perk[]>([]);
  readonly stats = signal<Stat[]>([]);
  readonly mechanics = signal<Rule[]>([]);
  readonly combat = signal<Rule[]>([]);
  readonly weapons = signal<Weapon[]>([]);
  readonly armor = signal<Armor[]>([]);
  readonly belts = signal<Belt[]>([]);
  readonly handItems = signal<HandItem[]>([]);
  readonly magicItems = signal<MagicItem[]>([]);
  readonly miscItems = signal<MiscItem[]>([]);
  readonly monsters = signal<Monster[]>([]);
  readonly index = signal<IndexEntry[]>([]);

  private loaded = false;

  load(): void {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    this.loading.set(true);
    this.error.set(null);

    const url = (file: string) => `assets/data/${file}`;

    forkJoin({
      races: this.http.get<Race[]>(url(DATA_FILES.race)),
      professions: this.http.get<Profession[]>(url(DATA_FILES.profession)),
      classes: this.http.get<CharacterClass[]>(url(DATA_FILES.class)),
      perks: this.http.get<Perk[]>(url(DATA_FILES.perk)),
      stats: this.http.get<Stat[]>(url(DATA_FILES.stat)),
      mechanics: this.http.get<Rule[]>(url(DATA_FILES.mechanic)),
      combat: this.http.get<Rule[]>(url(DATA_FILES.combat)),
      weapons: this.http.get<Weapon[]>(url(DATA_FILES.weapon)),
      armor: this.http.get<Armor[]>(url(DATA_FILES.armor)),
      belts: this.http.get<Belt[]>(url(DATA_FILES.belt)),
      handItems: this.http.get<HandItem[]>(url(DATA_FILES.handItem)),
      magicItems: this.http.get<MagicItem[]>(url(DATA_FILES.magicItem)),
      miscItems: this.http.get<MiscItem[]>(url(DATA_FILES.miscItem)),
      monsters: this.http.get<Monster[]>(url(DATA_FILES.monster)),
      index: this.http.get<IndexEntry[]>(url('index.json')),
    }).subscribe({
      next: (data: CompendiumData) => {
        this.races.set(data.races);
        this.professions.set(data.professions);
        this.classes.set(data.classes);
        this.perks.set(data.perks);
        this.stats.set(data.stats);
        this.mechanics.set(data.mechanics);
        this.combat.set(data.combat);
        this.weapons.set(data.weapons);
        this.armor.set(data.armor);
        this.belts.set(data.belts);
        this.handItems.set(data.handItems);
        this.magicItems.set(data.magicItems);
        this.miscItems.set(data.miscItems);
        this.monsters.set(data.monsters);
        this.index.set(data.index);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set('Nie udało się załadować danych kompendium.');
        this.loading.set(false);
      },
    });
  }

  byType(type: CompendiumType): Signal<BaseEntry[]> {
    switch (type) {
      case 'race':
        return this.races;
      case 'profession':
        return this.professions;
      case 'class':
        return this.classes;
      case 'perk':
        return this.perks;
      case 'stat':
        return this.stats;
      case 'mechanic':
        return this.mechanics;
      case 'combat':
        return this.combat;
      case 'weapon':
        return this.weapons;
      case 'armor':
        return this.armor;
      case 'belt':
        return this.belts;
      case 'handItem':
        return this.handItems;
      case 'magicItem':
        return this.magicItems;
      case 'monster':
        return this.monsters;
      case 'miscItem':
        return this.miscItems;
    }
  }

  byId(type: CompendiumType, id: string): BaseEntry | undefined {
    return this.byType(type)().find((entry) => entry.id === id);
  }

  definitionOf(type: CompendiumType, id: string): string | undefined {
    if (type === 'stat') {
      return this.stats().find((entry) => entry.id === id)?.definition;
    }
    if (type === 'mechanic') {
      return this.mechanics().find((entry) => entry.id === id)?.definition;
    }
    if (type === 'combat') {
      return this.combat().find((entry) => entry.id === id)?.definition;
    }
    return undefined;
  }

  resolveByName(name: string): IndexEntry | undefined {
    const normalized = normalizeName(name);
    return this.index().find((entry) => normalizeName(entry.name) === normalized);
  }
}

function normalizeName(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function cleanItemName(name: string): string {
  return name
    .replace(/^\[[^\]]+\]\s*/g, '')
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .trim();
}
