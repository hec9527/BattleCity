/**
 * 实体子类   ---  可以移动的实体类
 */

import Config from '../config/const';
import { isEntityCollision } from '../util';
import Entity from './entity';

abstract class EntityMoveAble extends Entity {
  protected speed: number;
  protected direction: IDirection;
  public readonly type: IEntityType = 'entityMoveAble';

  constructor(option: IEntityMoveAbleOption) {
    const { rect, camp, direction, speed } = option;
    super(rect, camp);
    this.direction = direction || 0;
    this.speed = speed || 0;
    this.type = 'entity';
  }

  protected abstract move(list: IEntity[]): void;

  /** 获取实体移动之后的rect */
  protected getNextRect(): IEntityRect {
    // eslint-disable-next-line prefer-const
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

  /** 检测下一帧是否碰撞边界 */
  protected isCollisionBorderNextFrame(): boolean {
    const [x, y, w, h] = this.getNextRect();
    return x < 0 || x > Config.battleField.width - w || y < 0 || y > Config.battleField.height - h;
  }

  /** 检测下一帧是否会碰撞到其它实体 */
  protected isCollisionEntityNextFrame(entity: IEntity): boolean {
    return isEntityCollision(this.getNextRect(), entity.rect);
    // const [x1, y1, w1, h1] = this.getNextRect();
    // const [x2, y2, w2, h2] = rect;
    // const dx = x2 - x1;
    // const dy = y2 - y1;
    // return -w2 < dx && dx < w1 && -h2 < dy && dy < h1;
  }
}

export default EntityMoveAble;
