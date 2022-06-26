export class Mouth {
  constructor({ radius, debug }) {
    this.debug = debug;
    this.x = null;
    this.y = null;

    this.radius = radius;
    this.mass = ((Math.PI * 4) / 3) * Math.pow(this.radius, 3);
  }
  updateRadius(radius) {
    this.radius = radius;
    this.mass = ((Math.PI * 4) / 3) * Math.pow(this.radius, 3);
  }
}
