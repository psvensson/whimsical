export function createOverview({ update, draw } = {}) {
  const container = document.createElement('div');
  container.className = 'overview';

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

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

  requestAnimationFrame(resize);

  function destroy() {
    resizeObserver.disconnect();
  }

  return { container, canvas, ctx, setZoom, getZoom: () => zoom, destroy };
}
