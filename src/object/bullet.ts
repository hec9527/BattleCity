/**
 * 子弹类
 */

import EntityMoveAble from './entity-moveable';
import Tank from './tank';
// import Tank from './tank';

interface IBulletOption {
  world: GameWorld;
  rect: EntityRect;
  tank: Tank;
  camp: Camp;
  level?: number;
  direction?: Direction;
  speed?: number;
}

class Bullet extends EntityMoveAble {
  private tank: any;
  // protected img!: CanvasImageSource;
  public readonly level: number;

  constructor(options: IBulletOption) {
    super({ ...options });

    this.tank = options.tank;
    this.level = options.level || 1;
    this.speed = options.speed || 1;
  }

  public die() {
    this.tank;
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
