const STAR_TYPES = [
  {
    name: 'red dwarf',
    color: '#ff4d4d',
    size: 2,
    mass: [0.1, 0.5],
    luminosity: [0.001, 0.08],
    radius: [0.1, 0.6],
    habitableZone: [0.05, 0.4]
  },
  {
    name: 'yellow star',
    color: '#ffd700',
    size: 3,
    mass: [0.8, 1.2],
    luminosity: [0.6, 1.5],
    radius: [0.9, 1.1],
    habitableZone: [0.8, 1.5]
  },
  {
    name: 'blue giant',
    color: '#4d79ff',
    size: 4,
    mass: [10, 50],
    luminosity: [10000, 100000],
    radius: [4, 10],
    habitableZone: [10, 100]
  }
];

export function generateStar() {
  const type = STAR_TYPES[randomInt(0, STAR_TYPES.length - 1)];
  return {
    name: type.name,
    color: type.color,
    size: type.size,
    mass: randomRange(type.mass[0], type.mass[1]),
    luminosity: randomRange(type.luminosity[0], type.luminosity[1]),
    radius: randomRange(type.radius[0], type.radius[1]),
    habitableZone: type.habitableZone
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
