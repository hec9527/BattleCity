/**
 * 画笔工具
 */

import { $, getCanvas } from '.';
import { GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT } from '../config/const';

const GAME_CONTAINER = $('#gameBox') as HTMLElement;
const CANVAS_LAYER: BrushType[] = ['bg', 'main', 'misc'];

class Brush {
  public bg!: CanvasRenderingContext2D;
  public main!: CanvasRenderingContext2D;
  public misc!: CanvasRenderingContext2D;

  constructor() {
    CANVAS_LAYER.forEach((layer, index) => {
      const { canvas, ctx } = getCanvas(GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
      canvas.setAttribute('id', layer);
      canvas.style.zIndex = String(index);
      GAME_CONTAINER.appendChild(canvas);
      this[layer] = ctx;
    });
  }
}

export const brush = new Brush();

export default brush;
