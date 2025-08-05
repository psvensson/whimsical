import { PLANET_COLORS } from '../data/planets.js';
import { createOverview } from './overview.js';

export function createSystemOverview(
  system,
  onBack,
  onSelectPlanet,
  width = 400,
  height = 400
) {
  const star = system.stars[0];
  const planets = system.planets;
  const BODY_SCALE = 12;

  const baseStarRadius = star.size * 2 * BODY_SCALE;
  const baseMaxPlanetRadius = Math.max(
    ...planets.map((p) => Math.min(p.radius * 2 * BODY_SCALE, baseStarRadius - 1)),
    0
  );

  let starRadius = baseStarRadius;
  let planetData = [];
  let hoveredIndex = null;
  let canvas;
  let ctx;

  function updateLayout(zoom) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const maxOrbit = Math.max(
      ...planets.map((p) => (p.distance || 0) * (1 + (p.eccentricity || 0))),
      1
    );
    const scaleBase = Math.max(
      (Math.min(canvas.width, canvas.height) / 2 -
        baseStarRadius -
        baseMaxPlanetRadius -
        20) /
        maxOrbit,
      0.1
    );
    const scale = scaleBase * zoom;

    starRadius = Math.max(baseStarRadius * zoom, 0);
    planetData = planets.map((planet) => {
      const dist = planet.distance || 0;
      const orbitA = Math.max(dist * scale, 0);
      const e = planet.eccentricity || 0;
      const orbitB = Math.max(orbitA * Math.sqrt(Math.max(0, 1 - e * e)), 0);
      const rotation = planet.orbitRotation || 0;
      const theta = planet.angle;
      const r = (orbitA * (1 - e * e)) / (1 + e * Math.cos(theta));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const xRot = x * Math.cos(rotation) - y * Math.sin(rotation);
      const yRot = x * Math.sin(rotation) + y * Math.cos(rotation);
      const px = cx + xRot;
      const py = cy + yRot;
      const planetRadius = Math.max(
        0,
        Math.min(planet.radius * 2 * BODY_SCALE * zoom, starRadius - 1)
      );
      return { planet, orbitA, orbitB, e, rotation, theta, px, py, planetRadius };
    });
  }

  function draw() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1;
    planetData.forEach(({ orbitA, orbitB, e, rotation }) => {
      if (orbitA > 0 && orbitB > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#444';
        const centerX = cx - orbitA * e * Math.cos(rotation);
        const centerY = cy - orbitA * e * Math.sin(rotation);
        ctx.ellipse(centerX, centerY, orbitA, orbitB, rotation, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    planetData.forEach(({ planet, px, py, planetRadius }) => {
      ctx.beginPath();
      ctx.fillStyle = PLANET_COLORS[planet.type] || '#fff';
      ctx.arc(px, py, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      if (planet.features) {
        let iconX = px + planetRadius + 4;
        const iconY = py;
        planet.features.forEach((f) => {
          ctx.fillStyle = '#fff';
          if (f === 'base') {
            ctx.fillRect(iconX, iconY - 2, 4, 4);
          } else if (f === 'mine') {
            ctx.beginPath();
            ctx.moveTo(iconX, iconY - 3);
            ctx.lineTo(iconX + 4, iconY - 3);
            ctx.lineTo(iconX + 2, iconY + 1);
            ctx.fill();
          }
          iconX += 6;
        });
      }
    });

    ctx.beginPath();
    ctx.fillStyle = star.color;
    ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
    ctx.fill();

    if (hoveredIndex !== null) {
      const { px, py, planetRadius } = planetData[hoveredIndex];
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.arc(px, py, planetRadius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const overview = createOverview({
    update: updateLayout,
    draw,
  });

  canvas = overview.canvas;
  ctx = overview.ctx;
  overview.container.style.width = `${width}px`;
  overview.container.style.height = `${height}px`;

  function getPlanetIndex(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    return planetData.findIndex(({ px, py, planetRadius }) => {
      const dx = px - x;
      const dy = py - y;
      return Math.sqrt(dx * dx + dy * dy) <= planetRadius;
    });
  }

  canvas.addEventListener('mousemove', (e) => {
    const idx = getPlanetIndex(e);
    hoveredIndex = idx === -1 ? null : idx;
    draw();
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredIndex = null;
    draw();
  });

  canvas.addEventListener('click', (e) => {
    const idx = getPlanetIndex(e);
    if (idx !== -1 && typeof onSelectPlanet === 'function') {
      onSelectPlanet(planetData[idx].planet);
    }
  });

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back';
  backBtn.addEventListener('click', () => {
    overview.destroy();
    if (typeof onBack === 'function') {
      onBack();
    }
  });

  overview.container.appendChild(backBtn);
  return overview.container;
}
