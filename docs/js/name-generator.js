// The `unique-names-generator` package ships multiple builds.  The browser can
// load the modern ES module version, but Node.js (used by the tests) cannot
// parse that file because the package does not declare itself as an ES module.
// To support both environments we dynamically import the appropriate build:
//
//   - In the browser we use the modern ESM bundle so that a plain static server
//     can resolve the module without bundling or import maps.
//   - In Node.js we fall back to the UMD build, which can be loaded in a CommonJS
//     context.  When imported via ESM it exposes its contents on the `default`
//     export.  The tests run under Node with JSDOM, which defines `window`, so
//     Node detection is performed using `process.versions` instead of checking
//     for `window`.
//
// Top‑level `await` is used so that by the time this module's exports are
// consumed the dictionary is already available.
let uniqueNamesGenerator, adjectives, animals;
const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;
const UNIQUE_NAME_CHANCE = 0.3;
if (isNode) {
  ({ default: { uniqueNamesGenerator, adjectives, animals } } =
    await import(
      '../node_modules/unique-names-generator/dist/index.umd.js'
    ));
} else {
  ({ uniqueNamesGenerator, adjectives, animals } = await import(
    '../node_modules/unique-names-generator/dist/index.modern.js'
  ));
}

export function generateUniqueName() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: 'capital',
    separator: ' '
  });
}

export function toRoman(num) {
  const romans = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1]
  ];
  let result = '';
  for (const [letter, value] of romans) {
    while (num >= value) {
      result += letter;
      num -= value;
    }
  }
  return result;
}

export function generateBodyName(starName, orbitIndex, parent = null) {
  if (!parent) {
    // planet naming: 70% star name + numeral, 30% unique
    if (Math.random() < UNIQUE_NAME_CHANCE) {
      return generateUniqueName();
    }
    return `${starName} ${toRoman(orbitIndex + 1)}`;
  }

  const planetHasOwnName = !parent.name.startsWith(`${starName} `);
  if (planetHasOwnName) {
    // moon around a uniquely named planet: 70% planet name + numeral
    if (Math.random() < UNIQUE_NAME_CHANCE) {
      return generateUniqueName();
    }
    return `${parent.name} ${toRoman(orbitIndex + 1)}`;
  }

  // moon around a star-named planet always has its own name
  return generateUniqueName();
}
