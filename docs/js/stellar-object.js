import {
  PLANET_TYPES,
  PLANET_FEATURES,
  PLANET_RESOURCES,
  PLANET_ATMOSPHERES,
  MOON_RULES
} from './data/planets.js';
import { generateBodyName } from './name-generator.js';

export const ATMOSPHERE_GRAVITY_THRESHOLD = 0.1;

export class StellarObject {
  constructor(props) {
    Object.assign(this, props);
  }
}

// Generic generator for planets, moons and bases including their orbiting bodies
export function generateStellarObject(
  kind,
  star = null,
  orbitIndex = 0,
  parent = null,
  siblings = []
) {
  if (kind === 'base') {
    const orbitDistance = (orbitIndex + 1) * randomRange(0.001, 0.01);
    const distance = parent.distance + orbitDistance;
    const angle = Math.random() * Math.PI * 2;
    const eccentricity = Math.random() * 0.01;
    const orbitRotation = Math.random() * Math.PI * 2;
    const body = new StellarObject({
      name: `Base ${orbitIndex + 1}`,
      kind: 'base',
      type: 'base',
      distance,
      orbitDistance,
      radius: 0.05,
      gravity: parent.gravity,
      temperature: parent.temperature,
      temperatureSpan: parent.temperatureSpan,
      isHabitable: true,
      orbitalPeriod: Math.sqrt(Math.pow(distance, 3) / star.mass),
      features: [],
      angle,
      eccentricity,
      orbitRotation,
      resources: {},
      atmosphere: null,
      atmosphericPressure: 0,
      moons: [],
      population: Math.floor(randomRange(100, 1000))
    });
    return body;
  }

  // planet or moon generation
  const baseDistance = parent ? parent.distance : 0;
  const step = parent
    ? (orbitIndex + 1) * randomRange(0.01, 0.2)
    : (orbitIndex + 1) * randomRange(0.3, 1.5); // in AU
  const distance = parent ? baseDistance + step : step;
  const prev = siblings[siblings.length - 1];

  const rule = selectRule(star, distance, prev);
  let minR = rule.radius[0];
  let maxR = rule.radius[1];
  if (parent) {
    maxR = Math.min(maxR, parent.radius * 0.1);
    minR = Math.min(minR, maxR * 0.5);
    if (maxR - minR < 0.01) {
      maxR = maxR * 1.2;
      minR = maxR * 0.5;
    }
  }
  let radius = randomRange(minR, maxR);
  let attempts = 0;
  while (
    siblings.some((s) => Math.abs(s.radius - radius) < 0.01) &&
    attempts < 5
  ) {
    radius = randomRange(minR, maxR);
    attempts++;
  }
  radius = Math.min(Math.max(radius, minR), maxR);

  let type = rule.name;
  if (type === 'gas giant' && radius <= 4) {
    type = 'ice';
  }
  if (radius < 0.3) {
    const smallTypes = ['rocky', 'martian', 'venusian'];
    type = smallTypes[randomInt(0, smallTypes.length - 1)];
  }

  const baseTemperature =
    278 * Math.pow(star.luminosity, 0.25) / Math.sqrt(distance);
  const parentInfluence = parent ? (parent.gravity / step) * 10 : 0;
  const temperature = baseTemperature + parentInfluence;
  const temperatureSpan = 50 / distance + parentInfluence * 0.1;
  const mass = Math.pow(radius, 3);
  let gravity;
  if (kind === 'moon' && parent) {
    const maxGravity = parent.gravity * 0.1;
    const minGravity = maxGravity * 0.5;
    gravity = randomRange(minGravity, maxGravity);
  } else {
    gravity = randomRange(0.1, 3);
  }
  const isHabitable =
    type === 'terrestrial' &&
    distance >= star.habitableZone[0] &&
    distance <= star.habitableZone[1] &&
    gravity >= 0.5 &&
    gravity <= 1.5 &&
    temperature >= 260 &&
    temperature <= 320;
  const orbitalPeriod = Math.sqrt(Math.pow(distance, 3) / star.mass); // in Earth years
  const features = PLANET_FEATURES.filter((f) => Math.random() < f.chance).map(
    (f) => f.name
  );
  const angle = Math.random() * Math.PI * 2;
  const eccentricity = Math.random() ** 2 * 0.6;
  const orbitRotation = Math.random() * Math.PI * 2;
  const resourceList = PLANET_RESOURCES[type] || [];
  const resources = resourceList.reduce((acc, res) => {
    acc[res] = Math.floor(randomRange(0, 100));
    return acc;
  }, {});
  const hasAtmosphere =
    gravity >= ATMOSPHERE_GRAVITY_THRESHOLD &&
    (PLANET_ATMOSPHERES[type] || []).length > 0;
  const atmosphere = hasAtmosphere ? generateAtmosphere(type) : null;
  let atmosphericPressure = 0;
  if (hasAtmosphere) {
    if (type === 'martian') {
      atmosphericPressure = randomRange(0.01, 0.3);
    } else if (type === 'venusian') {
      atmosphericPressure = randomRange(5, 10);
    } else {
      atmosphericPressure = gravity * 1.2;
    }
  }
  const name = generateBodyName(star.name, orbitIndex, parent);
  const body = new StellarObject({
    name,
    kind,
    type,
    distance,
    radius,
    gravity,
    mass,
    temperature,
    temperatureSpan,
    isHabitable,
    orbitalPeriod,
    features,
    angle,
    eccentricity,
    orbitRotation,
    resources,
    atmosphere,
    atmosphericPressure,
    moons: []
  });
  body.moons = generateChildren(star, body);
  return body;
}

function generateChildren(star, body) {
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
    moons.push(generateStellarObject('moon', star, i, body, moons));
  }
  if (body.features?.includes('base')) {
    moons.push(generateStellarObject('base', star, moons.length, body, moons));
  }
  return moons;
}

function generateAtmosphere(type) {
  const gases = PLANET_ATMOSPHERES[type];
  if (!gases || gases.length === 0) {
    return null;
  }
  const values = gases.map(() => Math.random());
  const sum = values.reduce((a, b) => a + b, 0);
  const composition = {};
  gases.forEach((g, i) => {
    composition[g] = Math.round((values[i] / sum) * 100);
  });
  return composition;
}

function selectRule(star, distance, prev) {
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
    prev.type === 'gas giant' &&
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

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

