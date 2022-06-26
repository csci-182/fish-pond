import { TailPiece } from "./fish-tail-piece.js";

export class Tail {
  constructor(fish, radius, opts) {
    this.debug = opts ? opts.debug : false;
    this.changeCount = 0;
    this.fish = fish;
    this.pieces = [[], [], [], [], []];
    this.radius = radius;
    this.fillColor = this.fish.fillColor;
    this.strokeColor = this.fish.strokeColor;
    this.pieceLength = this.radius * 2;
    this.tip = fish.parts[this.fish.parts.length - 1];
    this.maxAngle = this.tip.maxAngle;

    for (let i = 0; i < 3; i++)
      this.pieces[2].push(
        new TailPiece(this, this.pieces[2][i - 1], 0, { debug: this.debug })
      );
    for (let i = 0; i < 5; i++)
      this.pieces[1].push(
        new TailPiece(this, this.pieces[1][i - 1], 1, { debug: this.debug })
      );
    for (let i = 0; i < 8; i++)
      this.pieces[0].push(
        new TailPiece(this, this.pieces[0][i - 1], 2, { debug: this.debug })
      );
    for (let i = 0; i < 5; i++)
      this.pieces[3].push(
        new TailPiece(this, this.pieces[3][i - 1], -1, { debug: this.debug })
      );
    for (let i = 0; i < 8; i++)
      this.pieces[4].push(
        new TailPiece(this, this.pieces[4][i - 1], -2, { debug: this.debug })
      );
  }
  change() {
    const rand = Math.random() * 3;
    if (rand < 1)
      this.pieces[2].push(
        new TailPiece(this, this.pieces[2][this.pieces[2].length - 1], 0, {
          debug: this.debug,
        })
      );
    else if (rand < 2) {
      this.pieces[1].push(
        new TailPiece(this, this.pieces[1][this.pieces[1].length - 1], 1, {
          debug: this.debug,
        })
      );
      this.pieces[3].push(
        new TailPiece(this, this.pieces[3][this.pieces[3].length - 1], -1, {
          debug: this.debug,
        })
      );
    } else {
      this.pieces[0].push(
        new TailPiece(this, this.pieces[0][this.pieces[0].length - 1], 2, {
          debug: this.debug,
        })
      );
      this.pieces[4].push(
        new TailPiece(this, this.pieces[4][this.pieces[4].length - 1], -2, {
          debug: this.debug,
        })
      );
    }
  }
  updateRadius(radius) {
    //do stuff to tailpieces
    this.radius = radius;
    this.pieceLength = this.radius * 2;
    this.tip = this.fish.parts[this.fish.parts.length - 1];
    this.maxAngle = this.tip.maxAngle;
    for (let i = 0; i < 5; i++) this.pieces[i][0].prevPart = this.tip;
  }
  act() {
    this.tip = this.fish.parts[this.fish.parts.length - 1];
    for (let i = 0; i < this.pieces[2].length; i++) this.pieces[2][i].act(this);
    for (let i = 0; i < this.pieces[1].length; i++) this.pieces[1][i].act(this);
    for (let i = 0; i < this.pieces[0].length; i++) this.pieces[0][i].act(this);
    for (let i = 0; i < this.pieces[3].length; i++) this.pieces[3][i].act(this);
    for (let i = 0; i < this.pieces[4].length; i++) this.pieces[4][i].act(this);
  }
  render(ctx) {
    this.act();
    ctx.fillStyle = this.fillColor;

    for (let j = 0; j < this.pieces.length - 1; j++) {
      ctx.beginPath();
      ctx.moveTo(...this.tip.getPoint(0, 0));
      for (let i = 0; i < this.pieces[j].length; i++)
        ctx.lineTo(this.pieces[j][i].x, this.pieces[j][i].y);
      for (let i = this.pieces[j + 1].length - 1; i > -1; i--)
        ctx.lineTo(this.pieces[j + 1][i].x, this.pieces[j + 1][i].y);
      if (this.debug) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
      ctx.closePath();
    }
    if (this.debug) {
      ctx.strokeStyle = "black";
    } else {
      ctx.strokeStyle = this.strokeColor;
    }
    ctx.lineWidth = 1;
    for (let j = 0; j < this.pieces.length; j++) {
      ctx.beginPath();
      ctx.moveTo(...this.tip.getPoint(0, 0));
      for (let i = 0; i < this.pieces[j].length; i++)
        ctx.lineTo(this.pieces[j][i].x, this.pieces[j][i].y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
