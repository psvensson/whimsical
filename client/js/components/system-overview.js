const PLANET_COLORS = {
  lava: '#ff4500',
  rocky: '#b0b0b0',
  terrestrial: '#2ecc71',
  ice: '#87cefa',
  'gas giant': '#f1c40f'
};

export function createSystemOverview(system, onBack) {
  const container = document.createElement('div');
  container.className = 'system-overview';

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const star = system.stars[0];
  const planets = system.planets;
  const maxDistance = Math.max(...planets.map(p => p.distance), 1);
  const scale = (canvas.width / 2 - 20) / maxDistance;

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    planets.forEach((planet) => {
      const orbitRadius = planet.distance * scale;
      ctx.beginPath();
      ctx.strokeStyle = '#444';
      ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
      ctx.stroke();

      const px = cx + orbitRadius;
      const py = cy;
      const planetRadius = Math.max(2, planet.radius * 3);
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
    ctx.arc(cx, cy, star.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }

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

