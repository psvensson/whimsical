import { PLANET_COLORS } from '../data/planets.js';
import { createOverview } from './overview.js';
import { getTime } from '../time.js';

export function createSystemOverview(
  system,
  onBack,
  onSelect,
  onOpenPlanet,
  onSelectStar,
  selectedPlanet = null,
  width = 400,
  height = 400
) {
  const star = system.stars[0];
  const planets = system.planets;
  const STAR_SCALE = 12;
  const PLANET_RADIUS = 16; // constant radius for all planets

  const baseStarRadius = star.size * 2 * STAR_SCALE;
  const basePlanetRadius = PLANET_RADIUS;

  let starRadius = baseStarRadius;
  let planetData = [];
  let hoveredIndex = null;
  let selectedIndex =
    selectedPlanet ? planets.findIndex((p) => p === selectedPlanet) : null;
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
        basePlanetRadius -
        20) /
        maxOrbit,
      0.1
    );
    const scale = scaleBase * zoom;

    starRadius = Math.max(baseStarRadius * zoom, 0);
    const timeYears = getTime() / 12;
    planetData = planets.map((planet) => {
      const dist = planet.orbitDistance || planet.distance || 0;
      const orbitA = Math.max(dist * scale, 0);
      const e = planet.eccentricity || 0;
      const orbitB = Math.max(orbitA * Math.sqrt(Math.max(0, 1 - e * e)), 0);
      const rotation = planet.orbitRotation || 0;
      const { x, y, theta } = planet.getOrbitPosition(timeYears);
      const px = cx + x * scale;
      const py = cy + y * scale;
      const planetRadius = Math.max(
        0,
        Math.min(basePlanetRadius * zoom, starRadius / 4)
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

    planetData.forEach(({ planet, px, py, planetRadius }, idx) => {
      ctx.beginPath();
      ctx.fillStyle = PLANET_COLORS[planet.type] || '#fff';
      ctx.arc(px, py, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      let iconX = px + planetRadius + 8;
      const iconY = py;
      if (planet.features) {
        planet.features.forEach((f) => {
          ctx.fillStyle = '#fff';
          if (f === 'base') {
            ctx.fillRect(iconX, iconY - 4, 8, 8);
          } else if (f === 'mine') {
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
      ctx.fillText(planet.name, px, py - planetRadius - 8);

      if (idx === hoveredIndex || idx === selectedIndex) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.arc(px, py, planetRadius + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.save();
    ctx.beginPath();
    ctx.shadowBlur = starRadius * 2;
    ctx.shadowColor = star.color;
    ctx.fillStyle = star.color;
    ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const overview = createOverview({
    update: updateLayout,
    draw,
    label: star.name,
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

  function isStarClicked(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const dx = cx - x;
    const dy = cy - y;
    return Math.sqrt(dx * dx + dy * dy) <= starRadius;
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

  let clickTimeout;

  canvas.addEventListener('click', (e) => {
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      const idx = getPlanetIndex(e);
      if (idx !== -1) {
        selectedIndex = idx;
        if (typeof onSelect === 'function') {
          onSelect(planetData[idx].planet);
        }
        draw();
      } else if (isStarClicked(e)) {
        selectedIndex = null;
        if (typeof onSelectStar === 'function') {
          onSelectStar(star);
        }
        draw();
      }
    }, 200);
  });

  canvas.addEventListener('dblclick', (e) => {
    clearTimeout(clickTimeout);
    const idx = getPlanetIndex(e);
    if (idx !== -1) {
      selectedIndex = idx;
      draw();
      if (typeof onOpenPlanet === 'function') {
        onOpenPlanet(planetData[idx].planet);
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
