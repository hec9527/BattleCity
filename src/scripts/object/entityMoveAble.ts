/**
 * 实体子类   ---  可以移动的部分
 */

import Entity from './entity';

class EntityMoveAble extends Entity implements EntityMoveAbleElement {
  protected speed: number;

  constructor(option: EntityMoveAbleOption) {
    const { world, rect, img, camp } = option;
    super(world, rect, img, camp);
    this.speed = option.speed || 0;
  }

  move() {
    throw new Error('MoveAble entity should have thier own move method');
  }

  /**
   * 检测下一帧是否碰撞边界
   * @param nextTickRect
   * @return boolean
   */
  isCollisionBorder(nextTickRect: EntityRect) {
    const [x, y, w, h] = nextTickRect;
    return x < 0 || x > 416 - w || y < 0 || y > 416 - h;
  }

  /**
   * 检测下一帧是否碰撞其它坦克
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
