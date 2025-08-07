import { OrbitingBody } from './orbiting-body.js';
import { randomInt, randomRange, EARTH_MASS_IN_SOLAR } from './util.js';
import { MOON_RULES } from '../data/planets.js';
import { ORBITAL_FACILITY_CLASSES } from '../facilities/index.js';
import { MAX_PARENT_TEMPERATURE } from '../facilities/facility.js';

const MOON_GRAVITY_RATIO = 0.1;
const MOON_MIN_GRAVITY_FACTOR = 0.5;

export class Moon extends OrbitingBody {
  static kind = 'moon';

  static calculateGravity(parent) {
    const maxGravity = parent.gravity * MOON_GRAVITY_RATIO;
    const minGravity = maxGravity * MOON_MIN_GRAVITY_FACTOR;
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
  if (body.features && body.temperature <= MAX_PARENT_TEMPERATURE) {
    for (const feature of body.features) {
      const name = typeof feature === 'string' ? feature : feature.kind;
      const Facility = ORBITAL_FACILITY_CLASSES[name];
      if (Facility) {
        const facility = Facility.generate(star, moons.length, body);
        if (facility) moons.push(facility);
      }
    }
  }
  return moons;
}
