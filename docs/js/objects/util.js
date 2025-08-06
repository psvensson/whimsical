import {
  PLANET_ATMOSPHERES,
  PLANET_PRESSURES,
  PLANET_TYPES
} from '../data/planets.js';

export const ATMOSPHERE_GRAVITY_THRESHOLD = 0.1;
export const EARTH_MASS_IN_SOLAR = 1 / 332946;

const SOLAR_SYSTEM_TEMPERATURES = [
  { distance: 0.39, temp: 440 }, // Mercury
  { distance: 0.72, temp: 737 }, // Venus
  { distance: 1, temp: 288 }, // Earth
  { distance: 1.52, temp: 210 }, // Mars
  { distance: 5.2, temp: 165 }, // Jupiter
  { distance: 9.58, temp: 134 }, // Saturn
  { distance: 19.22, temp: 76 }, // Uranus
  { distance: 30.05, temp: 72 } // Neptune
];

export function interpolateSolarTemperature(distance) {
  if (distance <= SOLAR_SYSTEM_TEMPERATURES[0].distance)
    return SOLAR_SYSTEM_TEMPERATURES[0].temp;
  for (let i = 1; i < SOLAR_SYSTEM_TEMPERATURES.length; i++) {
    const prev = SOLAR_SYSTEM_TEMPERATURES[i - 1];
    const curr = SOLAR_SYSTEM_TEMPERATURES[i];
    if (distance <= curr.distance) {
      const ratio =
        (distance - prev.distance) / (curr.distance - prev.distance);
      return prev.temp + ratio * (curr.temp - prev.temp);
    }
  }
  const last = SOLAR_SYSTEM_TEMPERATURES[SOLAR_SYSTEM_TEMPERATURES.length - 1];
  const prev = SOLAR_SYSTEM_TEMPERATURES[SOLAR_SYSTEM_TEMPERATURES.length - 2];
  const ratio = (distance - last.distance) / (last.distance - prev.distance);
  return Math.max(0, last.temp + ratio * (last.temp - prev.temp));
}

export function adjustPlanetType(type, temperature) {
  if (
    temperature > 373 &&
    (type === 'ice' || type === 'water')
  ) {
    return 'gas';
  }
  if (type === 'ice' && temperature > 273) {
    return 'water';
  }
  return type;
}

export class StellarObject {
  constructor(props) {
    Object.assign(this, props);
  }

  getAngleAt(timeYears = 0) {
    const period = this.orbitalPeriod || 0;
    const base = this.angle || 0;
    if (!period) return base;
    const delta = (timeYears / period) * Math.PI * 2;
    return base + delta;
  }

  getOrbitPosition(timeYears = 0) {
    const a = this.orbitDistance || 0;
    const e = this.eccentricity || 0;
    const theta = this.getAngleAt(timeYears);
    const r = a === 0 ? 0 : (a * (1 - e * e)) / (1 + e * Math.cos(theta));
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const rot = this.orbitRotation || 0;
    const xRot = x * Math.cos(rot) - y * Math.sin(rot);
    const yRot = x * Math.sin(rot) + y * Math.cos(rot);
    return { x: xRot, y: yRot, r, theta };
  }
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function generateAtmosphere(type) {
  const gases = PLANET_ATMOSPHERES[type];
  if (!gases || gases.length === 0) {
    return null;
  }
  const values = gases.map(() => Math.random());
  const sum = values.reduce((a, b) => a + b, 0);
  const composition = {};
  gases.forEach((g, i) => {
    let value = Math.floor((values[i] / sum) * 100);
    if (value === 100) value = 99;
    composition[g] = value;
  });
  return composition;
}

export function calculateAtmosphericPressure(type, gravity) {
  const rule = PLANET_PRESSURES[type] || PLANET_PRESSURES.default;
  if (rule.range) {
    return randomRange(rule.range[0], rule.range[1]);
  }
  if (rule.multiplier) {
    return gravity * rule.multiplier;
  }
  return gravity;
}

export function selectRule(star, distance, prev) {
  const norm = Math.min(distance / (star.habitableZone[1] * 2), 1);
  const weights = PLANET_TYPES.map((t) => {
    let weight = t.bias === 'outer' ? norm : 1 - norm;
    if (t.name === 'rocky') {
      weight *= 1 + (1 - norm);
    }
    if (distance > t.maxDistance(star)) weight = 0;
    return { rule: t, weight: Math.max(weight, 0) };
  });
  if (
    prev &&
    prev.type === 'gas' &&
    prev.radius > 6 &&
    Math.abs(distance - prev.distance) < 1
  ) {
    weights.forEach((w) => {
      if (
        ['rocky', 'terrestrial', 'martian', 'venusian'].includes(w.rule.name)
      ) {
        w.weight *= 0.2;
      }
    });
  }
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const { rule, weight } of weights) {
    if (r < weight) return rule;
    r -= weight;
  }
  return PLANET_TYPES[0];
}
