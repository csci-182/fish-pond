export class TailPiece {
  constructor(tail, prevPart, offset, opts) {
    this.debug = opts ? opts.debug : false;
    this.prevPart = prevPart;
    this.offset = offset;
    this.velx = 0;
    this.vely = 0;
    this.x = null;
    this.y = null;

    if (!this.prevPart) this.prevPart = tail.tip;
    this.radian = this.prevPart.radian;
    this.maxAngle = this.prevPart.maxAngle;
    //pull self to tail
    [this.x, this.y] = this.prevPart.getPoint(
      tail.pieceLength,
      this.prevPart.radian + Math.PI
    );
  }
  act(tail) {
    let oldx = this.x;
    let oldy = this.y;
    this.x += this.velx;
    this.y += this.vely;
    this.updateRadian();
    let angleDiff = this.radian + this.offset / 3 - this.prevPart.radian;
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    //pull self to prevPart
    if (Math.abs(angleDiff) > tail.maxAngle) {
      //angle correction
      if (angleDiff > 0) {
        if (angleDiff - tail.maxAngle > tail.maxAngle / 2) {
          const rad = this.prevPart.radian + Math.PI + tail.maxAngle;
          this.x = this.prevPart.x + tail.pieceLength * Math.cos(rad);
          this.y = this.prevPart.y + tail.pieceLength * Math.sin(rad);
        } else {
          this.x =
            this.prevPart.x +
            tail.pieceLength * Math.cos(this.radian + Math.PI);
          this.y =
            this.prevPart.y +
            tail.pieceLength * Math.sin(this.radian + Math.PI);
          // this.rotate(-tail.maxAngle/5);
        }
      } else {
        if (angleDiff + tail.maxAngle < -tail.maxAngle / 2) {
          const rad = this.prevPart.radian + Math.PI - tail.maxAngle;
          this.x = this.prevPart.x + tail.pieceLength * Math.cos(rad);
          this.y = this.prevPart.y + tail.pieceLength * Math.sin(rad);
        } else {
          this.x =
            this.prevPart.x +
            tail.pieceLength * Math.cos(this.radian + Math.PI);
          this.y =
            this.prevPart.y +
            tail.pieceLength * Math.sin(this.radian + Math.PI);
          // this.rotate(tail.maxAngle/5);
        }
      }
    } else {
      this.x =
        this.prevPart.x + tail.pieceLength * Math.cos(this.radian + Math.PI);
      this.y =
        this.prevPart.y + tail.pieceLength * Math.sin(this.radian + Math.PI);
    }
    this.velx = (this.velx + this.x - oldx) / 5;
    this.vely = (this.vely + this.y - oldy) / 5;
  }
  rotate(angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const dx = this.x - this.prevPart.x;
    const dy = this.y - this.prevPart.y;

    this.x = dx * c - dy * s + this.prevPart.x;
    this.y = dx * s + dy * c + this.prevPart.y;
  }
  updateRadian() {
    const xdiff = this.prevPart.x - this.x;
    const ydiff = this.prevPart.y - this.y;
    if (xdiff === 0) {
      if (ydiff < 0) this.radian = (Math.PI * 3) / 2;
      this.radian = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if (xdiff > 0) this.radian = radian;
    else this.radian = -Math.PI + radian;
  }
  getPoint(radius, angle) {
    return [
      this.x + radius * Math.cos(angle + this.radian),
      this.y + radius * Math.sin(angle + this.radian),
    ];
  }
}
