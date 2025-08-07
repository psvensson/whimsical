import test from 'node:test';
import assert from 'node:assert/strict';
import { Base } from '../js/facilities/orbital/base.js';
import { Storage } from '../js/facilities/storage.js';
import { Craft, Probe } from '../js/objects/craft.js';

test('facilities include storage and features arrays', () => {
  const parent = { temperature: 300, distance: 1, mass: 1 };
  const facility = Base.generate(null, 0, parent);
  assert.ok(Array.isArray(facility.storage));
  assert.ok(Array.isArray(facility.features));
});

test('storage can hold resources and crafts', () => {
  const ammoniaStore = new Storage('resource', 'ammonia', [50]);
  assert.equal(ammoniaStore.items.length, 1);
  assert.equal(ammoniaStore.items[0], 50);

  const probeStore = new Storage('crafts', 'probe');
  const probe = new Probe(1, 1, 'P1', 10);
  probeStore.items.push(probe);
  assert.strictEqual(probeStore.items[0], probe);
  assert.ok(probe instanceof Craft);
});
