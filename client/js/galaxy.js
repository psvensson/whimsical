export function generateStarSystem() {
  const STAR_TYPES = [
    { name: 'red dwarf', color: '#ff4d4d', size: 2 },
    { name: 'yellow star', color: '#ffd700', size: 3 },
    { name: 'blue giant', color: '#4d79ff', size: 4 }
  ];

  const stars = Array.from(
    { length: randomInt(1, 3) },
    () => STAR_TYPES[randomInt(0, STAR_TYPES.length - 1)]
  );

  const planets = Array.from(
    { length: randomInt(0, 10) },
    () => ({ type: Math.random() < 0.5 ? 'rocky' : 'gas' })
  );

  return { stars, planets };
}

export function generateGalaxy(size = 100, chance = 0.1) {
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
