import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { createPlanetSidebar } from '../js/components/planet-sidebar.js';

// Ensure planet sidebar displays gravity and temperature in both Kelvin and Celsius
// Requires DOM environment via JSDOM

test('planet sidebar shows gravity and celsius conversion', () => {
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
    features: [],
    resources: {},
    atmosphere: null,
    moons: []
  };

  const sidebar = createPlanetSidebar(planet);
  const html = sidebar.innerHTML;
  assert.match(html, /Gravity:<\/strong> 1\.00 g/);
  assert.match(html, /Pressure:<\/strong> 1\.00 atm/);
  assert.match(html, /Temperature:<\/strong> 300\.00 K \(26\.85 °C\)/);

  delete global.document;
});
