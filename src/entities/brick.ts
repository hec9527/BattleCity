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
import Config from '../config/const';
import AllyController from '../util/ally-controller';
import { Resource } from '../loader';
import { isEntityCollision } from '../util';
import { getBrickType } from '../util/map-tool';
import brick, {
  fullBrick,
  missLeftBottomBrick,
  missLeftTopBrick,
  missRightBottomBrick,
  missRightTopBrick,
} from '../config/brick';

const R = Resource.getResource();
const K = AllyController.getInstance();
const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

const fragmentPosition = [
  { x: 0, y: 0 },
  { x: 16, y: 0 },
  { x: 0, y: 16 },
  { x: 16, y: 16 },
];

const dictionary: { [K in IBrickType]?: number } = {
  iron: brick.iron,
  brick: brick.brick,
  grass: brick.grass,
};

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

    if (!fullBrick.includes(index)) {
      this.broken();
    }

    if (this.brickType === 'grass') {
      this.cCtx = this.ctx.fg;
    } else {
      this.cCtx = this.ctx.bg;
    }
  }

  private broken(bullet?: IBullet) {
    this.world.beforeNextFrame(() => super.die());

    fragmentPosition.forEach((fragment, index) => {
      // prettier-ignore
      if (
        (index === 0 && missLeftTopBrick.includes(this.brickIndex)) ||
        (index === 1 && missRightTopBrick.includes(this.brickIndex)) ||
        (index === 2 && missLeftBottomBrick.includes(this.brickIndex)) ||
        (index === 3 && missRightBottomBrick.includes(this.brickIndex))
      ) {
        return;
      }
      const [x, y] = this.rect;
      if (bullet) {
        const rect: IEntityRect = [fragment.x + x, fragment.y + y, 16, 16];
        if (isEntityCollision(bullet?.rect, rect)) return;
      }

      import('./brick-fragment').then(({ default: BrickFragment }) => {
        new BrickFragment({
          pos: [fragment.x + x, fragment.y + y],
          index: dictionary[this.brickType] || 0,
        });
      });
    });
  }

  update(): void {}

  die(bullet: IBullet): void {
    if (this.brickType === 'brick') {
      this.broken(bullet);
    } else if (this.brickType === 'boss') {
      console.log('game over');
      this.brickIndex = brick.bossBroken;
      import('../object/game').then(({ default: game }) => {
        K.lock();
        game.getInstance().setGameOver();
      });
    } else if (this.brickType === 'iron') {
      if (bullet.level > 3) {
        this.broken(bullet);
      }
    }
  }

  draw(): void {
    const [x, y, w, h] = this.rect;
    this.cCtx.drawImage(R.Image.brick, 32 * this.brickIndex, 0, 32, 32, x + PL, y + PT, w, h);
  }
}

export default Brick;
