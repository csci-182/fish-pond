export class Ripple {
  constructor(x, y, size, pond, index, opts) {
    this.debug = opts ? opts.debug : false;
    this.x = x;
    this.y = y;
    this.size = size;
    this.pond = pond;
    this.index = index;
    this.opacity = 1;
    this.ops = this.opacity / size / 4;
    this.lineWidth = 1;
    this.radius = 1;
  }
  render(ctx) {
    ctx.strokeStyle = `rgba(235,235,235,${this.opacity})`;
    if (this.debug) {
      ctx.strokeStyle = `rgba(0,0,0,${this.opacity})`;
    }
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.arc(this.x, this.y, 3 * Math.sqrt(this.radius), 0, 2 * Math.PI, true);
    ctx.stroke();
    ctx.closePath();

    if (this.opacity < 0) this.pond.ripples.splice(this.indx, 1);
    this.opacity -= this.ops;
    if (!this.debug) {
      this.lineWidth += 0.1;
    }
    this.radius++;
  }
}
