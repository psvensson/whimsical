import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { createOverview } from '../js/components/overview.js';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.window.devicePixelRatio = 1;
  global.ResizeObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {
      this.cb();
    }
    disconnect() {}
  };
  dom.window.HTMLCanvasElement.prototype.getContext = () => ({
    setTransform() {},
    fillRect() {},
  });
  global.requestAnimationFrame = (fn) => fn();
}

test('zoom buttons adjust zoom level', () => {
  setupDom();
  const { container, getZoom } = createOverview();
  document.body.appendChild(container);
  const buttons = container.getElementsByTagName('button');
  const zoomIn = buttons[0];
  const zoomOut = buttons[1];

  assert.equal(getZoom(), 1);
  zoomIn.click();
  const afterIn = getZoom();
  assert.ok(afterIn > 1);
  zoomOut.click();
  const afterOut = getZoom();
  assert.ok(afterOut < afterIn);
});
