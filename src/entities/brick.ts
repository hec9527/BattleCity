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
import brick from '../config/brick';
import { isEntityCollision } from '../util';

const R = Resource.getResource();
const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

const fragmentPosition = [
  { x: 0, y: 0 },
  { x: 16, y: 0 },
  { x: 0, y: 16 },
  { x: 16, y: 16 },
];

class Brick extends Entity {
  public type: IEntityType = 'brick';
  public isCollision: boolean;

  protected brickIndex: number;
  protected brickType: IBrickType;
  protected cCtx: CanvasRenderingContext2D;

  constructor({ index, pos }: IBrickOption) {
    super([...pos, 32, 32] as IEntityRect);

    this.brickIndex = index;
    this.brickType = getBrickType(index);
    this.isCollision = !['grass', 'ice', 'blank'].includes(this.brickType);

    if (this.brickType === 'grass') {
      this.cCtx = this.ctx.fg;
    } else {
      this.cCtx = this.ctx.bg;
    }
  }

  private broken(bullet: IBullet) {
    this.world.beforeNextFrame(() => bullet?.die());
    super.die();

    // TODO 修复砖块破碎
    fragmentPosition.forEach((fragment, index) => {
      // prettier-ignore
      if (
        ((index === 0 || index === 1) && [brick.brickBottom, brick.ironBottom, brick.ironLeftBottom, brick.ironRightBottom, brick.brickLeftBottom, brick.brickRightBottom].includes(this.brickIndex)) ||
        (index === 1 && [brick.ironLeft, brick.ironLeftBottom, brick.brickLeft, brick.brickLeftBottom].includes(this.brickIndex)) ||
        (index === 1 && [brick.ironTop, brick.ironTop].includes(this.brickIndex)) ||
        (index === 2 &&[brick.ironRight, brick.ironRightBottom, brick.brickRight, brick.brickRightBottom].includes(this.brickIndex))
      ) {
        return;
      }
      const [x, y] = this.rect;
      const dictionary: { [K in IBrickType]?: number } = {
        iron: brick.iron,
        brick: brick.brick,
        grass: brick.grass,
      };
      import('./brick-fragment').then(({ default: BrickFragment }) => {
        const _brick = new BrickFragment({
          pos: [fragment.x + x, fragment.y + y],
          index: dictionary[this.brickType] || 0,
        });
        if (isEntityCollision(bullet.rect, _brick.rect)) {
          _brick.die(bullet);
        }
      });
    });
  }

  update(): void {}

  die(bullet: IBullet): void {
    if (this.brickType === 'brick') {
      this.broken(bullet);
    } else if (this.brickType === 'boss') {
      this.brickIndex = brick.bossBroken;
      import('../object/game').then(({ default: game }) => {
        game.getInstance().setGameOver();
      });
    } else if (this.brickType === 'iron') {
      this.broken(bullet);
    }
  }

  draw(): void {
    const [x, y, w, h] = this.rect;
    this.cCtx.drawImage(R.Image.brick, 32 * this.brickIndex, 0, 32, 32, x + PL, y + PT, w, h);
  }
}

export default Brick;
