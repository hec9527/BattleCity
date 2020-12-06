/**
 * 画笔工具
 */

import { $, getCanvas } from '.';
import {
  GAME_CANVAS_WIDTH,
  GAME_CANVAS_HEIGHT,
  GAME_BATTLEFIELD_PADDING_TOP as P_TOP,
  GAME_BATTLEFIELD_PADDING_LEFT as P_LEFT,
} from '../config/const';

const GAME_CONTAINER = $('#gameBox') as HTMLElement;
const CANVAS_LAYER: BrushType[] = ['bg', 'main', 'misc'];

function clear(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  function _clear(clearAll: boolean): void;
  function _clear(x: number, y: number, w: number, h: number): void;
  function _clear(x?: any, y?: any, w?: any, h?: any): void {
    if (x === true) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(x, y, w, h);
    }
  }
  return _clear;
}

function draw(ctx: CanvasRenderingContext2D) {
  return function (
    img: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };
}

class Brush {
  public bg!: ICtx;
  public main!: ICtx;
  public misc!: ICtx;

  constructor() {
    CANVAS_LAYER.forEach((layer, index) => {
      const { canvas, ctx } = getCanvas(GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
      canvas.setAttribute('id', layer);
      canvas.style.zIndex = String(index);
      GAME_CONTAINER.appendChild(canvas);
      this[layer] = { clear: clear(canvas, ctx), draw: draw(ctx) };
    });
  }
}

export const brush = new Brush();

export default brush;
