import { STAR_TYPES, STAR_CLASS_COLORS } from './data/stars.js';
import { generateStellarObject, randomInt, randomRange, StellarObject } from './stellar-object.js';

export class Star extends StellarObject {
  constructor() {
    const type = STAR_TYPES[randomInt(0, STAR_TYPES.length - 1)];
    super({
      class: type.class,
      name: type.name,
      color: STAR_CLASS_COLORS[type.class],
      size: type.size,
      mass: randomRange(type.mass[0], type.mass[1]),
      luminosity: randomRange(type.luminosity[0], type.luminosity[1]),
      radius: randomRange(type.radius[0], type.radius[1]),
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
