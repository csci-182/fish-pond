export class FinPiece {
  constructor(fin, prevPart, side, bias, opts) {
    this.debug = opts ? opts.debug : false;
    this.fin = fin;
    this.prevPart = prevPart;
    this.side = side;
    this.finOffset =
      -this.side * ((1 - this.fin.ratio) * 0.3 - 5 * this.fin.ratio);
    this.bias = (side * bias * Math.PI) / 8;
    this.velx = 0;
    this.vely = 0;

    this.x = null;
    this.y = null;
    this.radian = null;
    this.maxAngle = null;
    if (!this.prevPart) {
      [this.x, this.y] = this.fin.part.getPoint(
        this.fin.part.radius * 9,
        (this.side * Math.PI) / 2 + this.finOffset
      );
      this.maxAngle = this.fin.part.maxAngle * this.fin.ratio;
      this.radian =
        this.fin.part.radian +
        (Math.PI / 2) * -this.side +
        this.finOffset / 2 +
        this.bias;
    } else {
      this.maxAngle = this.prevPart.maxAngle;
      this.radian = this.prevPart.radian;
      [this.x, this.y] = this.prevPart.getPoint(this.fin.pieceLength, Math.PI);
    }
  }
  act() {
    if (!this.prevPart) {
      [this.x, this.y] = this.fin.part.getPoint(
        this.fin.part.radius * 9,
        (this.side * Math.PI) / 2 + this.finOffset
      );
      this.maxAngle = this.fin.part.maxAngle * this.fin.ratio;
      this.radian =
        this.fin.part.radian +
        (Math.PI / 2) * -this.side +
        this.finOffset / 2 +
        this.bias;
    } else {
      this.maxAngle = this.prevPart.maxAngle;
      let oldx = this.x;
      let oldy = this.y;
      this.x += this.velx;
      this.y += this.vely;
      this.updateRadian();
      let angleDiff = this.radian - this.prevPart.radian;
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      //pull self to prevPart
      if (angleDiff > 0) {
        if (angleDiff > this.maxAngle)
          [this.x, this.y] = this.prevPart.getPoint(
            this.fin.pieceLength,
            Math.PI + this.maxAngle
          );
        else {
          this.x =
            this.prevPart.x +
            this.fin.pieceLength * Math.cos(this.radian + Math.PI);
          this.y =
            this.prevPart.y +
            this.fin.pieceLength * Math.sin(this.radian + Math.PI);
        }
      } else {
        if (angleDiff < -this.maxAngle) {
          [this.x, this.y] = this.prevPart.getPoint(
            this.fin.pieceLength,
            Math.PI - this.maxAngle
          );
        } else {
          this.x =
            this.prevPart.x +
            this.fin.pieceLength * Math.cos(this.radian + Math.PI);
          this.y =
            this.prevPart.y +
            this.fin.pieceLength * Math.sin(this.radian + Math.PI);
        }
      }
      this.velx = (this.velx + this.x - oldx) / 5;
      this.vely = (this.vely + this.y - oldy) / 5;
    }
  }
  updateRadian() {
    const xdiff = this.prevPart.x - this.x;
    const ydiff = this.prevPart.y - this.y;
    if (xdiff === 0) {
      if (ydiff < 0) {
        this.radian = (Math.PI * 3) / 2;
      }
      this.radian = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if (xdiff > 0) {
      this.radian = radian;
    } else {
      this.radian = -Math.PI + radian;
    }
  }
  getPoint(radius, angle) {
    return [
      this.x + radius * Math.cos(angle + this.radian),
      this.y + radius * Math.sin(angle + this.radian),
    ];
  }
}
