/**
 * 砖块类
 * 泥土 1  2  3  4  5  17 18
 * 铁块 6  7  8  9  10 19 20
 * 草  11
 * 冰  12
 * 河  13  14
 * boss 15 16
 */

import Entity from './entity';
import { getBrickRect, getBrickType } from '../util/map-tool';

class Brick extends Entity {
  public type: IEntityType;
  private brickType: IBrickType;
  private cCtx: CanvasRenderingContext2D;

  constructor({ world, index, pos }: IBrickOption) {
    super(world, getBrickRect(pos, index));
    this.type = 'brick';
    this.brickType = getBrickType(index);
    if (this.brickType === 'grass') {
      this.cCtx = this.ctx.fg;
    } else {
      this.cCtx = this.ctx.bg;
    }
  }

  update(): void {}

  die(bullet: IBullet): void {
    bullet.level;
  }

  draw(): void {
    //
  }
}

export default Brick;
