export class Part {
  constructor({ radius, prevPart, segmentLength, fish, debug }) {
    //one time sets
    this.debug = debug;
    this.prevPart = prevPart;
    this.segmentLength = segmentLength;
    this.nextPart = null;
    this.commitMove = 0;
    this.dirCount = 0;
    this.x =
      this.prevPart.x +
      this.segmentLength * Math.cos(this.prevPart.radian + Math.PI);
    this.y =
      this.prevPart.y +
      this.segmentLength * Math.sin(this.prevPart.radian + Math.PI);
    this.atTarget = null;

    //set on mass change
    this.radius = radius;
    this.mass = ((Math.PI * 4) / 3) * Math.pow(this.radius, 3);
    this.maxAngle = Math.PI / Math.pow(Math.log(fish.mass), 1.1);
    this.maxAngle = ((this.radius * this.radius) / this.mass) * this.maxAngle;
    this.moveAngle = this.maxAngle / 3;
    this.commitMax = 3 + Math.floor(Math.pow(fish.mass, 1 / 2.5));

    //run at the end of init
    this.updateRadian();
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
  setNextPart(part) {
    if (this.nextPart === null) {
      this.nextPart = part;
      return true;
    }
    return false;
  }
  updateRadius(radius, fish) {
    this.radius = radius;
    this.mass = ((Math.PI * 4) / 3) * Math.pow(this.radius, 3);
    this.maxAngle = Math.PI / Math.pow(Math.log(fish.mass), 1);
    this.maxAngle = ((this.radius * this.radius) / this.mass) * this.maxAngle;
    this.moveAngle = this.maxAngle / 3;
    this.commitMax = 1 + Math.floor(Math.pow(fish.mass, 1 / 2.7));
    this.updateRadian();
  }
  rotate(angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const dx = this.x - this.prevPart.x;
    const dy = this.y - this.prevPart.y;

    this.x = dx * c - dy * s + this.prevPart.x;
    this.y = dx * s + dy * c + this.prevPart.y;
  }
  act(fish) {
    let oldx = this.x;
    let oldy = this.y;
    this.updateRadian();
    let angleDiff = this.radian - this.prevPart.radian;
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    //pull self to prevPart
    if (Math.abs(angleDiff) > this.maxAngle) {
      //angle correction
      this.commitMove = 0;
      if (angleDiff > 0) {
        if (angleDiff - this.maxAngle > this.moveAngle * 2) {
          const rad = this.prevPart.radian + Math.PI + this.maxAngle * 0.8;
          this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);
          this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);
        } else {
          this.x =
            this.prevPart.x +
            this.segmentLength * Math.cos(this.radian + Math.PI);
          this.y =
            this.prevPart.y +
            this.segmentLength * Math.sin(this.radian + Math.PI);
          this.rotate(-this.moveAngle);
        }
      } else {
        if (angleDiff + this.maxAngle < -this.moveAngle * 2) {
          const rad = this.prevPart.radian + Math.PI - this.maxAngle * 0.8;
          this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);
          this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);
        } else {
          this.x =
            this.prevPart.x +
            this.segmentLength * Math.cos(this.radian + Math.PI);
          this.y =
            this.prevPart.y +
            this.segmentLength * Math.sin(this.radian + Math.PI);
          this.rotate(this.moveAngle);
        }
      }
    }
    //movement
    else {
      //pulls self to prevPart
      this.x =
        this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);
      this.y =
        this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);
      angleDiff = this.radian - fish.targetDir;
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      else if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      if (this.commitMove < 0) {
        this.rotate(-this.moveAngle);
        this.commitMove += 1;
      } else if (this.commitMove > 0) {
        this.rotate(this.moveAngle);
        this.commitMove -= 1;
      } else if (angleDiff > 0) {
        if (angleDiff < 0.1) {
          this.commitMove = -this.commitMax;
        }
        this.rotate(-this.moveAngle);
        if (this.dirCount > 2 * this.commitMax) {
          this.commitMove = 1 + Math.floor(this.commitMax / 3);
          this.dirCount = 0;
        } else if (this.dirCount > 0) this.dirCount++;
        else {
          this.dirCount = 1;
        }
      } else {
        if (angleDiff > -0.1) {
          this.commitMove = this.commitMax;
        }
        this.rotate(this.moveAngle);
        if (this.dirCount < -2 * this.commitMax) {
          this.commitMove = -1 - Math.floor(this.commitMax / 3);
          this.dirCount = 0;
        } else if (this.dirCount < 0) this.dirCount--;
        else {
          this.dirCount = -1;
        }
      }
    }

    this.updateRadian();

    if (this.nextPart) {
      const ratio = this.mass / fish.mass;
      fish.newvelx += (oldx - this.x) * ratio;
      fish.newvely += (oldy - this.y) * ratio;
      this.nextPart.act(fish);
    } else {
      let distMod = 0;
      if (
        fish.target &&
        fish.target.getDistance(fish.mouth.x, fish.mouth.y) > 300
      ) {
        distMod =
          (5 / fish.mass) *
          (1 - 50 / fish.target.getDistance(fish.mouth.x, fish.mouth.y));
      }

      let dir = fish.parts[0].radian - fish.targetDir;
      if (dir > Math.PI) dir -= Math.PI * 2;
      else if (dir < -Math.PI) dir += Math.PI * 2;

      //orient fish
      const ratio = this.mass / fish.mass;
      const xdiff = oldx - this.x;
      const ydiff = oldy - this.y;
      fish.newvelx += xdiff * ratio;
      fish.newvely += ydiff * ratio;
      //move forward
      this.atTarget =
        Math.pow(1 - (2 * Math.abs(dir)) / Math.PI, 3) + distMod * 5;
      const movDist = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
      fish.velx +=
        ((movDist * Math.cos(fish.parts[0].radian)) / 10) * this.atTarget;
      fish.vely +=
        ((movDist * Math.sin(fish.parts[0].radian)) / 10) * this.atTarget;
    }
  }
  move(x, y) {
    this.x += x;
    this.y += y;

    if (this.nextPart) this.nextPart.move(x, y);
  }
  getPoint(radius, angle) {
    return [
      this.x + radius * Math.cos(angle + this.radian),
      this.y + radius * Math.sin(angle + this.radian),
    ];
  }
}
