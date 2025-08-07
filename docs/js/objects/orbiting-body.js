import {
  StellarObject,
  randomInt,
  randomRange,
  adjustPlanetType,
  generateAtmosphere,
  selectRule,
  interpolateSolarTemperature,
  calculateAtmosphericPressure,
  ATMOSPHERE_GRAVITY_THRESHOLD
} from './util.js';
import {
  PLANET_FEATURES,
  PLANET_RESOURCES,
  PLANET_ATMOSPHERES
} from '../data/planets.js';
import { generateBodyName } from '../name-generator.js';

const MIN_CHILD_STEP_RANGE = 0.01;
const MAX_CHILD_STEP_RANGE = 0.2;
const MIN_ROOT_STEP_RANGE = 0.3;
const MAX_ROOT_STEP_RANGE = 1.5;
const PARENT_RADIUS_LIMIT_FACTOR = 0.1;
const MIN_RADIUS_FACTOR = 0.5;
const MIN_RADIUS_DIFF = 0.01;
const RADIUS_EXPAND_FACTOR = 1.2;
const SMALL_BODY_RADIUS_THRESHOLD = 0.3;
const GAS_RADIUS_THRESHOLD = 4;
const SMALL_BODY_TYPES = ['rocky', 'martian', 'venusian'];
const LUMINOSITY_EXPONENT = 0.25;
const PARENT_GRAVITY_MULTIPLIER = 10;
const BASE_TEMPERATURE_SPAN = 50;
const PARENT_TEMP_INFLUENCE_FACTOR = 0.1;
const SURFACE_TEMP_LIMIT = 200;
const SURFACE_GRAVITY_LIMIT = 1.5;
const FULL_CIRCLE = Math.PI * 2;
const ECCENTRICITY_FACTOR = 0.6;
const MIN_HABITABLE_GRAVITY = 0.4;
const MAX_HABITABLE_GRAVITY = 20;
const MIN_HABITABLE_TEMP = 260;
const MAX_HABITABLE_TEMP = 320;
const MIN_HABITABLE_PRESSURE = 0.5;
const MAX_HABITABLE_PRESSURE = 2;
const MAX_RESOURCE_AMOUNT = 99;
const MIN_CALCULATED_GRAVITY = 0.1;
const MAX_CALCULATED_GRAVITY = 3;
const MAX_RADIUS_ATTEMPTS = 5;

export class OrbitingBody extends StellarObject {
  static kind = 'body';

