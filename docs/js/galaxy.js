import { generateStar } from './star.js';

const DEFAULT_GALAXY_SIZE = 700;
const BASE_STAR_FORMATION_CHANCE = 0.002;
const STAR_FORMATION_MULTIPLIER = 10 / 3; // increased fivefold to expand the galaxy
const DEFAULT_STAR_FORMATION_CHANCE =
  BASE_STAR_FORMATION_CHANCE * STAR_FORMATION_MULTIPLIER;

export function generateStarSystem() {
  const star = generateStar();
  return { stars: [star], planets: star.planets };
}

export function generateGalaxy(
  size = DEFAULT_GALAXY_SIZE,
  chance = DEFAULT_STAR_FORMATION_CHANCE
) {
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
