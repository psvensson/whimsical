import test from 'node:test';
import assert from 'node:assert/strict';

import { StellarObject } from '../js/objects/util.js';

// Ensure orbit position advances with time

test('orbit position updates over time', () => {
  const body = new StellarObject({
    orbitalPeriod: 1, // years
    angle: 0,
    orbitDistance: 1,
    eccentricity: 0,
    orbitRotation: 0,
  });

  const p0 = body.getOrbitPosition(0);
  const pHalf = body.getOrbitPosition(0.5);
  const pFull = body.getOrbitPosition(1);

  assert.notEqual(p0.x, pHalf.x);
  assert.notEqual(p0.y, pHalf.y);
  assert.ok(Math.abs(p0.x - pFull.x) < 1e-6);
  assert.ok(Math.abs(p0.y - pFull.y) < 1e-6);
});
