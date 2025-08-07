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

export class OrbitingBody extends StellarObject {
  static kind = 'body';

  static generate(star, orbitIndex = 0, parent = null, siblings = []) {
    const baseDistance = parent ? parent.distance : 0;
    const step = parent
      ? (orbitIndex + 1) * randomRange(0.01, 0.2)
      : (orbitIndex + 1) * randomRange(0.3, 1.5);
    const distance = parent ? baseDistance + step : step;
    const prev = siblings[siblings.length - 1];

    const rule = selectRule(star, distance, prev);
    let [minR, maxR] = rule.radius;
    if (parent) {
      maxR = Math.min(maxR, parent.radius * 0.1);
      minR = Math.min(minR, maxR * 0.5);
      if (maxR - minR < 0.01) {
        maxR = maxR * 1.2;
        minR = maxR * 0.5;
      }
    }
    let radius = randomRange(minR, maxR);
    let attempts = 0;
    while (
      siblings.some((s) => Math.abs(s.radius - radius) < 0.01) &&
      attempts < 5
    ) {
      radius = randomRange(minR, maxR);
      attempts++;
    }
    radius = Math.min(Math.max(radius, minR), maxR);

    let type = rule.name;
    if (type === 'gas' && radius <= 4) {
      type = 'ice';
    }
    if (radius < 0.3) {
      const smallTypes = ['rocky', 'martian', 'venusian'];
      type = smallTypes[randomInt(0, smallTypes.length - 1)];
    }

    const baseTemperature =
      interpolateSolarTemperature(distance) *
      Math.pow(star.luminosity, 0.25) *
      (star.temperatureModifier || 1);
    const parentInfluence = parent ? (parent.gravity / step) * 10 : 0;
    const temperature = baseTemperature + parentInfluence;
    type = adjustPlanetType(type, temperature);
    if (type === 'gas' && radius <= 4) {
      type = 'ice';
    }
    const temperatureSpan = 50 / distance + parentInfluence * 0.1;
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
        if (type === 'gas' || temperature >= 200 || gravity >= 1.5) {
          return false;
        }
      }
      if (f.name === 'orbitalMine' && type !== 'gas') {
        return false;
      }
      return Math.random() < f.chance;
    }).map((f) => f.name);
    const angle = Math.random() * Math.PI * 2;
    const eccentricity = Math.random() ** 2 * 0.6;
    const orbitRotation = Math.random() * Math.PI * 2;
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
    const gravityOk = gravity >= 0.4 && gravity <= 1.6;
    const tempOk = temperature >= 250 && temperature <= 320;
    const pressureOk =
      atmosphericPressure >= 0.4 && atmosphericPressure <= 2.3;
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
    return randomRange(0.1, 3);
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
      acc[res] = randomInt(0, 99);
      return acc;
    }, {});
  }
}
