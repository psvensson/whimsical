import { generateStellarObject } from './stellar-object.js';

export function generateStarSystem() {
  const star = generateStellarObject('star');
  return { stars: [star], planets: star.planets };
}

// Default star formation chance reduced by a third to thin out the galaxy
export function generateGalaxy(size = 500, chance = 0.001 * 2 / 3) {
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
