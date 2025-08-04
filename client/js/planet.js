import { PLANET_TYPES, PLANET_FEATURES } from './data/planets.js';

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
  return {
    type: rule.name,
    distance,
    radius,
    temperature,
    isHabitable,
    orbitalPeriod,
    features,
    angle
  };
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
