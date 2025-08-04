export const PLANET_TYPES = [
  {
    name: 'lava',
    bias: 'inner',
    maxDistance: star => star.habitableZone[0] * 0.5,
    radius: [0.3, 2]
  },
  {
    name: 'rocky',
    bias: 'inner',
    maxDistance: star => star.habitableZone[0],
    radius: [0.3, 2]
  },
  {
    name: 'terrestrial',
    bias: 'inner',
    maxDistance: star => star.habitableZone[1],
    radius: [0.3, 2],
    habitable: true
  },
  {
    name: 'ice',
    bias: 'outer',
    maxDistance: star => star.habitableZone[1] * 2,
    radius: [0.5, 3]
  },
  {
    name: 'gas giant',
    bias: 'outer',
    maxDistance: () => Infinity,
    radius: [4, 12]
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

export const PLANET_RESOURCES = {
  lava: ['sulfur', 'silicates', 'iron'],
  rocky: ['iron', 'cobalt', 'uranium', 'carbon', 'silicon', 'nickel', 'water'],
  terrestrial: [
    'iron',
    'cobalt',
    'uranium',
    'carbon',
    'silicon',
    'nickel',
    'water',
    'oxygen'
  ],
  ice: ['water', 'methane', 'ammonia', 'nitrogen'],
  'gas giant': ['hydrogen', 'helium', 'methane', 'ammonia']
};

export const PLANET_ATMOSPHERES = {
  lava: [],
  rocky: ['carbon dioxide', 'nitrogen'],
  terrestrial: ['nitrogen', 'oxygen', 'argon'],
  ice: ['nitrogen', 'methane'],
  'gas giant': ['hydrogen', 'helium', 'methane', 'ammonia']
};

// Rules for determining the maximum number of moons based on planet size
export const MOON_RULES = [
  { minRadius: 3, maxMoons: 5 },
  { minRadius: 1, maxMoons: 3 },
  { minRadius: 0, maxMoons: 1 }
];
