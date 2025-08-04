export function generatePlanet(star, orbitIndex) {
  const distance = (orbitIndex + 1) * randomRange(0.3, 1.5); // in AU
  const type = distance < star.habitableZone[0]
    ? 'rocky'
    : distance <= star.habitableZone[1]
    ? 'rocky'
    : 'gas';
  const radius = type === 'rocky'
    ? randomRange(0.3, 2)
    : randomRange(3, 12);
  const temperature = 278 * Math.pow(star.luminosity, 0.25) / Math.sqrt(distance);
  const isHabitable = type === 'rocky' &&
    distance >= star.habitableZone[0] &&
    distance <= star.habitableZone[1];
  const orbitalPeriod = Math.sqrt(Math.pow(distance, 3) / star.mass); // in Earth years
  return { type, distance, radius, temperature, isHabitable, orbitalPeriod };
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
