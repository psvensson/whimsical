export const PLANET_TYPES = [
  {
    name: 'lava',
    maxDistance: star => star.habitableZone[0] * 0.5,
    radius: [0.3, 2]
  },
  {
    name: 'rocky',
    maxDistance: star => star.habitableZone[0],
    radius: [0.3, 2]
  },
  {
    name: 'terrestrial',
    maxDistance: star => star.habitableZone[1],
    radius: [0.3, 2],
    habitable: true
  },
  {
    name: 'ice',
    maxDistance: star => star.habitableZone[1] * 2,
    radius: [0.5, 3]
  },
  {
    name: 'gas giant',
    maxDistance: () => Infinity,
    radius: [3, 12]
  }
];
