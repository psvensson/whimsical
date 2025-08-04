import {
  PLANET_TYPES,
  PLANET_FEATURES,
  PLANET_RESOURCES,
  PLANET_ATMOSPHERES
} from './data/planets.js';

export function generatePlanet(star, orbitIndex) {
  const distance = (orbitIndex + 1) * randomRange(0.3, 1.5); // in AU
  const rule = PLANET_TYPES.find((r) => distance <= r.maxDistance(star));
  const radius = randomRange(rule.radius[0], rule.radius[1]);

  const temperature =
    278 * Math.pow(star.luminosity, 0.25) / Math.sqrt(distance);
  const isHabitable =
    !!rule.habitable &&
    distance >= star.habitableZone[0] &&
    distance <= star.habitableZone[1];
  const orbitalPeriod = Math.sqrt(Math.pow(distance, 3) / star.mass); // in Earth years
  const features = PLANET_FEATURES.filter((f) => Math.random() < f.chance).map(
    (f) => f.name
  );
  const angle = Math.random() * Math.PI * 2;
  const resourceList = PLANET_RESOURCES[rule.name] || [];
  const resources = resourceList.reduce((acc, res) => {
    acc[res] = Math.floor(randomRange(0, 100));
    return acc;
  }, {});
  const atmosphere = generateAtmosphere(rule.name);
  const moons = generateMoons(star, distance, radius);
  return {
    type: rule.name,
    distance,
    radius,
    temperature,
    isHabitable,
    orbitalPeriod,
    features,
    angle,
    resources,
    atmosphere,
    moons
  };
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

function generateMoons(star, distance, planetRadius) {
  const maxMoons = planetRadius > 3 ? 5 : planetRadius > 1 ? 3 : 1;
  const count = randomInt(0, maxMoons);
  const moons = [];
  for (let i = 0; i < count; i++) {
    const radius = randomRange(0.1, Math.min(planetRadius * 0.5, 1.5));
    const typeRule =
      PLANET_TYPES.find((r) => distance <= r.maxDistance(star)) || PLANET_TYPES[0];
    const atmosphere = radius > 0.5 ? generateAtmosphere(typeRule.name) : null;
    moons.push({ name: `Moon ${i + 1}`, radius, atmosphere });
  }
  return moons;
}
