import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { generateMoons } from '../js/objects/moon.js';
import { createPlanetSidebar } from '../js/components/planet-sidebar.js';

// Verify that an orbital facility can be generated and listed in the sidebar
// as an orbiting object.
test('orbital facilities appear in planet sidebar', () => {
  const planet = {
    name: 'Test',
    type: 'rocky',
    kind: 'planet',
    distance: 1,
    radius: 1,
    mass: 1,
    gravity: 1,
    atmosphericPressure: 1,
    temperature: 300,
    isHabitable: false,
    orbitalPeriod: 1,
    eccentricity: 0,
    features: ['Base'],
    resources: {},
    atmosphere: null,
    moons: []
  };
  const star = { mass: 1 };
  const origRandom = Math.random;
  Math.random = () => 0; // ensure deterministic generation with no natural moons
  planet.moons = generateMoons(star, planet);
  Math.random = origRandom;
  // remove feature so it is not listed as a surface object
  planet.features = [];
  assert.equal(planet.moons.length, 1);
  assert.equal(planet.moons[0].kind, 'Base');

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  const sidebar = createPlanetSidebar(planet);
  const html = sidebar.innerHTML;
  assert.match(html, /Base 1/);
  delete global.document;
});

// Verify that surface facilities are listed under Surface Objects in the sidebar
// when present on a planet.
test('surface facilities listed in planet sidebar', () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  const planet = {
    name: 'Test',
    type: 'rocky',
    kind: 'planet',
    distance: 1,
    radius: 1,
    gravity: 1,
    atmosphericPressure: 1,
    temperature: 300,
    isHabitable: false,
    orbitalPeriod: 1,
    eccentricity: 0,
    features: ['Mine', 'Spaceport'],
    resources: {},
    atmosphere: null,
    moons: []
  };
  const sidebar = createPlanetSidebar(planet);
  const html = sidebar.innerHTML;
  assert.match(html, /<li>Mine<\/li>/);
  assert.match(html, /<li>Spaceport<\/li>/);
  delete global.document;
});
