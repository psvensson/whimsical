import { OrbitingBody } from './orbiting-body.js';
import { randomInt, randomRange, EARTH_MASS_IN_SOLAR } from './util.js';
import { MOON_RULES } from '../data/planets.js';
import { Base } from './base.js';

export class Moon extends OrbitingBody {
  static kind = 'moon';

  static calculateGravity(parent) {
    const maxGravity = parent.gravity * 0.1;
    const minGravity = maxGravity * 0.5;
    return randomRange(minGravity, maxGravity);
  }

  static calculateOrbitalPeriod(step, distance, star, parent) {
    const parentMassInSolar = parent.mass * EARTH_MASS_IN_SOLAR;
    return Math.sqrt(Math.pow(step, 3) / parentMassInSolar);
  }

  static generate(star, orbitIndex, parent, siblings) {
    const body = super.generate(star, orbitIndex, parent, siblings);
    body.moons = generateMoons(star, body);
    return body;
  }
}

export function generateMoons(star, body) {
  let maxMoons = 0;
  for (const rule of MOON_RULES) {
    if (body.radius > rule.minRadius) {
      maxMoons = rule.maxMoons;
      break;
    }
  }
  const count = randomInt(0, maxMoons);
  const moons = [];
  for (let i = 0; i < count; i++) {
    moons.push(Moon.generate(star, i, body, moons));
  }
  if (body.features?.includes('base') && body.temperature <= 400) {
    const base = Base.generate(star, moons.length, body);
    if (base) moons.push(base);
  }
  return moons;
}
