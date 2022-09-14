import brick from '../config/brick';
import BrickFragment from './brick-fragment';
import Config from '../config/const';
import { Resource } from '../loader';
import { Ticker } from '../util/ticker';

const R = Resource.getResource();
const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

type PK<T extends any, U extends T> = T extends U ? T : never;

/**
 * 围墙...
 */
class BrickWall extends BrickFragment {
  private isDead = false;
  private buildTicker?: ITicker;
  private blinkTicker?: ITicker;
  private _brickIndex: number;
  private _ironIndex: number;

  constructor({ index, pos }: IBrickOption) {
    super({ pos, index });

    this._brickIndex = index;
    if ([brick.brickLeft, brick.brickRight].includes(index)) {
      this._ironIndex = index + 5;
    } else {
      this._ironIndex = index + 2;
    }
  }

  update(): void {}

  private _rebuild(type: PK<IBrickType, 'iron' | 'brick'> = 'iron') {
    this.status = [1, 1, 1, 1];
    this.isDead = false;
    this.isCollision = true;
    this.brickType = type;
    this.brickIndex = type === 'iron' ? this._ironIndex : this._brickIndex;
  }

  private _die() {
    this.isDead = true;
    this.isCollision = false;
  }

  public rebuild(type: PK<IBrickType, 'iron' | 'brick' | 'blank'> = 'iron'): void {
    if (type === 'blank') {
      return this._die();
    }
    this._rebuild(type);
    this.buildTicker = new Ticker(Config.ticker.wallBuildKeep, () => {
      this.world.delTicker(this.buildTicker);
      this.blinkTicker = new Ticker(
        Config.ticker.wallBlinkDuration,
        () => this._rebuild(this.brickType === 'iron' ? 'brick' : 'iron'),
        true,
      );
      this.buildTicker = new Ticker(Config.ticker.wallBlink, () => {
        this.world.delTicker(this.blinkTicker);
        this.world.delTicker(this.buildTicker);
        this._rebuild('brick');
      });
      this.world.addTicker(this.blinkTicker);
      this.world.addTicker(this.buildTicker);
    });
    this.world.addTicker(this.buildTicker);
  }

  die(bullet: IBullet): void {
    if (this.brickType === 'ice') {
      if (bullet.level <= 4) {
        return;
      } else {
        this._die();
      }
    } else if (this.brickType === 'brick') {
      const [p1, p2, n1, n2] = {
        0: [2, 3, 0, 1],
        1: [0, 2, 1, 3],
        2: [0, 1, 2, 3],
        3: [1, 3, 2, 0],
      }[bullet.getDir()];
      if (this.status[p1] === 0 && this.status[p2] === 0) {
        this.status[n1] = this.status[n2] = 0;
      } else {
        this.status[p1] = this.status[p2] = 0;
      }
      if (this.status.reduce((p, c) => p + c) === 0) {
        this._die();
      } else {
        this.clipSprite();
      }
    } else {
      throw new Error(`非法的砖块类型: ${this.brickType}`);
    }
  }

  draw(): void {
    if (this.isDead) return;
    const [x, y, w, h] = this.rect;
    this.cCtx.drawImage(R.Image.brick, 32 * this.brickIndex, 0, 32, 32, x + PL, y + PT, w, h);
  }
}

export default BrickWall;
