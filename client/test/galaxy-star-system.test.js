import test from 'node:test';
import assert from 'node:assert/strict';

import { generateStarSystem } from '../js/galaxy.js';

// Ensure that generating a star system produces a valid star object with planets
// and does not throw due to a null star reference.
test('generateStarSystem returns a star with planets', () => {
  const system = generateStarSystem();
  assert.equal(Array.isArray(system.stars), true);
  assert.equal(system.stars.length, 1);
  const [star] = system.stars;
  assert.ok(star);
  assert.ok(Array.isArray(star.planets));
});
