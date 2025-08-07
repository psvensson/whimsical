import { STAR_TYPES, STAR_CLASS_COLORS } from './data/stars.js';
import { generateStellarObject, randomInt, randomRange, StellarObject } from './stellar-object.js';
import { generateUniqueName } from './name-generator.js';

const MIN_PLANETS_PER_STAR = 0;
const MAX_PLANETS_PER_STAR = 10;

export class Star extends StellarObject {
  constructor() {
    const type = STAR_TYPES[randomInt(0, STAR_TYPES.length - 1)];
    const mass = randomRange(type.mass[0], type.mass[1]);
    const radius = randomRange(type.radius[0], type.radius[1]);
    const minGravity = type.mass[0] / Math.pow(type.radius[1], 2);
    const maxGravity = type.mass[1] / Math.pow(type.radius[0], 2);
    super({
      class: type.class,
      typeName: type.name,
      name: generateUniqueName(),
      color: STAR_CLASS_COLORS[type.class],
      size: type.size,
      mass,
      luminosity: randomRange(type.luminosity[0], type.luminosity[1]),
      radius,
      gravity: randomRange(minGravity, maxGravity),
      habitableZone: type.habitableZone,
      temperatureModifier: type.temperatureModifier
    });
    this.planets = [];
    const planetCount = randomInt(MIN_PLANETS_PER_STAR, MAX_PLANETS_PER_STAR);
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
