import { ORBITAL_FACILITY_CLASSES } from '../facilities/index.js';

const EXCLUDED_KINDS = new Set(Object.keys(ORBITAL_FACILITY_CLASSES));

function countBodies(bodies) {
  return bodies.reduce((total, body) => {
    let count = body.isHabitable && !EXCLUDED_KINDS.has(body.kind) ? 1 : 0;
    if (body.moons?.length) count += countBodies(body.moons);
    return total + count;
  }, 0);
}

export function countHabitableWorlds(galaxy) {
  return galaxy.systems.reduce((sum, { system }) => {
    return (
      sum +
      system.stars.reduce((starTotal, star) => {
        return starTotal + countBodies(star.planets || []);
      }, 0)
    );
  }, 0);
}
