import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { createStarSidebar } from '../js/components/star-sidebar.js';
import { generateStarSystem } from '../js/galaxy.js';

test('star sidebar omits button when no callback provided', () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  const system = generateStarSystem();
  const sidebar = createStarSidebar(system);
  const btn = sidebar.querySelector('button');
  assert.equal(btn, null);
  delete global.window;
  delete global.document;
});
