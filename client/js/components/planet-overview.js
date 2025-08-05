import { PLANET_COLORS } from '../data/planets.js';
import { createOverview } from './overview.js';

export function createPlanetOverview(
  planet,
  onBack,
  onSelectObject,
  width = 400,
  height = 400
) {
  const objects = planet.moons || [];
  const PLANET_RADIUS = 40; // constant radius for planet
  const OBJECT_RADIUS = 16; // constant radius for moons and bases

  let planetRadius = PLANET_RADIUS;
  let objectData = [];
  let hoveredIndex = null;
  let canvas;
  let ctx;

  function updateLayout(zoom) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxOrbit = Math.max(
      ...objects.map((o) => (o.orbitDistance || o.distance - planet.distance) * (1 + (o.eccentricity || 0))),
      1
    );
    planetRadius = Math.max(PLANET_RADIUS * zoom, 0);
    const scaleBase = Math.max(
      (Math.min(canvas.width, canvas.height) / 2 - planetRadius - 20) / maxOrbit,
      0.1
    );
    const scale = scaleBase * zoom;
    objectData = objects.map((obj) => {
      const dist = obj.orbitDistance || obj.distance - planet.distance;
      const orbitA = Math.max(dist * scale, 0);
      const e = obj.eccentricity || 0;
      const orbitB = Math.max(orbitA * Math.sqrt(Math.max(0, 1 - e * e)), 0);
      const rotation = obj.orbitRotation || 0;
      const theta = obj.angle || 0;
      const r = (orbitA * (1 - e * e)) / (1 + e * Math.cos(theta));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const xRot = x * Math.cos(rotation) - y * Math.sin(rotation);
      const yRot = x * Math.sin(rotation) + y * Math.cos(rotation);
      const px = cx + xRot;
      const py = cy + yRot;
      const objRadius = Math.max(OBJECT_RADIUS * zoom, 0);
      return { obj, orbitA, orbitB, e, rotation, theta, px, py, objRadius };
    });
  }

  function draw() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1;
    objectData.forEach(({ orbitA, orbitB, e, rotation }) => {
      if (orbitA > 0 && orbitB > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#444';
        const centerX = cx - orbitA * e * Math.cos(rotation);
        const centerY = cy - orbitA * e * Math.sin(rotation);
        ctx.ellipse(centerX, centerY, orbitA, orbitB, rotation, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    objectData.forEach(({ obj, px, py, objRadius }) => {
      ctx.beginPath();
      if (obj.type === 'base') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(px - objRadius, py - objRadius, objRadius * 2, objRadius * 2);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '12px sans-serif';
        ctx.fillText(obj.name, px, py - objRadius - 8);
      } else {
        ctx.fillStyle = PLANET_COLORS[obj.type] || '#fff';
        ctx.arc(px, py, objRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '12px sans-serif';
        ctx.fillText(obj.name, px, py - objRadius - 8);
      }
    });

    ctx.beginPath();
    ctx.fillStyle = PLANET_COLORS[planet.type] || '#fff';
    ctx.arc(cx, cy, planetRadius, 0, Math.PI * 2);
    ctx.fill();

    let iconX = cx + planetRadius + 8;
    const iconY = cy;
    if (planet.features) {
      planet.features
        .filter((f) => f !== 'base')
        .forEach((f) => {
          ctx.fillStyle = '#fff';
          if (f === 'mine') {
            ctx.beginPath();
            ctx.moveTo(iconX, iconY - 6);
            ctx.lineTo(iconX + 8, iconY - 6);
            ctx.lineTo(iconX + 4, iconY + 2);
            ctx.fill();
          }
          iconX += 12;
        });
    }
    if (planet.moons && planet.moons.length) {
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(iconX + 4, iconY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = '12px sans-serif';
    ctx.fillText(planet.name, cx, cy - planetRadius - 8);

    if (hoveredIndex !== null) {
      const { px, py, objRadius, obj } = objectData[hoveredIndex];
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      if (obj.type === 'base') {
        ctx.strokeRect(px - objRadius - 4, py - objRadius - 4, objRadius * 2 + 8, objRadius * 2 + 8);
      } else {
        ctx.arc(px, py, objRadius + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  const overview = createOverview({
    update: updateLayout,
    draw,
    label: planet.name,
  });

  canvas = overview.canvas;
  ctx = overview.ctx;
  overview.container.style.width = `${width}px`;
  overview.container.style.height = `${height}px`;

  function getObjectIndex(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    return objectData.findIndex(({ px, py, objRadius, obj }) => {
      const dx = px - x;
      const dy = py - y;
      if (obj.type === 'base') {
        return Math.abs(dx) <= objRadius && Math.abs(dy) <= objRadius;
      }
      return Math.sqrt(dx * dx + dy * dy) <= objRadius;
    });
  }

  canvas.addEventListener('mousemove', (e) => {
    const idx = getObjectIndex(e);
    hoveredIndex = idx === -1 ? null : idx;
    draw();
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredIndex = null;
    draw();
  });

  canvas.addEventListener('click', (e) => {
    const idx = getObjectIndex(e);
    if (idx !== -1 && typeof onSelectObject === 'function') {
      onSelectObject(objectData[idx].obj);
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    const dx = canvas.width / 2 - x;
    const dy = canvas.height / 2 - y;
    if (Math.sqrt(dx * dx + dy * dy) <= planetRadius) {
      if (typeof onSelectObject === 'function') {
        onSelectObject(planet);
      }
    }
  });

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back';
  backBtn.className = 'back-btn';
  backBtn.addEventListener('click', () => {
    overview.destroy();
    if (typeof onBack === 'function') {
      onBack();
    }
  });
  overview.container.appendChild(backBtn);

  return overview.container;
}
