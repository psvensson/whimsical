import { Facility, OrbitalFacility, SurfaceFacility } from './facility.js';
import { Base } from './orbital/base.js';
import { Shipyard } from './orbital/shipyard.js';
import { OrbitalMine } from './orbital/orbital-mine.js';
import { OrbitalManufactory } from './orbital/orbital-manufactory.js';
import { OrbitalResearch } from './orbital/orbital-research.js';
import { JumpStation } from './orbital/jump-station.js';
import { Mine } from './surface/mine.js';
import { Spaceport } from './surface/spaceport.js';
import { Manufactory } from './surface/manufactory.js';
import { Research } from './surface/research.js';

export {
  Facility,
  OrbitalFacility,
  SurfaceFacility,
  Base,
  Shipyard,
  OrbitalMine,
  OrbitalManufactory,
  OrbitalResearch,
  JumpStation,
  Mine,
  Spaceport,
  Manufactory,
  Research
};

export const ORBITAL_FACILITY_CLASSES = {
  base: Base,
  shipyard: Shipyard,
  orbitalMine: OrbitalMine,
  orbitalManufactory: OrbitalManufactory,
  orbitalResearch: OrbitalResearch,
  jumpStation: JumpStation
};

export const SURFACE_FACILITY_CLASSES = {
  mine: Mine,
  spaceport: Spaceport,
  manufactory: Manufactory,
  research: Research
};

