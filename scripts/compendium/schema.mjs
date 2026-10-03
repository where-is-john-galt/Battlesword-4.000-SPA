import ts from 'typescript';
import { resolve } from 'node:path';

export const categories = {
  race: ['rasy.json', 'Race'],
  profession: ['profesje.json', 'Profession'],
  class: ['klasy.json', 'CharacterClass'],
  perk: ['perki.json', 'Perk'],
  stat: ['statystyki.json', 'Stat'],
  mechanic: ['mechaniki.json', 'Rule'],
  combat: ['walka.json', 'Rule'],
  weapon: ['bron.json', 'Weapon'],
  armor: ['pancerze.json', 'Armor'],
  belt: ['paski.json', 'Belt'],
  handItem: ['przedmioty_podreczne.json', 'HandItem'],
  magicItem: ['przedmioty_magiczne.json', 'MagicItem'],
  monster: ['bestiariusz.json', 'Monster'],
  miscItem: ['reszta_ekwipunku.json', 'MiscItem'],
  inconsistency: ['niespojnosci.json', 'Inconsistency'],
};
export const sourceCategories = Object.keys(categories).filter((type) => type !== 'inconsistency');

// Compile the application's actual types, rather than maintaining a second data model.
// Fail closed if a future type uses constructs this small JSON Schema subset cannot express.
export function loadSchemas(root = process.cwd()) {
  const file = resolve(root, 'src/app/models/compendium.ts');
  const program = ts.createProgram([file], { strict: true, target: ts.ScriptTarget.ESNext });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(file);
  if (!source) throw new Error('Missing compendium TypeScript model');
  const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(source));
  const byName = new Map(exports.map((symbol) => [symbol.name, symbol]));
  function convert(type) {
    if (type.isUnion()) {
      const members = type.types.filter((member) => !(member.flags & ts.TypeFlags.Undefined));
      if (!members.length) throw new Error('Unsupported undefined-only model field');
      return { anyOf: members.map(convert) };
    }
    if (type.isStringLiteral() || type.isNumberLiteral()) return { const: type.value };
    if (type.flags & ts.TypeFlags.String) return { type: 'string' };
    if (type.flags & ts.TypeFlags.Number) return { type: 'number' };
    if (type.flags & ts.TypeFlags.Null) return { type: 'null' };
    if (checker.isArrayType(type)) {
      return { type: 'array', items: convert(checker.getTypeArguments(type)[0]) };
    }
    if (type.flags & ts.TypeFlags.Object) {
      if (type.getCallSignatures().length || checker.getIndexInfosOfType(type).length) {
        throw new Error(`Unsupported model: ${checker.typeToString(type)}`);
      }
      const properties = {};
      const required = [];
      for (const property of type.getProperties()) {
        properties[property.name] = convert(checker.getTypeOfSymbolAtLocation(property, source));
        if (!(property.flags & ts.SymbolFlags.Optional)) required.push(property.name);
      }
      return { type: 'object', properties, required, additionalProperties: false };
    }
    throw new Error(`Unsupported model: ${checker.typeToString(type)}`);
  }
  const types = checker.getDeclaredTypeOfSymbol(byName.get('CompendiumType'));
  const names = types.types.map((type) => type.value).sort();
  if (JSON.stringify(names) !== JSON.stringify(Object.keys(categories).sort())) {
    throw new Error('Update importer category mapping for the changed CompendiumType');
  }
  return Object.fromEntries(
    Object.entries(categories).map(([type, [, name]]) => {
      const symbol = byName.get(name);
      if (!symbol) throw new Error(`Missing model ${name}`);
      return [type, convert(checker.getDeclaredTypeOfSymbol(symbol))];
    }),
  );
}

export function validate(schema, value, path = '$') {
  if (schema.anyOf) {
    for (const option of schema.anyOf) {
      try {
        validate(option, value, path);
        return;
      } catch {
        /* Try the next union member. */
      }
    }
    throw new Error(`${path}: value does not match any allowed type`);
  }
  if (Object.hasOwn(schema, 'const')) {
    if (value !== schema.const)
      throw new Error(`${path}: expected ${JSON.stringify(schema.const)}`);
    return;
  }
  if (schema.type === 'array') {
    if (!Array.isArray(value)) throw new Error(`${path}: expected array`);
    value.forEach((item, index) => validate(schema.items, item, `${path}[${index}]`));
  } else if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${path}: expected object`);
    }
    for (const key of schema.required) {
      if (!Object.hasOwn(value, key)) throw new Error(`${path}.${key}: required`);
    }
    for (const [key, item] of Object.entries(value)) {
      if (!Object.hasOwn(schema.properties, key)) throw new Error(`${path}.${key}: unknown field`);
      validate(schema.properties[key], item, `${path}.${key}`);
    }
  } else if (schema.type === 'null' ? value !== null : typeof value !== schema.type) {
    throw new Error(`${path}: expected ${schema.type}`);
  } else if (schema.type === 'number' && !Number.isFinite(value)) {
    throw new Error(`${path}: expected finite number`);
  }
}

export const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
export const canonical = (value) => JSON.stringify(sortKeys(value));
export function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort(compare)
        .map((key) => [key, sortKeys(value[key])]),
    );
  }
  return value;
}

export function buildIndex(data) {
  return Object.entries(categories)
    .flatMap(([type]) =>
      data[type].map(({ id, name, source, status }) => ({ id, type, name, source, status })),
    )
    .sort((a, b) => compare(`${a.type}:${a.id}`, `${b.type}:${b.id}`));
}

export function validateData(data, schemas, sources) {
  for (const type of Object.keys(categories)) {
    validate({ type: 'array', items: schemas[type] }, data[type], type);
    const ids = new Set();
    for (const entry of data[type]) {
      if (!entry.id.trim() || !entry.name.trim() || /[\s/#?\\]/u.test(entry.id)) {
        throw new Error(`${type}: invalid ID or name: ${entry.id}`);
      }
      if (ids.has(entry.id)) throw new Error(`${type}: duplicate ID ${entry.id}`);
      ids.add(entry.id);
      if (!sources.has(entry.source))
        throw new Error(`${type}/${entry.id}: missing source ${entry.source}`);
      if (type === 'inconsistency') {
        if (!/^[a-f0-9]{40}$/.test(entry.revision)) {
          throw new Error(`inconsistency/${entry.id}: invalid source revision`);
        }
        if (
          !entry.relatedSources.includes(entry.source) ||
          entry.relatedSources.some((path) => !sources.has(path))
        ) {
          throw new Error(`inconsistency/${entry.id}: missing related source`);
        }
      }
    }
  }
}
