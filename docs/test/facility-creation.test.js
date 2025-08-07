import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { createPlanetSidebar } from '../js/components/planet-sidebar.js';

const planetTemplate = {
  name: 'Test',
  type: 'rocky',
  kind: 'planet',
  distance: 1,
  orbitDistance: 1,
  radius: 1,
  gravity: 1,
  mass: 1,
  temperature: 300,
  temperatureSpan: 0,
  isHabitable: false,
  orbitalPeriod: 1,
  features: [],
  angle: 0,
  eccentricity: 0,
  orbitRotation: 0,
  resources: {},
  atmosphere: null,
  atmosphericPressure: 1,
  moons: []
};

test('facility creation respects prerequisites', () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;

  const planet = JSON.parse(JSON.stringify(planetTemplate));

  let sidebar = createPlanetSidebar(planet);
  document.body.append(sidebar);

  const getButton = (name) => {
    const dlg = document.querySelector('dialog');
    const rows = [...dlg.querySelectorAll('tr')];
    const row = rows.find((r) => r.children[0].textContent === name);
    return row?.querySelector('button');
  };

  sidebar.querySelector('.create-facilities').click();
  let spaceportBtn = getButton('Spaceport');
  let baseBtn = getButton('Base');
  let shipyardBtn = getButton('Shipyard');
  assert.equal(spaceportBtn.disabled, false);
  assert.equal(baseBtn.disabled, true);
  assert.equal(shipyardBtn.disabled, true);
  spaceportBtn.click();
  assert.ok(planet.features.includes('Spaceport'));

  sidebar = document.querySelector('.planet-sidebar');
  sidebar.querySelector('.create-facilities').click();
  baseBtn = getButton('Base');
  assert.equal(baseBtn.disabled, false);
  baseBtn.click();
  assert.ok(planet.moons.some((m) => m.kind === 'Base'));

  sidebar = document.querySelector('.planet-sidebar');
  sidebar.querySelector('.create-facilities').click();
  shipyardBtn = getButton('Shipyard');
  assert.equal(shipyardBtn.disabled, false);
  shipyardBtn.click();
  assert.ok(planet.moons.some((m) => m.kind === 'Shipyard'));

  delete global.window;
  delete global.document;
});
