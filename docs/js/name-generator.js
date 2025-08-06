// Import the module using a relative path so that the browser can resolve it
// without a bundler or import maps. This fixes the "bare specifier" error
// when `name-generator.js` is loaded in the browser.
// Use the modern ES module build that ends with `.js` so that static servers
// correctly set the `Content-Type` header. The previous `index.m.js` extension
// caused the browser to block the module due to an empty MIME type.
import * as uniqueNamesGeneratorPkg from '../node_modules/unique-names-generator/dist/index.modern.js';
const { uniqueNamesGenerator, adjectives, animals } = uniqueNamesGeneratorPkg;

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
    if (Math.random() < 0.3) {
      return generateUniqueName();
    }
    return `${starName} ${toRoman(orbitIndex + 1)}`;
  }

  const planetHasOwnName = !parent.name.startsWith(`${starName} `);
  if (planetHasOwnName) {
    // moon around a uniquely named planet: 70% planet name + numeral
    if (Math.random() < 0.3) {
      return generateUniqueName();
    }
    return `${parent.name} ${toRoman(orbitIndex + 1)}`;
  }

  // moon around a star-named planet always has its own name
  return generateUniqueName();
}
