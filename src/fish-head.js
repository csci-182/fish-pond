export class Head {
  constructor({ radius, radian, prevPart, x, y, debug }) {
    this.debug = debug;
    this.x = x;
    this.y = y;
    this.radian = radian;

    this.radius = radius;
    this.mass = ((Math.PI * 4) / 3) * Math.pow(this.radius, 3);

    this.prevPart = prevPart;
    this.prevPart.x = this.x + this.radius * 1.3 * 10 * Math.cos(this.radian);
    this.prevPart.y = this.y + this.radius * 1.3 * 10 * Math.sin(this.radian);

    this.nextPart = null;
  }
  setNextPart(part) {
    if (this.nextPart === null) {
      this.nextPart = part;
      return true;
    }
    return false;
  }
  updateRadius(radius) {
    this.radius = radius;
    this.mass = ((Math.PI * 4) / 3) * Math.pow(this.radius, 3);
    // this.nextPart.segmentLength=this.radius;
  }
  getPoint(radius, angle, radian) {
    radian = radian || this.radian;
    return [
      this.x + radius * Math.cos(angle + radian),
      this.y + radius * Math.sin(angle + radian),
    ];
  }
  move(x, y) {
    this.nextPart.move(x, y);
    this.radian = this.nextPart.radian;
    this.x = this.nextPart.x + this.radius * 10 * Math.cos(this.radian);
    this.y = this.nextPart.y + this.radius * 10 * Math.sin(this.radian);
    this.prevPart.x = this.x + this.radius * 1.3 * 10 * Math.cos(this.radian);
    this.prevPart.y = this.y + this.radius * 1.3 * 10 * Math.sin(this.radian);
  }
}
