/**
 * 实体类
 * 所有演员类的父类
 */

import Game from '../object/game';

abstract class Entity implements IEntity {
  /** 是否参与碰撞检测 */
  public readonly isCollision = true;
  public readonly type: IEntityType = 'entity';
  protected canvas: IWindowCanvas;
  protected ctx: IWindowCtx;
  protected world: IGameWorld;

  constructor(public rect: IEntityRect, public readonly camp: ICamp = 'neutral') {
    this.world = Game.getInstance().getGameWin();
    this.canvas = this.world.canvas;
    this.ctx = this.world.ctx;
    this.world.addEntity(this);
  }

  public abstract update(list: readonly IEntity[]): void;
  public abstract draw(): void;

  public die(...args: any[]): void {
    this.world.delEntity(this);
  }
}

export default Entity;
