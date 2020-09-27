/**
 * 实体类
 * 所有演员类的父类
 */

import { getCanvas } from '../util/index';

class Entity implements EntityElement {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(protected word: GameWorld, public rect: EntityRect, protected img: CanvasImageSource, public camp: number = 0) {
    const { canvas, ctx } = getCanvas(516, 456, 'canvas');
    this.canvas = canvas;
    this.ctx = ctx;
  }

  die() {
    this.word.delEntity(this);
  }

  update() {
    throw new Error('Every instance inherited from entity show have their own update method');
  }

  draw() {
    this.ctx.drawImage(this.img, this.rect[0] + 35, this.rect[1] + 20);
  }
}

export default Entity;
