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
import { Resource } from '../loader';
import Config from '../config/const';

const R = Resource.getResource();
const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

class Brick extends Entity {
  public type: IEntityType = 'brick';
  public isCollision: boolean;

  private brickIndex: number;
  private brickType: IBrickType;
  private cCtx: CanvasRenderingContext2D;

  constructor({ index, pos }: IBrickOption) {
    super(getBrickRect(pos, index));

    this.brickIndex = index;
    this.brickType = getBrickType(index);
    this.isCollision = !['grass', 'ice', 'blank'].includes(this.brickType);

    if (this.brickType === 'grass') {
      this.cCtx = this.ctx.fg;
    } else {
      this.cCtx = this.ctx.bg;
    }
  }

  update(): void {
    return;
  }

  die(bullet: IBullet): void {
    if (this.brickType === 'ice' && bullet.level < 3) return;
    bullet.level;
  }

  draw(): void {
    const [x, y, w, h] = this.rect;
    this.cCtx.drawImage(R.Image.brick, 32 * this.brickIndex, 0, 32, 32, x + PL, y + PT, w, h);
  }
}

export default Brick;
