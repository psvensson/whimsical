import { OrbitingBody } from './orbiting-body.js';
import { generateMoons } from './moon.js';

export class Planet extends OrbitingBody {
  static kind = 'planet';

  static generate(star, orbitIndex, parent, siblings) {
    const body = super.generate(star, orbitIndex, parent, siblings);
    body.moons = generateMoons(star, body);
    return body;
  }
}
