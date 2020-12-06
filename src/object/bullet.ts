/**
 * 子弹类
 */

import EntityMoveAble from './entity-moveable';
import Tank from './tank';

class Bullet extends EntityMoveAble {
  private tank: Tank;
  // protected img!: CanvasImageSource;
  public readonly level: number;

  constructor(options: BulletOption) {
    super({ ...options });
    this.tank = options.tank;
    this.level = options.level;
  }

  public die() {
    this.tank.distoryBullet(this);
    super.die();
  }

  public update(): void {
    //
  }

  public move(): void {
    //
  }

  draw() {}
}

export default Bullet;
