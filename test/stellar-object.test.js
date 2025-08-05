import test from 'node:test';
import assert from 'node:assert/strict';

import { generateStellarObject } from '../client/js/stellar-object.js';
import { STAR_TYPES, STAR_CLASS_COLORS } from '../client/js/data/stars.js';
import {
  PLANET_TYPES,
  PLANET_RESOURCES,
  PLANET_ATMOSPHERES,
  MOON_RULES,
  PLANET_FEATURES
} from '../client/js/data/planets.js';

const planetTypeNames = PLANET_TYPES.map((t) => t.name);
const featureNames = PLANET_FEATURES.map((f) => f.name);

function expectedMaxMoons(radius) {
  for (const rule of MOON_RULES) {
    if (radius > rule.minRadius) {
      return rule.maxMoons;
    }
  }
  return 0;
}

function validateBody(body, star) {
  assert.ok(planetTypeNames.includes(body.type));
  const rule = PLANET_TYPES.find((t) => t.name === body.type);
  if (body.name.startsWith('Planet')) {
    assert.ok(body.radius >= rule.radius[0] && body.radius <= rule.radius[1]);
  }
  assert.ok(body.distance > 0);
  assert.ok(Array.isArray(body.features));
  body.features.forEach((f) => assert.ok(featureNames.includes(f)));

  const resourceList = PLANET_RESOURCES[body.type] || [];
  for (const [res, amount] of Object.entries(body.resources)) {
    assert.ok(resourceList.includes(res));
    assert.ok(Number.isInteger(amount));
    assert.ok(amount >= 0 && amount < 100);
  }

  if (body.radius < 0.3) {
    assert.equal(body.atmosphere, null);
  } else if (PLANET_ATMOSPHERES[body.type]?.length) {
    assert.notEqual(body.atmosphere, null);
  } else {
    assert.equal(body.atmosphere, null);
  }

  const inHZ =
    body.distance >= star.habitableZone[0] &&
    body.distance <= star.habitableZone[1];
  if (body.type === 'terrestrial' && inHZ) {
    assert.equal(body.isHabitable, true);
  } else {
    assert.equal(body.isHabitable, false);
  }

  const maxMoons = expectedMaxMoons(body.radius);
  assert.ok(body.moons.length <= maxMoons);
  body.moons.forEach((m) => validateBody(m, star));
}

test('generate star with valid planets and moons', () => {
  const star = generateStellarObject('star');
  const starType = STAR_TYPES.find((s) => s.class === star.class);
  assert.ok(starType);
  assert.equal(star.name, starType.name);
  assert.equal(star.color, STAR_CLASS_COLORS[star.class]);
  assert.ok(star.mass >= starType.mass[0] && star.mass <= starType.mass[1]);
  assert.ok(
    star.luminosity >= starType.luminosity[0] &&
      star.luminosity <= starType.luminosity[1]
  );
  assert.ok(star.radius >= starType.radius[0] && star.radius <= starType.radius[1]);
  assert.ok(Array.isArray(star.planets));
  assert.ok(star.planets.length >= 0 && star.planets.length <= 10);
  star.planets.forEach((p) => validateBody(p, star));
});

test('planet with five moons has unique moon radii', () => {
  let targetPlanet = null;
  for (let i = 0; i < 100 && !targetPlanet; i++) {
    const star = generateStellarObject('star');
    targetPlanet = star.planets.find((p) => p.moons.length === 5);
  }
  assert.ok(targetPlanet, 'Failed to generate planet with five moons');
  const radii = targetPlanet.moons.map((m) => m.radius);
  for (let i = 0; i < radii.length; i++) {
    for (let j = i + 1; j < radii.length; j++) {
      assert.ok(Math.abs(radii[i] - radii[j]) >= 0.01);
    }
  }
});
