import { StellarObject, randomRange, EARTH_MASS_IN_SOLAR } from '../objects/util.js';

export const MAX_PARENT_TEMPERATURE = 400;
const MIN_ORBIT_DISTANCE = 0.002;
const MAX_ORBIT_DISTANCE = 0.02;
const FULL_CIRCLE = Math.PI * 2;
const MAX_ECCENTRICITY = 0.01;
const FACILITY_RADIUS = 0.05;
const FACILITY_GRAVITY = 0;
const FACILITY_TEMPERATURE = 293;
const FACILITY_TEMPERATURE_SPAN = 0;
const FACILITY_ATMOSPHERIC_PRESSURE = 1;
const POPULATION_MIN = 100;
const POPULATION_MAX = 1000;

export class Facility extends StellarObject {
  constructor(props = {}) {
    super(props);
    this.storage = props.storage || [];
    this.features = props.features || [];
  }
}

export class OrbitalFacility extends Facility {
  static generate(star, orbitIndex, parent) {
    if (parent.temperature > MAX_PARENT_TEMPERATURE) return null;
    const orbitDistance =
      (orbitIndex + 1) * randomRange(MIN_ORBIT_DISTANCE, MAX_ORBIT_DISTANCE);
    const distance = parent.distance + orbitDistance;
    const angle = Math.random() * FULL_CIRCLE;
    const eccentricity = Math.random() * MAX_ECCENTRICITY;
    const orbitRotation = Math.random() * FULL_CIRCLE;
    const parentMassInSolar = parent.mass * EARTH_MASS_IN_SOLAR;
    const orbitalPeriod = Math.sqrt(
      Math.pow(orbitDistance, 3) / parentMassInSolar
    );
    const baseName = this.kind
      ? this.kind.charAt(0).toUpperCase() + this.kind.slice(1)
      : 'Facility';
    return new this({
      name: `${baseName} ${orbitIndex + 1}`,
      kind: this.kind,
      type: this.kind,
      distance,
      orbitDistance,
      radius: FACILITY_RADIUS,
      gravity: FACILITY_GRAVITY,
      temperature: FACILITY_TEMPERATURE,
      temperatureSpan: FACILITY_TEMPERATURE_SPAN,
      isHabitable: true,
      orbitalPeriod,
      features: [],
      storage: [],
      angle,
      eccentricity,
      orbitRotation,
      resources: {},
      atmosphere: null,
      atmosphericPressure: FACILITY_ATMOSPHERIC_PRESSURE,
      moons: [],
      population: Math.floor(randomRange(POPULATION_MIN, POPULATION_MAX))
    });
  }
}

export class SurfaceFacility extends Facility {}

