import { generateStar } from './star.js';

export function generateStarSystem() {
  const star = generateStar();
  return { stars: [star], planets: star.planets };
}

// Default star formation chance increased fivefold to expand the galaxy
export function generateGalaxy(size = 700, chance = 0.002 * 10 / 3) {
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
