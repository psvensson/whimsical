import test from 'node:test';
import assert from 'node:assert/strict';

import { generateStar } from '../js/star.js';
import { STAR_TYPES, STAR_CLASS_COLORS } from '../js/data/stars.js';
import {
  PLANET_TYPES,
  PLANET_RESOURCES,
  PLANET_ATMOSPHERES,
  MOON_RULES,
  PLANET_FEATURES
} from '../js/data/planets.js';
import { ATMOSPHERE_GRAVITY_THRESHOLD } from '../js/stellar-object.js';

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

function validateBody(body, star, parent = null) {
  if (body.type === 'base') {
    assert.ok(body.distance > 0);
    assert.ok(typeof body.radius === 'number');
    assert.ok(typeof body.gravity === 'number');
    assert.ok(typeof body.atmosphericPressure === 'number');
    assert.equal(body.atmosphericPressure, 0);
    if (parent) {
      assert.equal(body.gravity, parent.gravity);
      assert.equal(body.temperature, parent.temperature);
    }
    return;
  }
  assert.ok(typeof body.gravity === 'number');
  assert.ok(typeof body.temperature === 'number');
   assert.ok(typeof body.atmosphericPressure === 'number');
  assert.ok(planetTypeNames.includes(body.type));
  const rule = PLANET_TYPES.find((t) => t.name === body.type);
  if (body.kind === 'planet') {
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

  if (
    body.gravity < ATMOSPHERE_GRAVITY_THRESHOLD ||
    !(PLANET_ATMOSPHERES[body.type]?.length)
  ) {
    assert.equal(body.atmosphere, null);
    assert.equal(body.atmosphericPressure, 0);
  } else {
    assert.notEqual(body.atmosphere, null);
    assert.equal(body.atmosphericPressure, body.gravity);
  }

  const inHZ =
    body.distance >= star.habitableZone[0] &&
    body.distance <= star.habitableZone[1];
  const gravityOk = body.gravity >= 0.5 && body.gravity <= 1.5;
  const tempOk = body.temperature >= 260 && body.temperature <= 320;
  if (body.type === 'terrestrial' && inHZ && gravityOk && tempOk) {
    assert.equal(body.isHabitable, true);
  } else {
    assert.equal(body.isHabitable, false);
  }

  if (parent && body.kind === 'moon') {
    assert.ok(body.gravity <= parent.gravity * 0.1);
  }

  const naturalMoons = body.moons.filter((m) => m.type !== 'base');
  const maxMoons = expectedMaxMoons(body.radius);
  assert.ok(naturalMoons.length <= maxMoons);
  body.moons.forEach((m) => validateBody(m, star, body));
}

test('generate star with valid planets and moons', () => {
  const star = generateStar();
  const starType = STAR_TYPES.find((s) => s.class === star.class);
  assert.ok(starType);
  assert.equal(star.typeName, starType.name);
  assert.ok(typeof star.name === 'string');
  assert.ok(star.name.length > 0);
  assert.equal(star.color, STAR_CLASS_COLORS[star.class]);
  assert.ok(star.mass >= starType.mass[0] && star.mass <= starType.mass[1]);
  assert.ok(
    star.luminosity >= starType.luminosity[0] &&
      star.luminosity <= starType.luminosity[1]
  );
  assert.ok(star.radius >= starType.radius[0] && star.radius <= starType.radius[1]);
  const minGravity =
    starType.mass[0] / Math.pow(starType.radius[1], 2);
  const maxGravity =
    starType.mass[1] / Math.pow(starType.radius[0], 2);
  assert.ok(star.gravity >= minGravity && star.gravity <= maxGravity);
  assert.ok(Array.isArray(star.planets));
  assert.ok(star.planets.length >= 0 && star.planets.length <= 10);
  star.planets.forEach((p) => validateBody(p, star));
});

test('planet with five moons has unique moon radii', () => {
  let targetPlanet = null;
  for (let i = 0; i < 100 && !targetPlanet; i++) {
    const star = generateStar();
    targetPlanet = star.planets.find(
      (p) => p.moons.filter((m) => m.type !== 'base').length === 5
    );
  }
  assert.ok(targetPlanet, 'Failed to generate planet with five moons');
  const radii = targetPlanet.moons.map((m) => m.radius);
  for (let i = 0; i < radii.length; i++) {
    for (let j = i + 1; j < radii.length; j++) {
      assert.ok(Math.abs(radii[i] - radii[j]) >= 0.01);
    }
  }
});

test('generated bodies include kind property', () => {
  const star = generateStar();
  star.planets.forEach((p) => {
    assert.equal(p.kind, 'planet');
    p.moons.forEach((m) => {
      if (m.type === 'base') {
        assert.equal(m.kind, 'base');
      } else {
        assert.equal(m.kind, 'moon');
      }
    });
  });
});
