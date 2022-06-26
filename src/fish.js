import { Mouth } from "./fish-mouth.js";
import { Head } from "./fish-head.js";
import { Part } from "./fish-part.js";
import { Tail } from "./fish-tail.js";
import { Fins } from "./fish-fins.js";

export class Fish {
  constructor({ mass, x, y, direction, pond, debug }) {
    this.debug = debug;
    this.palette = [
      [70, 70, 70], //black
      [226, 79, 24], //orange
      [255, 245, 45], //yellow
      [253, 230, 230], //white
    ];
    const idx = Math.floor(Math.random() * this.palette.length);
    this.fillColor = this.getColor(idx, this.palette);
    this.eyeColor = this.getEyeColor(idx, this.palette);
    this.strokeColor = this.getStrokeColor(idx, this.palette);

    this.pond = pond;
    this.counter = 0;

    this.mass = mass || 50;

    this.segmentLength = 10;

    this.ripple = false;

    this.velx = 0;
    this.vely = 0;
    this.target = null;

    this.targetDir = Math.PI / 4 + Math.PI / 2;
    //used to orient the fish on initialization
    const radian = direction || Math.random() * Math.PI * 2;

    //=POWER(F36/((5+INT(LN(F36)))*PI()),1/3)
    const maxRadius = Math.cbrt(
      this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI)
    );

    //mouth init
    this.mouth = new Mouth({
      debug: this.debug,
      radius: maxRadius / 2,
    });

    //head init
    this.head = new Head({
      debug: this.debug,
      radius: maxRadius,
      radian: radian,
      prevPart: this.mouth,
      x: x,
      y: y,
    });

    const modifier = (this.head.mass + this.mouth.mass) / this.mass;

