/**
 * 坦克类
 */

import TankEnemy from './tankEnemy';
import EntityMoveAble from './entityMoveAble';

abstract class Tank extends EntityMoveAble implements TankElement {
  protected dir: number;
  protected life: number;
  protected level: number;
  protected status: number;
  protected isProtected: boolean;

  constructor(option: TankOption) {
    super(option);
    this.dir = 0;
    this.life = 1;
    this.level = 1;
    this.status = 0;
    this.isProtected = false;
  }

  move(entityList: EntityElement[]) {
    const rect = this.getNextRect();

    /** 未碰撞到边界 */
    if (!this.isCollisionBorder(rect)) {
      entityList.forEach((entity) => {
        if (entity === this) return;

        // if()

        this.rect = [...rect];
      });
    } else if (this instanceof TankEnemy) {
      this.changeDir();
    }
  }

  shoot() {
    //
  }

  update() {
    //
  }

  // TODO 完成奖励获取
  getReward() {}

  upGrade() {}

  addLife() {}

  addProtector() {}
}

export default Tank;
