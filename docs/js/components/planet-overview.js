import { PLANET_COLORS, ORBITAL_FACILITIES } from '../data/planets.js';
import { createOverview } from './overview.js';
import { getMoonTime } from '../time.js';

export function createPlanetOverview(
  planet,
  onBack,
  onSelectObject,
  width = 400,
  height = 400
) {
  const objects = planet.moons || [];
  const PLANET_RADIUS = 20; // constant radius for planet
  const OBJECT_RADIUS = 8; // constant radius for moons and bases
  const ICON_SIZE = 4;
  const BASE_ICON_SIZE = 8 / 6;
  const MOON_ICON_RADIUS = 2;
  const ORBITAL_COLOR = '#0ff';
  const SURFACE_COLOR = '#ff0';

  let planetRadius = PLANET_RADIUS;
  let objectData = [];
  let hoveredIndex = null;
  let canvas;
  let ctx;

  function drawFeatureIcon(ctx, feature, x, y) {
    ctx.lineWidth = 1;
    const orbital = ORBITAL_FACILITIES.includes(feature);
    ctx.fillStyle = orbital ? ORBITAL_COLOR : SURFACE_COLOR;
    ctx.strokeStyle = ctx.fillStyle;
    let size = ICON_SIZE;
    switch (feature) {
      case 'base':
        size = BASE_ICON_SIZE;
        ctx.fillRect(x, y - size / 2, size, size);
        break;
      case 'shipyard':
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.fillRect(x - size / 6, y - size, size / 3, size / 2);
        break;
      case 'orbitalMine':
        ctx.beginPath();
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size / 2, y - size / 2);
        ctx.lineTo(x - size / 2, y - size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'orbitalManufactory':
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x + size / 2, y);
        ctx.lineTo(x, y + size / 2);
        ctx.lineTo(x - size / 2, y);
        ctx.closePath();
        ctx.fill();
        break;
      case 'orbitalResearch':
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'jumpStation':
        ctx.fillRect(x - size / 6, y - size / 2, size / 3, size);
        ctx.fillRect(x - size / 2, y - size / 6, size, size / 3);
        break;
      case 'mine':
        ctx.beginPath();
        ctx.moveTo(x - size / 2, y - size / 2);
        ctx.lineTo(x + size / 2, y - size / 2);
        ctx.lineTo(x, y + size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'spaceport':
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x + size / 2, y);
        ctx.lineTo(x, y + size / 2);
        ctx.lineTo(x - size / 2, y);
        ctx.closePath();
        ctx.fill();
        break;
      case 'manufactory':
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.beginPath();
        ctx.moveTo(x - size / 2, y);
        ctx.lineTo(x + size / 2, y);
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x, y + size / 2);
        ctx.stroke();
        break;
      case 'research':
        ctx.beginPath();
        ctx.moveTo(x - size / 2, y - size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.moveTo(x + size / 2, y - size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.stroke();
        break;
    }
    return feature === 'base' ? BASE_ICON_SIZE : ICON_SIZE;
  }

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
    const timeYears = getMoonTime() / 12;
    objectData = objects.map((obj) => {
      const dist = obj.orbitDistance || obj.distance - planet.distance;
      const orbitA = Math.max(dist * scale, 0);
      const e = obj.eccentricity || 0;
      const orbitB = Math.max(orbitA * Math.sqrt(Math.max(0, 1 - e * e)), 0);
      const rotation = obj.orbitRotation || 0;
      const { x, y, theta } = obj.getOrbitPosition(timeYears);
      const px = cx + x * scale;
      const py = cy + y * scale;
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

    let iconX = cx + planetRadius + ICON_SIZE;
    const iconY = cy;
    if (planet.features) {
      planet.features.forEach((f) => {
        const size = drawFeatureIcon(ctx, f, iconX, iconY);
        iconX += size + 4;
      });
    }
    if (planet.moons && planet.moons.length) {
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(iconX + MOON_ICON_RADIUS, iconY, MOON_ICON_RADIUS, 0, Math.PI * 2);
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
    if (typeof onBack === 'function') {
      onBack();
    }
  });
  overview.container.appendChild(backBtn);
  overview.container.destroy = overview.destroy;

  return overview.container;
}
