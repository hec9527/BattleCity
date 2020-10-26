/**
 * 子弹类
 */

import EntityMoveAble from './entityMoveAble';
import Tank from './tank';

class Bullet extends EntityMoveAble {
  protected tank: Tank;

  constructor(options: any) {
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
