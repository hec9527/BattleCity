/**
 * 实体类
 * 所有演员类的父类
 */

import { getCanvas } from '../util/index';
import {
  GAME_BATTLEFIELD_PADDING_LEFT as offsetX,
  GAME_BATTLEFIELD_PADDING_TOP as offsetY,
} from '../config/const';

abstract class Entity {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  /** 是否参与碰撞检测 */
  public readonly isCollision: boolean = true;

  constructor(
    protected world: GameWorld,
    public rect: EntityRect,
    protected img: CanvasImageSource,
    public readonly camp: Camp = 'neutral'
  ) {
    const { canvas, ctx } = getCanvas(516, 456, 'canvas');
    this.canvas = canvas;
    this.ctx = ctx;
    this.world.addEntity(this);
  }

  protected abstract changeImg(): void;

  public abstract update(list: Entity[]): void;

  public die(): void {
    this.world.delEntity(this);
  }

  protected draw(): void {
    this.ctx.drawImage(this.img, this.rect[0] + offsetX, this.rect[1] + offsetY);
  }
}

export default Entity;
