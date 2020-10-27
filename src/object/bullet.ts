/**
 * 子弹类
 */

import { getCanvas } from 'src/util';
import EntityMoveAble from './moveable-entity';
import Tank from './tank';

class Bullet extends EntityMoveAble {
  protected tank: Tank;
  public level: number;
  protected img: CanvasImageSource;

  constructor(options: BulletOption) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let img: any;
    super({ ...options, img });
    this.tank = options.tank;
    this.level = options.level;
    this.img = this.changeImg();
  }

  changeImg(): CanvasImageSource {
    const { canvas } = getCanvas(416, 416);
    return canvas;
  }

  update(): void {
    //
  }

  move(): void {
    //
  }
}

export default Bullet;
