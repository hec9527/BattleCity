/**
 * 实体类
 * 所有演员类的父类
 */

import { getCanvas } from '../util/index';
import {
  GAME_BATTLEFIELD_PADDING_LEFT as LEFT,
  GAME_BATTLEFIELD_PADDING_TOP as TOP,
} from '../config/const';

abstract class Entity {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  public isCollision: boolean = true;

  constructor(
    protected world: GameWorld,
    public rect: EntityRect,
    protected img: CanvasImageSource,
    public camp: Camp = 'neutral'
  ) {
    const { canvas, ctx } = getCanvas(516, 456, 'canvas');
    this.canvas = canvas;
    this.ctx = ctx;
    this.world.addEntity(this);
  }

  protected abstract changeImg(): void;

  abstract update(list: Entity[]): void;

  public die() {
    this.world.delEntity(this);
  }

  protected draw() {
    this.ctx.drawImage(this.img, this.rect[0] + LEFT, this.rect[1] + TOP);
  }
}

export default Entity;
