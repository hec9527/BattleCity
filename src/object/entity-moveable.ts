/**
 * 实体子类   ---  可以移动的部分
 */

import Entity from './entity';
import { GAME_BATTLEFIELD_HEIGHT } from '../config/const';

abstract class EntityMoveAble extends Entity {
  protected direction: IDirection;
  protected speed: number;

  constructor(option: any) {
    const { world, rect, camp, direction, speed } = option;
    super(world, rect, camp);
    this.direction = direction || 0;
    this.speed = speed || 0;
  }

  protected abstract move(list: Entity[]): void;

  /** 获取实体移动之后的rect */
  protected getNextRect(): IEntityRect {
    let [x, y, w, h] = this.rect;
    const directions = {
      0: () => (y -= this.speed),
      1: () => (x += this.speed),
      2: () => (y += this.speed),
      3: () => (x -= this.speed),
    };
    directions[this.direction]();
    return [x, y, w, h];
  }

  /**
   * 检测下一帧是否碰撞边界
   * @return boolean
   */
  public isCollisionBorderNextFrame(): boolean {
    const [x, y, w, h] = this.getNextRect();
    return x < 0 || x > GAME_BATTLEFIELD_HEIGHT - w || y < 0 || y > GAME_BATTLEFIELD_HEIGHT - h;
  }

  /**
   * 检测下一帧是否会碰撞到其它实体
   * @param {EntityRect} rect
   * @return boolean
   */
  public isCollisionEntityNextFrame(rect: IEntityRect): boolean {
    const [x1, y1, w1, h1] = this.getNextRect();
    const [x2, y2, w2, h2] = rect;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return -w2 < dx && dx < w1 && -h2 < dy && dy < h1;
  }
}

export default EntityMoveAble;
