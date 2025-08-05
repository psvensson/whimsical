import { generateGalaxy } from '../galaxy.js';

export function createOverview(onSelect, onOpenSystem) {
  const overview = document.createElement('canvas');
  overview.id = 'overview';

  // All stars are drawn with the same radius for a cleaner overview
  const STAR_RADIUS = 8;

  const galaxy = generateGalaxy();
  const ctx = overview.getContext('2d');

  const size = galaxy.size;

  // Store base galaxy coordinates so we can rescale on resize
  const systems = galaxy.systems.map(({ x, y, system }) => ({
    x,
    y,
    star: system.stars[0],
    system,
  }));

  // Will hold the screen coordinates for the current canvas size
  let starPositions = [];
  let hoveredIndex = null;

  function updateStarPositions() {
    const scale = Math.min(overview.width, overview.height) / (size * 2 + 1);
    const offsetX = (overview.width - scale * (size * 2 + 1)) / 2;
    const offsetY = (overview.height - scale * (size * 2 + 1)) / 2;
    starPositions = systems.map(({ x, y, star, system }) => {
      const cx = (x + size) * scale + offsetX;
      const cy = (y + size) * scale + offsetY;
      return { cx, cy, star, system };
    });
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, overview.width, overview.height);

    starPositions.forEach(({ cx, cy, star }, idx) => {
      ctx.beginPath();
      ctx.fillStyle = star.color;
      ctx.arc(cx, cy, STAR_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      if (idx === hoveredIndex) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, STAR_RADIUS + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function getStarIndex(event) {
    const rect = overview.getBoundingClientRect();
    const scale = overview.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    return starPositions.findIndex(({ cx, cy }) => {
      const dx = cx - x;
      const dy = cy - y;
      return Math.sqrt(dx * dx + dy * dy) <= STAR_RADIUS;
    });
  }

  function resize() {
    const rect = overview.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    overview.width = rect.width * dpr;
    overview.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateStarPositions();
    draw();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(overview);

  overview.addEventListener('mousemove', (e) => {
    hoveredIndex = getStarIndex(e);
    draw();
  });

  overview.addEventListener('mouseleave', () => {
    hoveredIndex = null;
    draw();
  });

  let clickTimeout;

  overview.addEventListener('click', (e) => {
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      const idx = getStarIndex(e);
      if (idx !== -1 && typeof onSelect === 'function') {
        onSelect(systems[idx].system);
      }
    }, 200);
  });

  overview.addEventListener('dblclick', (e) => {
    clearTimeout(clickTimeout);
    const idx = getStarIndex(e);
    if (idx !== -1 && typeof onOpenSystem === 'function') {
      onOpenSystem(systems[idx].system);
    }
  });

  requestAnimationFrame(resize);
  return overview;
}
