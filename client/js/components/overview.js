import { generateGalaxy } from '../galaxy.js';

export function createOverview(onSelect) {
  const overview = document.createElement('canvas');
  overview.id = 'overview';
  overview.width = 400;
  overview.height = 400;

  const galaxy = generateGalaxy();
  const ctx = overview.getContext('2d');

  const size = galaxy.size;
  const scaleX = overview.width / (size * 2 + 1);
  const scaleY = overview.height / (size * 2 + 1);

  const stars = galaxy.systems.map(({ x, y, system }) => {
    const star = system.stars[0];
    const cx = (x + size) * scaleX;
    const cy = (y + size) * scaleY;
    return { cx, cy, star };
  });

  let hoveredIndex = null;

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, overview.width, overview.height);

    stars.forEach(({ cx, cy, star }, idx) => {
      ctx.beginPath();
      ctx.fillStyle = star.color;
      ctx.arc(cx, cy, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (idx === hoveredIndex) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, star.size + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function getStarIndex(event) {
    const rect = overview.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return stars.findIndex(({ cx, cy, star }) => {
      const dx = cx - x;
      const dy = cy - y;
      return Math.sqrt(dx * dx + dy * dy) <= star.size;
    });
  }

  overview.addEventListener('mousemove', (e) => {
    hoveredIndex = getStarIndex(e);
    draw();
  });

  overview.addEventListener('mouseleave', () => {
    hoveredIndex = null;
    draw();
  });

  overview.addEventListener('click', (e) => {
    const idx = getStarIndex(e);
    if (idx !== -1 && typeof onSelect === 'function') {
      onSelect(stars[idx].star);
    }
  });

  draw();
  return overview;
}