    this.parts = [];
    this.parts.push(
      new Part({
        debug: this.debug,
        radius: maxRadius,
        prevPart: this.head,
        segmentLength: this.head.radius * 10,
        fish: this,
      })
    );
    this.head.setNextPart(this.parts[0]);
    let part;
    for (let i = 1; this.parts[i - 1].radius > 0.5; i++) {
      part = new Part({
        debug: this.debug,
        radius: this.parts[i - 1].radius - modifier,
        prevPart: this.parts[i - 1],
        segmentLength: this.segmentLength,
        fish: this,
      });
      this.parts[i - 1].setNextPart(part);
      this.parts.push(part);
    }
    this.tail = new Tail(this, this.head.radius, {
      debug: this.debug,
    });
    this.fins = new Fins(this, this.head.radius, {
      debug: this.debug,
    });
  }
  getColor(idx, palette) {
    const color = palette[idx];
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
  }
  getEyeColor(idx, palette) {
    const color = palette[idx];
    return `rgba(${color[0] * 0.4}, ${color[1] * 0.4}, ${color[2] * 0.4}, 0.2)`;
  }
  getStrokeColor(idx, palette) {
    const color = palette[idx];
    return `rgba(${color[0] * 0.8}, ${color[1] * 0.8}, ${color[2] * 0.8}, 0.3)`;
  }
  updateTargetDir(x, y) {
    if (!this.target) return (this.target = null);
    const xdiff = this.target.x - this.mouth.x;
    const ydiff = this.target.y - this.mouth.y;
    if (xdiff === 0) {
      if (ydiff < 0) this.targetDir = (Math.PI * 3) / 2;
      this.targetDir = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if (xdiff > 0) this.targetDir = radian;
    else this.targetDir = -Math.PI + radian;
  }
  foodNotify(food) {
    if (
      this.target &&
      food.getDistance(this.mouth.x, this.mouth.y) <
        this.target.getDistance(this.mouth.x, this.mouth.y)
    )
      this.target = food;
    else if (!this.target) this.target = food;
  }
  feed(x) {
    this.ripple = true;
    this.updateMass(this.mass + x);
    this.change();
  }
  change() {
    this.counter++;
    if (this.counter > 1) {
      this.counter = 0;
      const rand = Math.random() * 3;
      if (rand < 1) this.tail.change();
      else if (rand < 2) this.fins.change();
      else {
        this.tail.change();
        this.fins.change();
      }
    }
  }
  updateMass(mass) {
    // return;
    this.mass = mass > 50 ? mass : 50;

    const maxRadius = Math.cbrt(
      this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI)
    );

    //mouth update
    this.mouth.updateRadius(maxRadius / 2);

    //head update
    this.head.updateRadius(maxRadius);

    this.parts[0].updateRadius(maxRadius, this);

    const modifier = (this.head.mass + this.mouth.mass) / this.mass;
    let part;
    for (let i = 1; this.parts[i - 1].radius > 0.5; i++) {
      if (this.parts[i]) {
        this.parts[i].updateRadius(this.parts[i - 1].radius - modifier, this);
      } else {
        part = new Part({
          debug: this.debug,
          radius: this.parts[i - 1].radius - modifier,
          prevPart: this.parts[i - 1],
          segmentLength: this.segmentLength,
          fish: this,
        });
        this.parts[i - 1].setNextPart(part);
        this.parts.push(part);
      }
    }
    this.tail.updateRadius(this.head.radius);
    this.fins.updateRadius(this.head.radius);
  }
  render(ctx) {
    //find target and calculate direction
    if (!this.target) {
      this.target = this.pond.getClosestFood(this.mouth.x, this.mouth.y);
      if (!this.target) this.target = this.pond.getSpot();
    } else {
      if (this.target.value === 0) {
        let tempTarget = this.pond.getClosestFood();
        if (tempTarget) this.target = tempTarget;
      } else if (this.target.value < 0) {
        this.target = this.pond.getClosestFood();
        if (this.target === null)
          this.target = this.pond.getSpot(this.mouth.x, this.mouth.y);
      }
    }
    this.updateTargetDir();
    // console.log(this.targetDir, this.head.x, this.head.y, this.target);

    //begin calculating movement from all parts
    this.newvelx = 0;
    this.newvely = 0;
    this.parts[0].act(this);
    this.velx *= 0.97;
    this.vely *= 0.97;

    //move fish based on net movement and tail movement
    this.move(this.newvelx + this.velx, this.newvely + this.vely);

    //checks mouth for food
    this.pond.bite(this.mouth.x, this.mouth.y, this.mouth.radius, this);

    //begin drawing
    this.drawFish(ctx);

    if (this.ripple) {
      this.pond.ripple(this.mouth.x, this.mouth.y, this.head.radius * 10);
      // this.rippleCounter = 5;
    }
    this.ripple = false;
  }
  drawFish(ctx) {
    this.fins.render(ctx);

    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = "black";
    //draw body
    ctx.beginPath();
    ctx.moveTo(...this.head.getPoint(this.head.radius * 8, Math.PI / 2));
    let i;
    for (i = 0; i < this.parts.length - 1; i++)
      ctx.lineTo(
        ...this.parts[i].getPoint(this.parts[i].radius * 8, Math.PI / 2)
      );
    ctx.lineTo(...this.parts[this.parts.length - 1].getPoint(0, 0));
    for (i = this.parts.length - 2; i > -1; i--)
      ctx.lineTo(
        ...this.parts[i].getPoint(this.parts[i].radius * 8, -Math.PI / 2)
      );
    ctx.lineTo(...this.head.getPoint(this.head.radius * 8, -Math.PI / 2));
    // ctx.fill();
    if (this.debug) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.closePath();

    //draw head
    ctx.beginPath();
    ctx.moveTo(...this.head.getPoint(this.head.radius * 8, Math.PI / 2 + 0.1));
    ctx.lineTo(...this.head.getPoint(this.head.radius * 9, Math.PI / 3));
    ctx.lineTo(...this.head.getPoint(this.head.radius * 10.5, Math.PI / 5));
    ctx.lineTo(...this.head.getPoint(this.head.radius * 11, Math.PI / 6));
    ctx.quadraticCurveTo(
      ...this.head.getPoint(this.head.radius * 20, 0),
      ...this.head.getPoint(this.head.radius * 11, -Math.PI / 6)
    );
    ctx.lineTo(...this.head.getPoint(this.head.radius * 10.5, -Math.PI / 5));
    ctx.lineTo(...this.head.getPoint(this.head.radius * 9, -Math.PI / 3));
    ctx.lineTo(...this.head.getPoint(this.head.radius * 8, -Math.PI / 2 - 0.1));
    if (this.debug) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.closePath();

    // draw eyes:
    ctx.beginPath();
    ctx.fillStyle = this.eyeColor;
    const radDelta = 0.3;
    let rad = this.head.radian - radDelta;
    let point = this.head.getPoint(this.head.radius * 9, Math.PI / 3, rad);
    ctx.arc(point[0], point[1], this.head.radius * 2, 0, 2 * Math.PI);
    if (this.debug) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.closePath();

    ctx.beginPath();
    rad = this.head.radian + radDelta;
    point = this.head.getPoint(this.head.radius * 9, -Math.PI / 3, rad);
    ctx.arc(point[0], point[1], this.head.radius * 2, 0, 2 * Math.PI);
    if (this.debug) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.closePath();

    //draw tail
    this.tail.render(ctx);

    //draw dorsal
    ctx.fillStyle = this.strokeColor.replace("0.3)", "1)");
    if (this.debug) {
      ctx.fillStyle = "black";
    }
    ctx.beginPath();
    ctx.moveTo(...this.parts[Math.floor(this.parts.length / 5)].getPoint(0, 0));
    // right side
    for (
      i = Math.floor(this.parts.length / 5) + 1;
      i < Math.floor((this.parts.length * 3) / 4) + 1;
      i++
    )
      ctx.lineTo(
        ...this.parts[i].getPoint(this.parts[i].radius * 2, Math.PI / 2)
      );
    // center
    ctx.lineTo(
      ...this.parts[Math.floor((this.parts.length * 3) / 4)].getPoint(0, 0)
    );
    // left side
    for (
      i = Math.floor((this.parts.length * 3) / 4) + 1;
      i > Math.floor(this.parts.length / 5);
      i--
    )
      ctx.lineTo(
        ...this.parts[i].getPoint(this.parts[i].radius * 2, -Math.PI / 2)
      );
    if (this.debug) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.closePath();
  }
  move(x, y) {
    this.head.move(x, y);
  }
}
