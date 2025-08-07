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
  Base,
  Shipyard,
  'Orbital Mine': OrbitalMine,
  'Orbital Manufactory': OrbitalManufactory,
  'Orbital Research Facility': OrbitalResearch,
  'Jump Station': JumpStation,
};

export const SURFACE_FACILITY_CLASSES = {
  Mine,
  Spaceport,
  Manufactory,
  'Research Facility': Research,
};