  static generate(star, orbitIndex = 0, parent = null, siblings = []) {
    const baseDistance = parent ? parent.distance : 0;
    const step = parent
      ? (orbitIndex + 1) * randomRange(MIN_CHILD_STEP_RANGE, MAX_CHILD_STEP_RANGE)
      : (orbitIndex + 1) * randomRange(MIN_ROOT_STEP_RANGE, MAX_ROOT_STEP_RANGE);
    const distance = parent ? baseDistance + step : step;
    const prev = siblings[siblings.length - 1];

    const rule = selectRule(star, distance, prev);
    let [minR, maxR] = rule.radius;
    if (parent) {
      maxR = Math.min(maxR, parent.radius * PARENT_RADIUS_LIMIT_FACTOR);
      minR = Math.min(minR, maxR * MIN_RADIUS_FACTOR);
      if (maxR - minR < MIN_RADIUS_DIFF) {
        maxR = maxR * RADIUS_EXPAND_FACTOR;
        minR = maxR * MIN_RADIUS_FACTOR;
      }
    }
    let radius = randomRange(minR, maxR);
    let attempts = 0;
    while (
      siblings.some((s) => Math.abs(s.radius - radius) < MIN_RADIUS_DIFF) &&
      attempts < MAX_RADIUS_ATTEMPTS
    ) {
      radius = randomRange(minR, maxR);
      attempts++;
    }
    radius = Math.min(Math.max(radius, minR), maxR);

    let type = rule.name;
    if (type === 'gas' && radius <= GAS_RADIUS_THRESHOLD) {
      type = 'ice';
    }
    if (radius < SMALL_BODY_RADIUS_THRESHOLD) {
      const smallTypes = SMALL_BODY_TYPES;
      type = smallTypes[randomInt(0, smallTypes.length - 1)];
    }

    const baseTemperature =
      interpolateSolarTemperature(distance) *
      Math.pow(star.luminosity, LUMINOSITY_EXPONENT) *
      (star.temperatureModifier || 1);
    const parentInfluence = parent
      ? (parent.gravity / step) * PARENT_GRAVITY_MULTIPLIER
      : 0;
    const temperature = baseTemperature + parentInfluence;
    type = adjustPlanetType(type, temperature);
    if (type === 'gas' && radius <= GAS_RADIUS_THRESHOLD) {
      type = 'ice';
    }
    const temperatureSpan =
      BASE_TEMPERATURE_SPAN / distance +
      parentInfluence * PARENT_TEMP_INFLUENCE_FACTOR;
    const mass = Math.pow(radius, 3);
    const gravity = this.calculateGravity(parent);
    const orbitalPeriod = this.calculateOrbitalPeriod(
      step,
      distance,
      star,
      parent
    );
    const features = PLANET_FEATURES.filter((f) => {
      if (f.category === 'surface') {
        if (
          type === 'gas' ||
          temperature >= SURFACE_TEMP_LIMIT ||
          gravity >= SURFACE_GRAVITY_LIMIT
        ) {
          return false;
        }
      }
      if (f.name === 'orbitalMine' && type !== 'gas') {
        return false;
      }
      return Math.random() < f.chance;
    }).map((f) => f.name);
    const angle = Math.random() * FULL_CIRCLE;
    const eccentricity = Math.random() ** 2 * ECCENTRICITY_FACTOR;
    const orbitRotation = Math.random() * FULL_CIRCLE;
    const hasAtmosphere =
      gravity >= ATMOSPHERE_GRAVITY_THRESHOLD &&
      (PLANET_ATMOSPHERES[type] || []).length > 0;
    const atmosphere = hasAtmosphere ? generateAtmosphere(type) : null;
    const resources = this.generateResources(type, atmosphere);
    const atmosphericPressure = hasAtmosphere
      ? calculateAtmosphericPressure(type, gravity)
      : 0;
    const inHZ =
      distance >= star.habitableZone[0] &&
      distance <= star.habitableZone[1];
    const gravityOk =
      gravity >= MIN_HABITABLE_GRAVITY &&
      gravity <= MAX_HABITABLE_GRAVITY;
    const tempOk =
      temperature >= MIN_HABITABLE_TEMP &&
      temperature <= MAX_HABITABLE_TEMP;
    const pressureOk =
      atmosphericPressure >= MIN_HABITABLE_PRESSURE &&
      atmosphericPressure <= MAX_HABITABLE_PRESSURE;
    const isHabitable =
      ['terrestrial', 'water'].includes(type) &&
      inHZ &&
      gravityOk &&
      tempOk &&
      pressureOk;
    const name = generateBodyName(star.name, orbitIndex, parent);
    return new this({
      name,
      kind: this.kind,
      type,
      distance,
      orbitDistance: step,
      radius,
      gravity,
      mass,
      temperature,
      temperatureSpan,
      isHabitable,
      orbitalPeriod,
      features,
      angle,
      eccentricity,
      orbitRotation,
      resources,
      atmosphere,
      atmosphericPressure,
      moons: []
    });
  }

  static calculateGravity(parent) {
    return randomRange(MIN_CALCULATED_GRAVITY, MAX_CALCULATED_GRAVITY);
  }

  static calculateOrbitalPeriod(step, distance, star, parent) {
    return Math.sqrt(Math.pow(distance, 3) / star.mass);
  }

  static generateResources(type, atmosphere) {
    if (type === 'gas') {
      return atmosphere ? { ...atmosphere } : {};
    }
    const resourceList = PLANET_RESOURCES[type] || [];
    return resourceList.reduce((acc, res) => {
      acc[res] = randomInt(0, MAX_RESOURCE_AMOUNT);
      return acc;
    }, {});
  }
}
