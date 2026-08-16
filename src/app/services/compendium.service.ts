import { Injectable, inject, signal, type Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import type {
  Armor,
  BaseEntry,
  Belt,
  CharacterClass,
  CompendiumType,
  GlossaryEntry,
  HandItem,
  IndexEntry,
  MagicItem,
  MiscItem,
  Monster,
  Perk,
  Profession,
  Race,
  Weapon,
} from '../models/compendium';

const DATA_FILES: Record<CompendiumType, string> = {
  race: 'rasy.json',
  profession: 'profesje.json',
  class: 'klasy.json',
  perk: 'perki.json',
  weapon: 'bron.json',
  armor: 'pancerze.json',
  belt: 'paski.json',
  handItem: 'przedmioty_podreczne.json',
  magicItem: 'przedmioty_magiczne.json',
  monster: 'bestiariusz.json',
  miscItem: 'reszta_ekwipunku.json',
  glossary: 'glosariusz.json',
};

interface CompendiumData {
  races: Race[];
  professions: Profession[];
  classes: CharacterClass[];
  perks: Perk[];
  weapons: Weapon[];
  armor: Armor[];
  belts: Belt[];
  handItems: HandItem[];
  magicItems: MagicItem[];
  miscItems: MiscItem[];
  monsters: Monster[];
  glossary: GlossaryEntry[];
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
  readonly weapons = signal<Weapon[]>([]);
  readonly armor = signal<Armor[]>([]);
  readonly belts = signal<Belt[]>([]);
  readonly handItems = signal<HandItem[]>([]);
  readonly magicItems = signal<MagicItem[]>([]);
  readonly miscItems = signal<MiscItem[]>([]);
  readonly monsters = signal<Monster[]>([]);
  readonly glossary = signal<GlossaryEntry[]>([]);
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
      weapons: this.http.get<Weapon[]>(url(DATA_FILES.weapon)),
      armor: this.http.get<Armor[]>(url(DATA_FILES.armor)),
      belts: this.http.get<Belt[]>(url(DATA_FILES.belt)),
      handItems: this.http.get<HandItem[]>(url(DATA_FILES.handItem)),
      magicItems: this.http.get<MagicItem[]>(url(DATA_FILES.magicItem)),
      miscItems: this.http.get<MiscItem[]>(url(DATA_FILES.miscItem)),
      monsters: this.http.get<Monster[]>(url(DATA_FILES.monster)),
      glossary: this.http.get<GlossaryEntry[]>(url(DATA_FILES.glossary)),
      index: this.http.get<IndexEntry[]>(url('index.json')),
    }).subscribe({
      next: (data: CompendiumData) => {
        this.races.set(data.races);
        this.professions.set(data.professions);
        this.classes.set(data.classes);
        this.perks.set(data.perks);
        this.weapons.set(data.weapons);
        this.armor.set(data.armor);
        this.belts.set(data.belts);
        this.handItems.set(data.handItems);
        this.magicItems.set(data.magicItems);
        this.miscItems.set(data.miscItems);
        this.monsters.set(data.monsters);
        this.glossary.set(data.glossary);
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
      case 'glossary':
        return this.glossary;
    }
  }

  byId(type: CompendiumType, id: string): BaseEntry | undefined {
    return this.byType(type)().find((entry) => entry.id === id);
  }
}
