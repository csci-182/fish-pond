// const FishPond = require('./fish_pond.js');
import { FishPond } from "./fish-pond.js";
const debugMode = false;

const canvas = document.getElementsByTagName("canvas")[0];
let pond = new FishPond(window, {
  debug: debugMode,
  selector: "main",
  fishCount: 15,
});

function clickCanvas(e) {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  pond.click(x, y);
}

let isDragging = false;
// canvas.addEventListener('click', clickCanvas);
canvas.addEventListener("mousedown", (ev) => {
  isDragging = true;
  clickCanvas(ev);
});
canvas.addEventListener("mouseup", (ev) => {
  isDragging = false;
});
canvas.addEventListener("mousemove", (ev) => {
  if (isDragging) {
    clickCanvas(ev);
  }
});

pond.start(canvas);
