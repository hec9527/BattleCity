/**
 * 实体类
 * 所有演员类的父类
 */

abstract class Entity implements IEntity {
  /** 是否参与碰撞检测 */
  public isCollision = true;
  public type: IEntityType = 'entity';
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(protected world: IGameWorld, public rect: IEntityRect, public readonly camp: ICamp = 'neutral') {
    this.canvas = world.canvas;
    this.ctx = world.ctx;
    this.world.addEntity(this);
  }

  public abstract update(list: readonly IEntity[]): void;
  public abstract draw(): void;

  public die(...args: any[]): void {
    this.world.delEntity(this);
  }
}

export default Entity;
