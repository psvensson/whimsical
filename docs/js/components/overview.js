import {
  subscribe as subscribeTime,
  play,
  pause,
  isPlaying,
  getTime,
} from '../time.js';

export function createOverview({ update, draw, label, showTime = true } = {}) {
  const container = document.createElement('div');
  container.className = 'overview';

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  if (label) {
    const labelEl = document.createElement('div');
    labelEl.className = 'overview-label';
    labelEl.textContent = label;
    container.appendChild(labelEl);
  }

  const zoomInBtn = document.createElement('button');
  zoomInBtn.textContent = '+';
  zoomInBtn.className = 'zoom-btn zoom-in';
  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.textContent = '-';
  zoomOutBtn.className = 'zoom-btn zoom-out';
  container.append(zoomInBtn, zoomOutBtn);

  let zoom = 1;

  function setZoom(newZoom) {
    zoom = Math.min(Math.max(newZoom, 0.5), 5);
    if (typeof update === 'function') update(zoom);
    if (typeof draw === 'function') draw(zoom);
  }

  zoomInBtn.addEventListener('click', () => setZoom(zoom * 1.2));
  zoomOutBtn.addEventListener('click', () => setZoom(zoom / 1.2));

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(zoom * factor);
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (typeof update === 'function') update(zoom);
    if (typeof draw === 'function') draw(zoom);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  let unsubscribeTime = null;
  if (showTime) {
    const controls = document.createElement('div');
    controls.className = 'time-controls';

    const display = document.createElement('span');
    display.className = 'time-display';

    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';

    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = 'Pause';

    function updateDisplay(months) {
      const year = Math.floor(months / 12);
      const month = months % 12;
      display.textContent = `${year}:${month}`;
      playBtn.disabled = isPlaying();
      pauseBtn.disabled = !isPlaying();
    }

    playBtn.addEventListener('click', () => {
      play();
      updateDisplay(getTime());
    });
    pauseBtn.addEventListener('click', () => {
      pause();
      updateDisplay(getTime());
    });

    controls.append(display, playBtn, pauseBtn);
    container.appendChild(controls);

    unsubscribeTime = subscribeTime((months) => {
      updateDisplay(months);
      if (typeof update === 'function') update(zoom);
      if (typeof draw === 'function') draw(zoom);
    });
    updateDisplay(getTime());
  }

  requestAnimationFrame(resize);

  let destroyed = false;
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    resizeObserver.disconnect();
    if (unsubscribeTime) unsubscribeTime();
  }

  container.destroy = destroy;

  return { container, canvas, ctx, setZoom, getZoom: () => zoom, destroy };
}
