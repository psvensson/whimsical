import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { createGalaxyOverview } from '../js/components/galaxy-overview.js';
import { generateStar } from '../js/star.js';

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

let capturedText = null;
const ctxStub = {
  setTransform() {},
  fillRect() {},
  beginPath() {},
  arc() {},
  fill() {},
  stroke() {},
  measureText: () => ({ width: 50 }),
  fillText: (text) => {
    capturedText = text;
  },
};

test('hovering over star displays its name', async () => {
  setupDom();
  const star = generateStar();
  const galaxy = {
    size: 1,
    systems: [{ x: 0, y: 0, system: { stars: [star] } }],
  };

  const overview = createGalaxyOverview(galaxy);
  document.body.appendChild(overview);

  await new Promise((r) => setTimeout(r, 0));

  const canvas = overview.querySelector('canvas');
  const event = new window.MouseEvent('mousemove', {
    clientX: 100,
    clientY: 100,
  });
  canvas.dispatchEvent(event);

  assert.equal(capturedText, star.name);

  delete global.window;
  delete global.document;
  delete global.ResizeObserver;
  delete global.requestAnimationFrame;
});

