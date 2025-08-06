import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { createGalaxyOverview } from '../js/components/galaxy-overview.js';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.window.devicePixelRatio = 1;
  dom.window.HTMLCanvasElement.prototype.getContext = () => ctxStub;
  dom.window.HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
    width: 300,
    height: 300,
    left: 0,
    top: 0,
  });
  global.ResizeObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {
      setTimeout(() => this.cb(), 0);
    }
    disconnect() {}
  };
  global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
}

const ctxStub = {
  setTransform() {},
  fillRect() {},
  beginPath() {},
  arc() {},
  fill() {},
  stroke() {},
  moveTo() {},
  lineTo() {},
  measureText: () => ({ width: 50 }),
  fillText() {},
};

test('displays habitable world count', async () => {
  setupDom();
  const star = { name: 'TestStar', color: '#fff', planets: [{ isHabitable: true, moons: [] }] };
  const galaxy = { size: 1, systems: [{ x: 0, y: 0, system: { stars: [star] } }] };

  const overview = createGalaxyOverview(galaxy);
  document.body.appendChild(overview);

  await new Promise((r) => setTimeout(r, 0));

  const countEl = overview.querySelector('.habitable-count');
  assert.equal(countEl.textContent, 'Habitable Worlds: 1');

  delete global.window;
  delete global.document;
  delete global.ResizeObserver;
  delete global.requestAnimationFrame;
});
