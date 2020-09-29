/**
 * 实体类
 * 所有演员类的父类
 */

import { getCanvas } from '../util/index';

abstract class Entity implements EntityElement {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(protected word: GameWorld, public rect: EntityRect, protected img: CanvasImageSource, public camp: number = 0) {
    const { canvas, ctx } = getCanvas(516, 456, 'canvas');
    this.canvas = canvas;
    this.ctx = ctx;
  }

  abstract changeImg(): void;

  abstract update(list: EntityElement[]): void;

  die() {
    this.word.delEntity(this);
  }

  draw() {
    this.ctx.drawImage(this.img, this.rect[0] + 35, this.rect[1] + 20);
  }
}

export default Entity;
