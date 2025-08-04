import { generateStar } from './star.js';
import { generateBody } from './planet.js';

export function generateStarSystem() {
  const star = generateStar();
  const planetCount = randomInt(0, 10);
  const planets = [];
  for (let i = 0; i < planetCount; i++) {
    planets.push(generateBody(star, i, null, planets));
  }
  return { stars: [star], planets };
}

export function generateGalaxy(size = 500, chance = 0.001) {
  const systems = [];
  for (let x = -size; x <= size; x++) {
    for (let y = -size; y <= size; y++) {
      if (Math.random() < chance) {
        systems.push({ x, y, system: generateStarSystem() });
      }
    }
  }
  return { size, systems };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
