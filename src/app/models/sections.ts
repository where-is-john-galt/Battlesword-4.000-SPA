import type { CompendiumType } from './compendium';

export interface CategoryDef {
  path: string;
  label: string;
  type: CompendiumType;
}

export interface SectionDef {
  path: string;
  label: string;
  categories: CategoryDef[];
}

export const SECTIONS: SectionDef[] = [
  {
    path: 'postac',
    label: 'Postać',
    categories: [
      { path: 'rasy', label: 'Rasy', type: 'race' },
      { path: 'profesje', label: 'Profesje', type: 'profession' },
      { path: 'klasy', label: 'Klasy', type: 'class' },
      { path: 'perki', label: 'Perki', type: 'perk' },
    ],
  },
  {
    path: 'ekwipunek',
    label: 'Ekwipunek',
    categories: [
      { path: 'bron', label: 'Broń', type: 'weapon' },
      { path: 'pancerze', label: 'Pancerze', type: 'armor' },
      { path: 'paski', label: 'Paski', type: 'belt' },
      { path: 'przedmioty-podreczne', label: 'Przedmioty podręczne', type: 'handItem' },
      { path: 'przedmioty-magiczne', label: 'Przedmioty magiczne', type: 'magicItem' },
      { path: 'reszta-ekwipunku', label: 'Reszta ekwipunku', type: 'miscItem' },
    ],
  },
  {
    path: 'bestiariusz',
    label: 'Bestiariusz',
    categories: [{ path: 'bestiariusz', label: 'Bestiariusz', type: 'monster' }],
  },
  {
    path: 'glosariusz',
    label: 'Glosariusz',
    categories: [{ path: 'glosariusz', label: 'Glosariusz', type: 'glossary' }],
  },
];

export interface TypeMeta {
  section: string;
  sectionLabel: string;
  categoryLabel: string;
  categoryPath: string;
}

const TYPE_META: Record<CompendiumType, TypeMeta> = (() => {
  const map = {} as Record<CompendiumType, TypeMeta>;
  for (const section of SECTIONS) {
    for (const category of section.categories) {
      map[category.type] = {
        section: section.path,
        sectionLabel: section.label,
        categoryLabel: category.label,
        categoryPath: category.path,
      };
    }
  }
  return map;
})();

export function typeMeta(type: CompendiumType): TypeMeta {
  return TYPE_META[type];
}
