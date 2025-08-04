export function generatePlanet(star, orbitIndex) {
  const distance = (orbitIndex + 1) * randomRange(0.3, 1.5); // in AU
  const inner = star.habitableZone[0];
  const outer = star.habitableZone[1];

  let type;
  if (distance < inner * 0.5) {
    type = 'lava';
  } else if (distance < inner) {
    type = 'rocky';
  } else if (distance <= outer) {
    type = 'terrestrial';
  } else if (distance <= outer * 2) {
    type = 'ice';
  } else {
    type = 'gas giant';
  }

  let radius;
  if (type === 'gas giant') {
    radius = randomRange(3, 12);
  } else if (type === 'ice') {
    radius = randomRange(0.5, 3);
  } else {
    radius = randomRange(0.3, 2);
  }

  const temperature = 278 * Math.pow(star.luminosity, 0.25) / Math.sqrt(distance);
  const isHabitable =
    type === 'terrestrial' && distance >= inner && distance <= outer;
  const orbitalPeriod = Math.sqrt(Math.pow(distance, 3) / star.mass); // in Earth years
  return { type, distance, radius, temperature, isHabitable, orbitalPeriod };
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
