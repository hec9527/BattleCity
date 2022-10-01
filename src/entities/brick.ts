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
import Config from '../config';
import EVENT from '../event';
import BrickFragment from './brick-fragment';
import { R } from '../loader';
import { getBrickType } from '../util/map-tool';
import brick, { missLeftBottomBrick, missLeftTopBrick, missRightBottomBrick, missRightTopBrick } from '../config/brick';
import { isCollisionEvent } from '../guard';
import { isEntityCollision } from '../util';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

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

class Brick extends Entity implements IBrick, ISubScriber {
  protected type: IEntityType = 'brick';
  protected isCollision: boolean;
  protected isBrickFragment = false;
  protected brickIndex: number;
  protected brickType: IBrickType;
  protected rect: IEntityRect = [0, 0, 32, 32];

  constructor(brickIndex: number) {
    super();

    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY]);

    this.brickIndex = brickIndex;
    this.brickType = getBrickType(brickIndex);
    this.isCollision = !['grass', 'ice', 'blank'].includes(this.brickType);

    if (this.brickType === 'grass') {
      this.zIndex = 3;
    } else if (this.brickType === 'ice') {
      this.zIndex = -1;
    } else {
      this.zIndex = 0;
    }
  }

  private broken(bullet: IBullet) {
    fragmentPosition.forEach((fragment, index) => {
      if (
        (index === 0 && missLeftTopBrick.includes(this.brickIndex)) ||
        (index === 1 && missRightTopBrick.includes(this.brickIndex)) ||
        (index === 2 && missLeftBottomBrick.includes(this.brickIndex)) ||
        (index === 3 && missRightBottomBrick.includes(this.brickIndex))
      ) {
        return;
      }
      const [x, y] = this.rect;
      const rect = [fragment.x + x, fragment.y + y, 16, 16] as IEntityRect;

      const brickFragment = new BrickFragment(rect, dictionary[this.brickType] || 0);
      if (isEntityCollision(rect, bullet.getRect())) {
        brickFragment.destroy(bullet);
      }
    });
    super.destroy();
  }

  public update(): void {}

  public getBrickType(): IBrickType {
    return this.brickType;
  }

  public getBrickIndex(): number {
    return this.brickIndex;
  }

  public destroy(bullet: IBullet): void {
    if (this.isBrickFragment) return super.destroy();
    this.broken(bullet);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.rect;
    ctx.drawImage(R.Image.brick, 32 * this.brickIndex, 0, 32, 32, x + PL, y + PT, w, h);
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

export default Brick;
