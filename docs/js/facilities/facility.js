import { StellarObject, randomRange } from '../objects/util.js';

export class Facility extends StellarObject {}

export class OrbitalFacility extends Facility {
  static generate(star, orbitIndex, parent) {
    if (parent.temperature > 400) return null;
    const orbitDistance = (orbitIndex + 1) * randomRange(0.001, 0.01);
    const distance = parent.distance + orbitDistance;
    const angle = Math.random() * Math.PI * 2;
    const eccentricity = Math.random() * 0.01;
    const orbitRotation = Math.random() * Math.PI * 2;
    const baseName = this.kind
      ? this.kind.charAt(0).toUpperCase() + this.kind.slice(1)
      : 'Facility';
    return new this({
      name: `${baseName} ${orbitIndex + 1}`,
      kind: this.kind,
      type: this.kind,
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

export class SurfaceFacility extends Facility {}

