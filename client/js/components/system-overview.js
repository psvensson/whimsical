const PLANET_COLORS = {
  lava: '#ff4500',
  rocky: '#b0b0b0',
  terrestrial: '#2ecc71',
  ice: '#87cefa',
  'gas giant': '#f1c40f'
};

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

  const planetData = planets.map((planet) => {
    const orbitRadius = planet.distance * scale;
    const px = cx + orbitRadius;
    const py = cy;
    const planetRadius = Math.max(2, planet.radius * 3);
    return { planet, orbitRadius, px, py, planetRadius };
  });

  let hoveredIndex = null;

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    planetData.forEach(({ planet, orbitRadius, px, py, planetRadius }, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = '#444';
      ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = PLANET_COLORS[planet.type] || '#fff';
      ctx.arc(px, py, planetRadius, 0, Math.PI * 2);
      ctx.fill();

       if (idx === hoveredIndex) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.arc(px, py, planetRadius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

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
    ctx.arc(cx, cy, star.size * 2, 0, Math.PI * 2);
    ctx.fill();
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
    hoveredIndex = getPlanetIndex(e);
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

