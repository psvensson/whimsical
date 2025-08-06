export const PLANET_TYPES = [
  {
    name: 'rocky',
    bias: 'inner',
    maxDistance: star => star.habitableZone[0],
    radius: [0.3, 2]
  },
  {
    name: 'martian',
    bias: 'outer',
    maxDistance: star => star.habitableZone[1] * 1.5,
    radius: [0.3, 1]
  },
  {
    name: 'venusian',
    bias: 'inner',
    maxDistance: star => star.habitableZone[0] * 0.8,
    radius: [0.5, 1.5]
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
    name: 'water',
    bias: 'outer',
    maxDistance: star => star.habitableZone[1] * 2,
    radius: [0.5, 3]
  },
  {
    name: 'gas',
    bias: 'outer',
    maxDistance: () => Infinity,
    radius: [4, 12]
  }
];

export const PLANET_COLORS = {
  rocky: '#b0b0b0',
  martian: '#b22222',
  venusian: '#e6b422',
  terrestrial: '#2ecc71',
  ice: '#87cefa',
  water: '#1e90ff',
  gas: '#f1c40f'
};

export const PLANET_FEATURES = [
  { name: 'base', chance: 0.1 },
  { name: 'mine', chance: 0.1 }
];

export const PLANET_RESOURCES = {
  rocky: ['iron', 'cobalt', 'uranium', 'carbon', 'silicon', 'nickel', 'water'],
  martian: ['iron', 'carbon', 'silicon', 'nickel', 'water'],
  venusian: ['sulfur', 'carbon', 'silicon', 'iron'],
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
  water: ['water', 'methane', 'ammonia', 'nitrogen'],
  gas: ['hydrogen', 'helium', 'methane', 'ammonia']
};

export const PLANET_ATMOSPHERES = {
  rocky: ['carbon dioxide', 'nitrogen'],
  martian: ['carbon dioxide', 'argon', 'nitrogen'],
  venusian: ['carbon dioxide', 'nitrogen'],
  terrestrial: ['nitrogen', 'oxygen', 'argon'],
  ice: ['nitrogen', 'methane'],
  water: ['nitrogen', 'oxygen', 'water vapor'],
  gas: ['hydrogen', 'helium', 'methane', 'ammonia']
};

export const PLANET_PRESSURES = {
  martian: { range: [0.01, 0.3] },
  venusian: { range: [5, 10] },
  default: { multiplier: 1.2 }
};

// Rules for determining the maximum number of moons based on planet size
export const MOON_RULES = [
  { minRadius: 3, maxMoons: 5 },
  { minRadius: 1, maxMoons: 3 },
  { minRadius: 0, maxMoons: 1 }
];
