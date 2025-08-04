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

export const PLANET_COLORS = {
  lava: '#ff4500',
  rocky: '#b0b0b0',
  terrestrial: '#2ecc71',
  ice: '#87cefa',
  'gas giant': '#f1c40f'
};

export const PLANET_FEATURES = [
  { name: 'base', chance: 0.1 },
  { name: 'mine', chance: 0.1 }
];
