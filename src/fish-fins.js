import { Fin } from "./fish-fin.js";

export class Fins {
  constructor(fish, radius, opts) {
    this.debug = opts ? opts.debug : false;
    this.fish = fish;
    this.fins = [
      new Fin(fish, 1, 0, radius, { debug: this.debug }),
      new Fin(fish, -1, 0, radius, { debug: this.debug }),
      new Fin(fish, 1, 0.3, radius, { debug: this.debug }),
      new Fin(fish, -1, 0.3, radius, { debug: this.debug }),
    ];
    this.radius = radius;
    this.tip = fish.parts[this.fish.parts.length - 1];
    this.maxAngle = this.tip.maxAngle;
  }
  updateRadius(radius) {
    for (let i = 0; i < this.fins.length; i++)
      this.fins[i].updateRadius(radius);
  }
  change() {
    const rand = Math.random() * 2;
    if (rand > 1) {
      this.fins[0].change(rand / 2);
      this.fins[1].change(rand / 2);
    } else {
      this.fins[2].change(rand / 2);
      this.fins[3].change(rand / 2);
    }
  }
  act() {
    for (let i = 0; i < this.fins.length; i++) this.fins[i].act();
  }
  render(ctx) {
    this.act();

    for (let i = 0; i < this.fins.length; i++) this.fins[i].render(ctx);
  }
}
