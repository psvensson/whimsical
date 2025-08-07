export class Craft {
  constructor(mass, acceleration, name, speed) {
    this.mass = mass;
    this.acceleration = acceleration;
    this.name = name;
    this.speed = speed;
  }
}

export class Probe extends Craft {
  constructor(mass, acceleration, name, speed) {
    super(mass, acceleration, name, speed);
  }
}
