import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
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

test('init attaches core components to DOM', async () => {
  setupDom();
  const { init } = await import('../js/main.js');
  init();
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
  const app = document.getElementById('app');
  const header = app.querySelector('#header');
  assert.ok(header);
  assert.ok(header.querySelector('.time-controls'));
  const main = app.querySelector('#main');
  assert.ok(main);
  assert.ok(main.querySelector('#sidebar'));
  const overview = main.querySelector('.overview');
  assert.ok(overview);
  assert.equal(overview.querySelector('.time-controls'), null);
  delete global.window;
  delete global.document;
  delete global.ResizeObserver;
  delete global.requestAnimationFrame;
});
