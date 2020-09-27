/**
 * 坦克类
 */

import EntityMoveAble from './entityMoveAble';

class Tank extends EntityMoveAble implements TankElement {
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

  changeImg() {
    throw new Error('Tank instance should have thier own changeImg method');
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

  // TODO 完成奖励获取
  getReward() {}

  upGrade() {}

  addLife() {}

  addProtector() {}
}

export default Tank;
