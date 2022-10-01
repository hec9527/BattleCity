import Config from '../config';
import brick from '../config/brick';
import EVENT from '../event';
import { isCollisionEvent } from '../guard';
import { R } from '../loader';
import { getCanvas } from '../util';
import { getBrickType } from '../util/map-tool';
import Entity from './entity';

const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

const dictionary: { [K in IBrickType]?: number } = {
  iron: brick.iron,
  brick: brick.brick,
  grass: brick.grass,
};

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

export default class BrickFragment extends Entity implements IBrick, ISubScriber {
  protected isCollision = true;
  protected type: IEntityType = 'brick';
  protected rect: IEntityRect;
  protected brickType: IBrickType;

  protected status: TupleArray<number, 4>;
  private ctx!: CanvasRenderingContext2D;
  private sprite!: HTMLCanvasElement;
  protected fragmentIndex!: number;
  protected brickIndex: number;

  constructor(rect: IEntityRect, index: number) {
    super();

    this.rect = rect;
    this.brickIndex = index;
    this.status = [1, 1, 1, 1];
    this.brickType = getBrickType(index);
    this.getFragmentIndex();
    this.getImage();
    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY]);
  }

  public getBrickIndex(): number {
    return this.brickIndex;
  }

  public getBrickType(): IBrickType {
    return this.brickType;
  }

  protected getFragmentIndex(): void {
    this.fragmentIndex = dictionary[getBrickType(this.brickIndex)] || 0;
  }

  protected getImage(): void {
    const [, , w, h] = this.rect;
    const [canvas, ctx] = getCanvas(w, h);
    ctx.drawImage(R.Image.brick, this.fragmentIndex * 32, 0, w, h, 0, 0, w, h);
    this.sprite = canvas;
    this.ctx = ctx;
  }

  protected clipSprite(): void {
    this.status.forEach((s, i) => {
      if (s === 0) {
        const x = [1, 3].includes(i) ? 8 : 0;
        const y = [2, 3].includes(i) ? 8 : 0;
        this.ctx.clearRect(x, y, 8, 8);
      }
    });
  }

  protected reduce(bullet: IBullet): void {
    const [p1, p2, n1, n2] = {
      0: [2, 3, 0, 1],
      1: [0, 2, 1, 3],
      2: [0, 1, 2, 3],
      3: [1, 3, 2, 0],
    }[bullet.getDirection()];
    if (this.status[p1] === 0 && this.status[p2] === 0) {
      this.status[n1] = this.status[n2] = 0;
    } else {
      this.status[p1] = this.status[p2] = 0;
    }

    this.clipSprite();
  }

  public destroy(bullet: IBullet): void {
    if ((['grass', 'river', 'ice', 'blank'] as IBrickType[]).includes(this.brickType)) return;

    if (this.brickType === 'brick') {
      /** 土块，任何等级的子弹都能打碎 */
      if (bullet.getType() === 'enhance') {
        return super.destroy(bullet);
      }
      this.reduce(bullet);
      if (this.status.reduce((p, c) => p + c) === 0) {
        return super.destroy(bullet);
      }
    } else if (this.brickType === 'iron' && bullet.getType() === 'enhance') {
      return super.destroy(bullet);
    }
  }

  public update(): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.rect;
    ctx.drawImage(this.sprite, x + PL, y + PT, w, h);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (
      isCollisionEvent(event) &&
      event.type === EVENT.COLLISION.ENTITY &&
      event.entity === this &&
      event.initiator.getEntityType() === 'bullet'
    ) {
      this.destroy(event.initiator as IBullet);
    }
  }
}
