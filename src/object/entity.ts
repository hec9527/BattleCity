/**
 * 实体类
 * 所有演员类的父类
 */

abstract class Entity {
  /** 是否参与碰撞检测 */
  public readonly isCollision: boolean = true;

  constructor(
    protected world: GameWorld,
    public rect: EntityRect,
    public readonly camp: Camp = 'neutral'
  ) {
    this.world.addEntity(this);
  }

  public abstract update(list: Entity[]): void;
  public abstract draw(): void;

  public die(): void {
    this.world.delEntity(this);
  }
}

export default Entity;
