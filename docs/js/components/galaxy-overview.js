import { createOverview } from './overview.js';

export function createGalaxyOverview(
  galaxy,
  onSelect,
  onOpenSystem,
  selectedSystem = null
) {
  const STAR_RADIUS = 16;
  const size = galaxy.size;

  const systems = galaxy.systems.map(({ x, y, system }) => ({
    x,
    y,
    star: system.stars[0],
    system,
  }));

  let starPositions = [];
  let hoveredIndex = null;
  let selectedIndex =
    selectedSystem ? systems.findIndex((s) => s.system === selectedSystem) : null;
  let canvas;
  let ctx;

  function update(zoom) {
    const scale =
      (Math.min(canvas.width, canvas.height) / (size * 2 + 1)) * zoom;
    const offsetX = (canvas.width - scale * (size * 2 + 1)) / 2;
    const offsetY = (canvas.height - scale * (size * 2 + 1)) / 2;
    starPositions = systems.map(({ x, y, star, system }) => {
      const cx = (x + size) * scale + offsetX;
      const cy = (y + size) * scale + offsetY;
      return { cx, cy, star, system };
    });
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    starPositions.forEach(({ cx, cy, star }, idx) => {
      ctx.beginPath();
      ctx.fillStyle = star.color;
      ctx.arc(cx, cy, STAR_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      if (idx === hoveredIndex || idx === selectedIndex) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, STAR_RADIUS + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    if (hoveredIndex !== null) {
      const { cx, cy, star } = starPositions[hoveredIndex];
      const text = star.name;
      ctx.font = '16px sans-serif';
      ctx.textBaseline = 'top';
      const textWidth = ctx.measureText(text).width;
      const padding = 4;
      const x = cx - textWidth / 2 - padding;
      const y = cy - STAR_RADIUS - 8 - 16 - padding;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(x, y, textWidth + padding * 2, 16 + padding * 2);
      ctx.fillStyle = '#fff';
      ctx.fillText(text, x + padding, y + padding);
    }
  }

  const overview = createOverview({
    update,
    draw,
    label: 'Galaxy',
  });

  canvas = overview.canvas;
  ctx = overview.ctx;

  function getStarIndex(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    return starPositions.findIndex(({ cx, cy }) => {
      const dx = cx - x;
      const dy = cy - y;
      return Math.sqrt(dx * dx + dy * dy) <= STAR_RADIUS;
    });
  }

  canvas.addEventListener('mousemove', (e) => {
    hoveredIndex = getStarIndex(e);
    if (hoveredIndex === -1) {
      hoveredIndex = null;
    }
    draw();
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredIndex = null;
    draw();
  });

  let clickTimeout;

  canvas.addEventListener('click', (e) => {
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      const idx = getStarIndex(e);
      if (idx !== -1) {
        selectedIndex = idx;
        if (typeof onSelect === 'function') {
          onSelect(systems[idx].system);
        }
        draw();
      }
    }, 200);
  });

  canvas.addEventListener('dblclick', (e) => {
    clearTimeout(clickTimeout);
    const idx = getStarIndex(e);
    if (idx !== -1) {
      selectedIndex = idx;
      draw();
      if (typeof onOpenSystem === 'function') {
        onOpenSystem(systems[idx].system);
      }
    }
  });

  return overview.container;
}
