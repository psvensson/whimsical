import { STAR_TYPES, STAR_CLASS_COLORS } from './data/stars.js';

export function generateStar() {
  const type = STAR_TYPES[randomInt(0, STAR_TYPES.length - 1)];
  return {
    class: type.class,
    name: type.name,
    color: STAR_CLASS_COLORS[type.class],
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
