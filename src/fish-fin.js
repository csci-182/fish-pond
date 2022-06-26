import { FinPiece } from "./fish-fin-piece.js";

export class Fin {
  constructor(fish, side, ratio, radius, opts) {
    //1 is left, -1 is right
    this.debug = opts ? opts.debug : false;
    this.fish = fish;
    this.side = side;
    this.ratio = ratio;
    this.radius = radius;
    this.part = fish.parts[Math.floor(fish.parts.length * ratio)];
    this.pieceLength = this.radius * 3 + 1;
    this.fillColor = this.fish.fillColor.replace("1)", "0.4)");
    this.strokeColor = this.fish.strokeColor;
    this.pieces = [
      [new FinPiece(this, undefined, this.side, 0, { debug: this.debug })],
      [new FinPiece(this, undefined, this.side, 1, { debug: this.debug })],
      [new FinPiece(this, undefined, this.side, 2, { debug: this.debug })],
      [new FinPiece(this, undefined, this.side, 3, { debug: this.debug })],
      [new FinPiece(this, undefined, this.side, 4, { debug: this.debug })],
      [new FinPiece(this, undefined, this.side, 5, { debug: this.debug })],
      [new FinPiece(this, undefined, this.side, 6, { debug: this.debug })],
    ];

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 5 - i / 2; j++) {
        this.pieces[i].push(
          new FinPiece(this, this.pieces[i][j], this.side, i, {
            debug: this.debug,
          })
        );
      }
    }
  }
  updateRadius(radius) {
    this.radius = radius;
    this.pieceLength = this.radius * 3 + 1;
    this.part =
      this.fish.parts[Math.floor(this.fish.parts.length * this.ratio)];
  }
  change(rand) {
    const idx = Math.floor(rand * this.pieces.length);
    const lastPiece = this.pieces[idx][this.pieces[idx].length - 1];
    this.pieces[idx].push(
      new FinPiece(this, lastPiece, this.side, idx, { debug: this.debug })
    );
  }
  act() {
    for (let i = 0; i < this.pieces.length; i++) {
      for (let j = 0; j < this.pieces[i].length; j++) {
        this.pieces[i][j].act();
      }
    }
  }
  render(ctx) {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = "black";

    for (let j = 0; j < this.pieces.length - 1; j++) {
      ctx.beginPath();
      ctx.moveTo(this.pieces[j][0].x, this.pieces[j][0].y);
      for (let i = 1; i < this.pieces[j].length; i++) {
        ctx.lineTo(this.pieces[j][i].x, this.pieces[j][i].y);
      }
      for (let i = this.pieces[j + 1].length - 1; i > -1; i--) {
        ctx.lineTo(this.pieces[j + 1][i].x, this.pieces[j + 1][i].y);
      }
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
      ctx.moveTo(this.pieces[j][0].x, this.pieces[j][0].y);
      for (let i = 1; i < this.pieces[j].length; i++) {
        ctx.lineTo(this.pieces[j][i].x, this.pieces[j][i].y);
      }
      ctx.stroke();
      ctx.closePath();
    }
  }
}
