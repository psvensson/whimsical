import test from 'node:test';
import assert from 'node:assert/strict';

import { generateStar } from '../client/js/star.js';

// Ensure that generated stars receive a readable two-word name.
test('generateStar assigns a two-word name', () => {
  const star = generateStar();
  assert.equal(typeof star.name, 'string');
  const words = star.name.split(' ');
  assert.equal(words.length, 2);
  assert.match(words[0], /^[A-Z][a-z]*$/);
  assert.match(words[1], /^[A-Z][a-z]*$/);
});
