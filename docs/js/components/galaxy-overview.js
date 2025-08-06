import { createOverview } from './overview.js';
import { ORBITAL_FACILITIES } from '../data/planets.js';

export function createGalaxyOverview(
  galaxy,
  onSelect,
  onOpenSystem,
  selectedSystem = null
) {
  const STAR_RADIUS = 8;
  const size = galaxy.size;

  const systems = galaxy.systems.map(({ x, y, system }) => ({
    x,
    y,
    star: system.stars[0],
    system,
  }));

  function countHabitable(bodies) {
    return bodies.reduce((acc, body) => {
      let total = acc;
      if (body.isHabitable && !ORBITAL_FACILITIES.includes(body.kind)) total++;
      if (body.moons?.length) {
        total += countHabitable(body.moons);
      }
      return total;
    }, 0);
  }

  const habitableWorldCount = galaxy.systems.reduce((count, { system }) => {
    return (
      count +
      system.stars.reduce((starCount, star) => {
        return starCount + countHabitable(star.planets || []);
      }, 0)
    );
  }, 0);

  let starPositions = [];
  let hoveredIndex = null;
  let selectedIndex =
    selectedSystem ? systems.findIndex((s) => s.system === selectedSystem) : null;
  let canvas;
  let ctx;

  function update(zoom) {
    if (canvas.width === 0 || canvas.height === 0) return;
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
      if (typeof ctx.createRadialGradient === 'function') {
        const gradient = ctx.createRadialGradient(
          cx - STAR_RADIUS / 3,
          cy - STAR_RADIUS / 3,
          STAR_RADIUS / 4,
          cx,
          cy,
          STAR_RADIUS
        );
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.3, star.color);
        gradient.addColorStop(1, star.color);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = star.color;
      }
      ctx.arc(cx, cy, STAR_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      if (typeof ctx.createRadialGradient === 'function') {
        ctx.beginPath();
        ctx.arc(
          cx - STAR_RADIUS / 3,
          cy - STAR_RADIUS / 3,
          STAR_RADIUS / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
      }

      if (!star.planets.length) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.arc(cx, cy, STAR_RADIUS / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      const crossLen = STAR_RADIUS / 2;
      ctx.beginPath();
      ctx.moveTo(cx - crossLen, cy);
      ctx.lineTo(cx + crossLen, cy);
      ctx.moveTo(cx, cy - crossLen);
      ctx.lineTo(cx, cy + crossLen);
      ctx.stroke();

      const diagLen = STAR_RADIUS / 3;
      ctx.beginPath();
      ctx.moveTo(cx - diagLen, cy - diagLen);
      ctx.lineTo(cx + diagLen, cy + diagLen);
      ctx.moveTo(cx - diagLen, cy + diagLen);
      ctx.lineTo(cx + diagLen, cy - diagLen);
      ctx.stroke();

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

  overview.container.classList.add('galaxy-overview');

  const habitableEl = document.createElement('div');
  habitableEl.className = 'habitable-count';
  habitableEl.textContent = `Habitable Worlds: ${habitableWorldCount}`;
  overview.container.appendChild(habitableEl);

  canvas = overview.canvas;
  ctx = overview.ctx;

  function getStarIndex(event) {
    const rect = canvas.getBoundingClientRect();
    if (canvas.width === 0 || rect.width === 0) return -1;
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

  overview.container.destroy = overview.destroy;
  return overview.container;
}
