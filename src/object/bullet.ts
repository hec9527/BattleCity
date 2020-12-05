/**
 * 子弹类
 */

import { getCanvas } from 'src/util';
import EntityMoveAble from './entity-moveable';
import Tank from './tank';

class Bullet extends EntityMoveAble {
  private tank: Tank;
  protected img: CanvasImageSource;
  public readonly level: number;

  constructor(options: BulletOption) {
    // TODO fix
    const img: CanvasImageSource = document.createElement('canvas');
    super({ ...options, img });
    this.tank = options.tank;
    this.level = options.level;
    this.img = this.changeImg();
  }

  protected changeImg(): CanvasImageSource {
    const { canvas } = getCanvas(416, 416);
    return canvas;
  }

  public update(): void {
    //
  }

  public move(): void {
    //
  }
}

export default Bullet;
