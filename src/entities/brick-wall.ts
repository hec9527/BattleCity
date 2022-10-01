import EVENT from '../event';
import config from '../config';
import brick from '../config/brick';
import BrickFragment from './brick-fragment';
import DelayStatusToggle from '../delay-status-toggle';

import { isCollisionEvent } from '../guard';

class BrickWall extends BrickFragment implements ISubScriber {
  protected brickType: IBrickType = 'brickWall';

  private wallType: 'brick' | 'iron' = 'brick';
  private lastStatus = brick.brick;

  private buildTicker = new DelayStatusToggle(
    config.ticker.wallBuildKeep,
    [brick.iron, brick.brick],
    config.ticker.wallBlinkStatus,
    15,
  );

  constructor(rect: IEntityRect) {
    super(rect, 1);

    // this.rebuild();
    this.buildTicker.setFinished(true);
  }

  private build(type: 'brick' | 'iron'): void {
    this.isDestroyed = false;
    this.isCollision = true;
    this.status = [1, 1, 1, 1];
    this.brickIndex = brick[type];
    this.wallType = type;
    this.getFragmentIndex();
    this.getImage();
  }

  private rebuild(): void {
    this.lastStatus = brick.brick;
    this.buildTicker.refresh();
  }

  public update(): void {
    if (!this.buildTicker.isFinished()) {
      this.buildTicker.update();
      const status = this.buildTicker.getStatus();
      if (status !== this.lastStatus) {
        this.lastStatus = status;
        this.build(status === brick.iron ? 'iron' : 'brick');
      }
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.isCollision = false;
  }

  public hit(bullet: IBullet): void {
    if (this.wallType === 'brick') {
      if (bullet.getType() === 'normal') {
        this.reduce(bullet);

        if (this.status.reduce((p, c) => p + c) === 0) {
          return this.destroy();
        }
      } else {
        this.destroy();
      }
    } else {
      if (bullet.getType() === 'enhance') {
        this.destroy();
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isDestroyed) {
      super.draw(ctx);
    }
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (
      isCollisionEvent(event) &&
      event.type === EVENT.COLLISION.ENTITY &&
      event.entity === this &&
      event.initiator.getEntityType() === 'bullet'
    ) {
      this.hit(event.initiator as IBullet);
    } else if (event.type === EVENT.BRICK.BUILD_WALL) {
      this.rebuild();
    } else if (event.type === EVENT.BRICK.DESTROY_WALL) {
      this.destroy();
    }
  }
}

export default BrickWall;
