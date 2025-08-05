import { STAR_TYPES, STAR_CLASS_COLORS } from './data/stars.js';
import { generateStellarObject, randomInt, randomRange, StellarObject } from './stellar-object.js';
import { generateUniqueName } from './name-generator.js';

export class Star extends StellarObject {
  constructor() {
    const type = STAR_TYPES[randomInt(0, STAR_TYPES.length - 1)];
    const mass = randomRange(type.mass[0], type.mass[1]);
    const radius = randomRange(type.radius[0], type.radius[1]);
    super({
      class: type.class,
      typeName: type.name,
      name: generateUniqueName(),
      color: STAR_CLASS_COLORS[type.class],
      size: type.size,
      mass,
      luminosity: randomRange(type.luminosity[0], type.luminosity[1]),
      radius,
      gravity: mass / Math.pow(radius, 2),
      habitableZone: type.habitableZone
    });
    this.planets = [];
    const planetCount = randomInt(0, 10);
    for (let i = 0; i < planetCount; i++) {
      this.planets.push(
        generateStellarObject('planet', this, i, null, this.planets)
      );
    }
  }
}

export function generateStar() {
  return new Star();
}
