import { StellarObject, randomRange } from './util.js';

export class Base extends StellarObject {
  static kind = 'base';

  static generate(star, orbitIndex, parent) {
    if (parent.temperature > 400) return null;
    const orbitDistance = (orbitIndex + 1) * randomRange(0.001, 0.01);
    const distance = parent.distance + orbitDistance;
    const angle = Math.random() * Math.PI * 2;
    const eccentricity = Math.random() * 0.01;
    const orbitRotation = Math.random() * Math.PI * 2;
    return new Base({
      name: `Base ${orbitIndex + 1}`,
      kind: 'base',
      type: 'base',
      distance,
      orbitDistance,
      radius: 0.05,
      gravity: parent.gravity,
      temperature: parent.temperature,
      temperatureSpan: parent.temperatureSpan,
      isHabitable: true,
      orbitalPeriod: Math.sqrt(Math.pow(distance, 3) / star.mass),
      features: [],
      angle,
      eccentricity,
      orbitRotation,
      resources: {},
      atmosphere: null,
      atmosphericPressure: 0,
      moons: [],
      population: Math.floor(randomRange(100, 1000))
    });
  }
}
