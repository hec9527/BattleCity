/**
 * 实体类
 * 所有演员类的父类
 */

import { GAME_CANVAS_HEIGHT, GAME_CANVAS_WIDTH } from '@/config/const';
import { getCanvas } from '@/util';

abstract class Entity {
  /** 是否参与碰撞检测 */
  public isCollision: boolean = true;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(
    protected world: GameWorld,
    public rect: EntityRect,
    public readonly camp: Camp = 'neutral'
  ) {
    const { canvas, ctx } = getCanvas(GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT, 'game');
    this.canvas = canvas;
    this.ctx = ctx;
    this.world.addEntity(this);
  }

  public abstract update(list: readonly Entity[]): void;
  public abstract draw(): void;

  public die(...args: any[]): void {
    this.world.delEntity(this);
  }
}

export default Entity;
