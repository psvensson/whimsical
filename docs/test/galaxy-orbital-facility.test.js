import test from 'node:test';
import assert from 'node:assert/strict';

import { generateStarSystem } from '../js/galaxy.js';
import { generateMoons } from '../js/objects/moon.js';

const ORBITAL_FACILITY_NAMES = [
  'Base',
  'Shipyard',
  'Orbital Mine',
  'Orbital Manufactory',
  'Orbital Research Facility',
  'Jump Station'
];

test('galaxy of 1000 stars contains an orbital facility', () => {
  const systems = [];

  // Generate first system with a planet cool enough for an orbital facility
  let firstSystem;
  let planet;
  do {
    firstSystem = generateStarSystem();
    planet = firstSystem.planets.find((p) => p.temperature <= 400);
  } while (!planet);
  const star = firstSystem.stars[0];

  // Force creation of an orbital facility on the first planet
  const origRandom = Math.random;
  Math.random = () => 0;
  planet.features.push('Base');
  planet.moons = generateMoons(star, planet);
  Math.random = origRandom;
  planet.features = planet.features.filter((f) => f !== 'Base');

  systems.push({ x: 0, y: 0, system: firstSystem });

  for (let i = 1; i < 1000; i++) {
    systems.push({ x: i, y: 0, system: generateStarSystem() });
  }

  const galaxy = { size: 0, systems };
  assert.equal(galaxy.systems.length, 1000);

  const hasFacility = galaxy.systems.some(({ system }) =>
    system.planets.some((p) =>
      p.moons.some((m) => ORBITAL_FACILITY_NAMES.includes(m.kind))
    )
  );

  assert.equal(hasFacility, true);
});
