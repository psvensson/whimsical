import {
  PLANET_TYPES,
  PLANET_FEATURES,
  PLANET_RESOURCES,
  PLANET_ATMOSPHERES,
  MOON_RULES
} from './data/planets.js';

// Generate an orbital body around a star or another body. The same
// function is used for planets and moons; moons are simply bodies with
// a parent and are limited to one tenth of their parent's size.
export function generateBody(star, orbitIndex, parent = null, siblings = []) {
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
    minR = Math.min(minR, maxR);
  }
  let radius = randomRange(minR, maxR);

  // Determine final type based on resulting radius. Small bodies below 0.3
  // Earth radii have no atmosphere and can only be rocky or lava worlds.
  let type = rule.name;
  if (type === 'gas giant' && radius <= 4) {
    type = 'ice';
  }
  if (radius < 0.3) {
    type = Math.random() < 0.5 ? 'rocky' : 'lava';
  }

  const temperature =
    278 * Math.pow(star.luminosity, 0.25) / Math.sqrt(distance);
  const isHabitable =
    type === 'terrestrial' &&
    distance >= star.habitableZone[0] &&
    distance <= star.habitableZone[1];
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
  const atmosphere = radius < 0.3 ? null : generateAtmosphere(type);
  const body = {
    name: parent ? `Moon ${orbitIndex + 1}` : `Planet ${orbitIndex + 1}`,
    type,
    distance,
    radius,
    temperature,
    isHabitable,
    orbitalPeriod,
    features,
    angle,
    eccentricity,
    orbitRotation,
    resources,
    atmosphere,
    moons: []
  };
  if (!parent) {
    body.moons = generateChildren(star, body);
  }
  return body;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Choose a planet type based on distance and nearby neighbours.
// Objects closer to the star favour rocky types, while distant ones
// favour gaseous types. Large gas giants suppress the likelihood of
// nearby rocky worlds.
function selectRule(star, distance, prev) {
  const norm = Math.min(distance / (star.habitableZone[1] * 2), 1);
  const weights = PLANET_TYPES.map((t) => {
    let weight = t.bias === 'outer' ? norm : 1 - norm;
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
      if (['lava', 'rocky', 'terrestrial'].includes(w.rule.name)) {
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
    moons.push(generateBody(star, i, body, moons));
  }
  return moons;
}
