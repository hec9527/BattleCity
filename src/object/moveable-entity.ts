/**
 * 实体子类   ---  可以移动的部分
 */

import Entity from './entity';

abstract class EntityMoveAble extends Entity {
  protected dir: Direction;
  protected speed: number;

  constructor(option: MoveAbleEntityOption) {
    const { world, rect, img, camp } = option;
    super(world, rect, img, camp);
    this.dir = option.dir || 0;
    this.speed = option.speed || 0;
  }

  protected abstract move(list: Entity[]): void;

  /** 获取实体移动之后的rect */
  protected getNextRect() {
    let [x, y, w, h] = this.rect;
    const dirs = {
      0: () => (y -= this.speed),
      1: () => (x += this.speed),
      2: () => (y += this.speed),
      3: () => (x -= this.speed),
    };
    dirs[this.dir]();
    return [x, y, w, h] as EntityRect;
  }

  /**
   * 检测下一帧是否碰撞边界
   * @param {EntityRect} nextTickRect
   * @return boolean
   */
  isCollisionBorder(nextTickRect: EntityRect) {
    const [x, y, w, h] = nextTickRect;
    return x < 0 || x > 416 - w || y < 0 || y > 416 - h;
  }

  /**
   * 检测下一帧是否会碰撞到其它实体
   * @param {EntityRect} nextTickRect
   * @param {EntityRect} rect
   * @return boolean
   */
  isCollisionEntity(nextTickRect: EntityRect, rect: EntityRect) {
    const [x1, y1, w1, h1] = nextTickRect;
    const [x2, y2, w2, h2] = rect;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return -w2 < dx && dx < w1 && -h2 < dy && dy < h1;
  }
}

export default EntityMoveAble;
