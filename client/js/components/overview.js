import { generateGalaxy } from '../galaxy.js';

export function createOverview() {
  const overview = document.createElement('canvas');
  overview.id = 'overview';
  overview.width = 400;
  overview.height = 400;

  const galaxy = generateGalaxy();
  drawGalaxy(overview, galaxy);

  return overview;
}

function drawGalaxy(canvas, galaxy) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const size = galaxy.size;
  const scaleX = canvas.width / (size * 2 + 1);
  const scaleY = canvas.height / (size * 2 + 1);

  for (const { x, y, system } of galaxy.systems) {
    const star = system.stars[0];
    const cx = (x + size) * scaleX;
    const cy = (y + size) * scaleY;
    ctx.beginPath();
    ctx.fillStyle = star.color;
    ctx.arc(cx, cy, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
