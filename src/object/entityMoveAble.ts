/**
 * 实体子类   ---  可以移动的部分
 */

import Entity from './entity';

interface Dirs {
  [x: number]: Function;
}

abstract class EntityMoveAble extends Entity implements EntityMoveAbleElement {
  protected dir: number;
  protected speed: number;

  constructor(option: EntityMoveAbleOption) {
    const { world, rect, img, camp } = option;
    super(world, rect, img, camp);
    this.speed = option.speed || 0;
    this.dir = option.dir || 0;
  }

  abstract move(list: EntityElement[]): void;

  /**
   * 获取实体移动之后的rect
   */
  getNextRect() {
    let [x, y, w, h] = this.rect;

    const dirs: Dirs = {
      0: () => (y -= this.speed),
      1: () => (x += this.speed),
      2: () => (y += this.speed),
      3: () => (x -= this.speed),
    };
    dirs[this.dir]();
    return [x, y, w, h] as EntityRect;
  }

  /**
   * 实体移动方向
   * @param dir
   */
  changeDir(dir: number) {
    let [x, y, w, h] = this.rect;

    this.dir = dir;

    // 上下
    if (this.dir % 2) {
      y = Math.round(y / 16) * 16;
    } else {
      x = Math.round(x / 16) * 16;
    }

    this.rect = [x, y, w, h];

    this.changeImg();
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
