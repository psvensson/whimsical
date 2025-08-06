import {
  ATMOSPHERE_GRAVITY_THRESHOLD,
  randomInt,
  randomRange,
  adjustPlanetType,
  StellarObject
} from './objects/util.js';
import { Planet } from './objects/planet.js';
import { Moon } from './objects/moon.js';
import {
  Base,
  Shipyard,
  OrbitalMine,
  OrbitalManufactory,
  OrbitalResearch,
  JumpStation
} from './facilities/index.js';

const generators = {
  planet: Planet,
  moon: Moon,
  base: Base,
  shipyard: Shipyard,
  orbitalMine: OrbitalMine,
  orbitalManufactory: OrbitalManufactory,
  orbitalResearch: OrbitalResearch,
  jumpStation: JumpStation
};

export { ATMOSPHERE_GRAVITY_THRESHOLD, randomInt, randomRange, adjustPlanetType, StellarObject };

export function generateStellarObject(
  kind,
  star = null,
  orbitIndex = 0,
  parent = null,
  siblings = []
) {
  const Generator = generators[kind];
  if (!Generator) throw new Error(`Unknown kind: ${kind}`);
  return Generator.generate(star, orbitIndex, parent, siblings);
}
