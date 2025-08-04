import { PLANET_COLORS } from '../data/planets.js';

export function createSystemOverview(
  system,
  onBack,
  onSelectPlanet,
  width = 400,
  height = 400
) {
  const container = document.createElement('div');
  container.className = 'system-overview';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const star = system.stars[0];
  const planets = system.planets;
  const maxDistance = Math.max(...planets.map(p => p.distance), 1);
  const scale = (canvas.width / 2 - 20) / maxDistance;

  const starRadius = star.size * 2;
  const planetData = planets.map((planet) => {
    const orbitA = planet.distance * scale;
    const e = planet.eccentricity || 0;
    const orbitB = orbitA * Math.sqrt(1 - e * e);
    const rotation = planet.orbitRotation || 0;
    const theta = planet.angle;
    const r = (orbitA * (1 - e * e)) / (1 + e * Math.cos(theta));
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const xRot = x * Math.cos(rotation) - y * Math.sin(rotation);
    const yRot = x * Math.sin(rotation) + y * Math.cos(rotation);
    const px = cx + xRot;
    const py = cy + yRot;
    const planetRadius = Math.min(planet.radius * 3, starRadius - 1);
    return { planet, orbitA, orbitB, e, rotation, theta, px, py, planetRadius };
  });

  let hoveredIndex = null;

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw orbits first so they appear beneath planets
    ctx.lineWidth = 1;
    planetData.forEach(({ orbitA, orbitB, e, rotation }) => {
      ctx.beginPath();
      ctx.strokeStyle = '#444';
      const centerX = cx + orbitA * e * Math.cos(rotation);
      const centerY = cy + orbitA * e * Math.sin(rotation);
      // Draw orbit as an ellipse with the star at one focus
      ctx.ellipse(centerX, centerY, orbitA, orbitB, rotation, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw planets and their feature icons
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

    // Draw the star
    ctx.beginPath();
    ctx.fillStyle = star.color;
    ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
    ctx.fill();

    // Highlight hovered planet if applicable
    if (hoveredIndex !== null) {
      const { px, py, planetRadius } = planetData[hoveredIndex];
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.arc(px, py, planetRadius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function getPlanetIndex(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
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

  draw();

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back';
  backBtn.addEventListener('click', () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  });

  container.append(canvas, backBtn);
  return container;
}

