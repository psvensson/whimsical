import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

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

export function generateBodyName(parentName, orbitIndex) {
  if (Math.random() < 0.3) {
    return generateUniqueName();
  }
  return `${parentName} ${toRoman(orbitIndex + 1)}`;
}
