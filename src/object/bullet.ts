/**
 * 子弹类
 */

import EntityMoveAble from './entity-moveable';
import Tank from './tank';
// import Tank from './tank';

interface IBulletOption {
  world: IGameWorld;
  rect: IEntityRect;
  tank: Tank;
  camp: ICamp;
  level?: number;
  direction?: IDirection;
  speed?: number;
}

class Bullet extends EntityMoveAble {
  private tank: unknown;
  // protected img!: CanvasImageSource;
  public readonly level: number;

  constructor(options: IBulletOption) {
    super({ ...options });

    this.tank = options.tank;
    this.level = options.level || 1;
    this.speed = options.speed || 1;
  }

  public die(): void {
    this.tank;
    super.die();
  }

  public update(): void {
    //
  }

  public move(): void {
    //
  }

  draw(): void {
    //
  }
}

export default Bullet;
