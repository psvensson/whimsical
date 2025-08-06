export const STAR_CLASS_COLORS = {
  O: '#9bbcff',
  B: '#aabfff',
  A: '#cad8ff',
  F: '#f8f7ff',
  G: '#fff4e8',
  K: '#ffd1a3',
  M: '#ff4d4d'
};

export const STAR_TYPES = [
  {
    class: 'O',
    name: 'O-type star',
    size: 5,
    mass: [16, 100],
    luminosity: [30000, 1000000],
    radius: [6.6, 15],
    habitableZone: [100, 1000],
    temperatureModifier: 1.8
  },
  {
    class: 'B',
    name: 'B-type star',
    size: 4,
    mass: [2.1, 16],
    luminosity: [25, 30000],
    radius: [1.8, 6.6],
    habitableZone: [5, 100],
    temperatureModifier: 1.5
  },
  {
    class: 'A',
    name: 'A-type star',
    size: 4,
    mass: [1.4, 2.1],
    luminosity: [5, 25],
    radius: [1.4, 1.8],
    habitableZone: [2, 5],
    temperatureModifier: 1.3
  },
  {
    class: 'F',
    name: 'F-type star',
    size: 3,
    mass: [1.04, 1.4],
    luminosity: [1.5, 5],
    radius: [1.15, 1.4],
    habitableZone: [1.3, 2.2],
    temperatureModifier: 1.1
  },
  {
    class: 'G',
    name: 'G-type star',
    size: 3,
    mass: [0.8, 1.04],
    luminosity: [0.6, 1.5],
    radius: [0.9, 1.15],
    habitableZone: [0.95, 1.4],
    temperatureModifier: 1
  },
  {
    class: 'K',
    name: 'K-type star',
    size: 2,
    mass: [0.45, 0.8],
    luminosity: [0.08, 0.6],
    radius: [0.7, 0.96],
    habitableZone: [0.38, 0.8],
    temperatureModifier: 0.9
  },
  {
    class: 'M',
    name: 'M-type star',
    size: 2,
    mass: [0.08, 0.45],
    luminosity: [0.0001, 0.08],
    radius: [0.1, 0.7],
    habitableZone: [0.02, 0.4],
    temperatureModifier: 0.8
  }
];
