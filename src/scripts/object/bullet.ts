/**
 * 子弹类
 */

import EntityMoveAble from './entityMoveAble';

class Bullet extends EntityMoveAble implements BulletElement {
  protected tank: TankElement;

  constructor(options: BulletOption) {
    super(options);
    this.tank = options.tank;
  }

  changeImg() {
    //
  }

  update() {
    //
  }

  move() {
    //
  }
}
