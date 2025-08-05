import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { createSystemOverview } from '../js/components/system-overview.js';
import { generateStarSystem } from '../js/galaxy.js';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.window.devicePixelRatio = 1;
  const ctxStub = {
    setTransform() {},
    fillRect() {},
    beginPath() {},
    arc() {},
    ellipse() {},
    fill() {},
    stroke() {},
    moveTo() {},
    lineTo() {},
    save() {},
    restore() {},
    fillText() {},
  };
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

test('clicking star triggers star callback', async () => {
  setupDom();
  const system = generateStarSystem();
  system.planets = [];
  system.stars[0].planets = [];
  let called = false;
  const overview = createSystemOverview(
    system,
    null,
    null,
    null,
    () => {
      called = true;
    },
    null,
    300,
    300
  );
  document.body.appendChild(overview);

  await new Promise((r) => setTimeout(r, 0));

  const canvas = overview.querySelector('canvas');
  const event = new window.MouseEvent('click', {
    clientX: 150,
    clientY: 150,
  });
  canvas.dispatchEvent(event);

  await new Promise((r) => setTimeout(r, 300));

  assert.equal(called, true);

  delete global.window;
  delete global.document;
  delete global.ResizeObserver;
  delete global.requestAnimationFrame;
});
