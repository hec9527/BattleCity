import Brick from './brick';
import Entity from './entity';
import Config from '../config/const';
import { Resource } from '../loader';
import { getCanvas } from '../util';

const R = Resource.getResource();
const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

/**
 * # 砖块碎片
 * ```
 * 砖块受到子弹攻击之后会变成碎片
 * 碎片具有单独的rect和碰撞检测
 *
 * 土块碎片存在残缺的情况, 用status来标识每个16*16的砖块的状态，
 * 一级子弹每次打掉8px
 * 为0则标识被打掉，全部status为0，则该碎片消失
 *
 * **** 只有一级子弹才能将砖块打残，2级子弹直接打掉 ******
 * **** 只有土碎片才能被打残缺，铁碎片直接消掉一小块 *****
 *
 * | 1 | 1 |
 * ---------
 * | 1 | 1 |
 *```
 */

export default class BrickFragment extends Brick {
  private status: TupleArray<number, 4>;
  private sprite: HTMLCanvasElement;
  private sCtx: CanvasRenderingContext2D;

  constructor(props: IBrickOption) {
    super(props);
    this.status = [1, 1, 1, 1];
    this.rect[2] = this.rect[3] = 16;

    const [canvas, ctx] = getCanvas(16, 16);
    ctx.drawImage(R.Image.brick, this.brickIndex * 32, 0, 16, 16, 0, 0, 16, 16);
    this.sprite = canvas;
    this.sCtx = ctx;
  }

  private clipSprite() {
    this.status.forEach((s, i) => {
      if (s === 0) {
        const x = [1, 3].includes(i) ? 8 : 0;
        const y = [2, 3].includes(i) ? 8 : 0;
        this.sCtx.clearRect(x, y, 8, 8);
      }
    });
  }

  // 子弹击中砖块碎片的时候，延迟die，可同时消除相邻的砖块
  die(bullet: IBullet): void {
    if ((['grass', 'river', 'ice', 'blank'] as IBrickType[]).includes(this.brickType)) {
      return;
    } else if (this.brickType === 'brick') {
      /** 土块，任何等级的子弹都能打碎 */
      if (bullet.level >= 2) {
        return Entity.prototype.die.call(this);
      }
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
        return Entity.prototype.die.call(this);
      } else {
        this.clipSprite();
      }
    } else if (this.brickType === 'iron') {
      if (bullet.level >= 4) {
        /** 铁块，需要4级以上的子弹才能打碎 */
        Entity.prototype.die.call(this);
      }
    }
  }

  update(): void {}

  draw(): void {
    const [x, y, w, h] = this.rect;
    this.cCtx.drawImage(this.sprite, x + PL, y + PT, w, h);

    // TODO 删除
    this.cCtx.drawImage(this.sprite, 0, 0);
  }
}
