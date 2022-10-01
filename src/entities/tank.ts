/* eslint-disable prefer-const */
import Config from '../config';
import EVENT from '../event';
import Ticker, { BlinkTicker } from '../ticker';
import EntityMoveable from './entity-moveable';

import { R } from '../loader';
import { isCollisionEvent } from '../guard';
import { isEntityCollision } from '../util';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

abstract class Tank extends EntityMoveable implements ITank {
  protected life = 1;
  protected level = 1;
  protected protected = false; // 保护罩
  protected bulletLimit = 1;
  protected bullets: Set<IEntity> = new Set<IEntity>();
  protected trackStatus = 0;

  private canShoot = true;
  private protectorStatus = 1;

  // ticker
  private shootTicker: ITicker | null = null;
  private protectorTicker: ITicker | null = null;
  private protectorStatusTicker: ITicker | null = null;
  private trackTicker = new BlinkTicker(
    Config.ticker.trackStatus,
    () => (this.trackStatus = this.trackStatus === 1 ? 0 : 1),
  );

  constructor() {
    super();

    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY]);
  }

  public shoot(): void {
    if (this.canShoot) {
      this.canShoot = false;
      this.shootTicker = new Ticker(Config.ticker.shoot, () => {
        this.canShoot = true;
        this.shootTicker = null;
      });
      this.eventManager.fireEvent({ type: EVENT.TANK.SHOOT, tank: this });
    }
  }

  public update(): void {
    if (!this.canShoot) {
      this.shootTicker?.update();
    }
    if (this.protected) {
      this.protectorTicker?.update();
      this.protectorStatusTicker?.update();
    }
    super.update();
  }

  protected postMove(): void {
    this.trackTicker.update();
  }

  protected removeProtector(): void {
    this.protected = false;
    this.protectorTicker = null;
    this.protectorStatusTicker = null;
  }

  protected addProtector(): void {
    this.protectorStatus = 1;
    this.protected = true;
    this.protectorTicker = new Ticker(Config.ticker.protector, () => {
      this.removeProtector();
    });
    this.protectorStatusTicker = new BlinkTicker(Config.ticker.protectorStatus, () => {
      this.protectorStatus = this.protectorStatus === 1 ? 0 : 1;
    });
  }

  protected upGrade(level: number): void {
    this.level += level;
    if (this.level > 4 && this.life <= 1) {
      this.life++;
    }
    if (this.level >= 3) {
      this.bulletLimit = 2;
    }
  }

  public destroy(): void {
    this.eventManager.fireEvent({ type: EVENT.TANK.DESTROYED, tank: this });

    if (this.camp === 'ally') {
      this.eventManager.fireEvent({ type: EVENT.TANK.ALLY_TANK_DESTROYED, tank: this });
    } else if (this.camp === 'enemy') {
      this.eventManager.fireEvent({ type: EVENT.TANK.ENEMY_TANK_DESTROYED, tank: this });
    }
  }

  protected hit(): void {
    this.life--;
    if (this.level > 1) {
      this.level--;
    }

    if (this.life <= 0) {
      this.destroy();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.protected) {
      const [x, y] = this.rect;
      ctx.drawImage(R.Image.tool, (1 + this.protectorStatus) * 32, 0, 32, 32, x + PL, y + PT, 32, 32);
    }
  }

  private resolveCollisionEntity(entity: IEntity): void {
    let [x, y, w, h] = this.rect;
    const [rx, ry, rw, rh] = entity.getRect();

    switch (this.direction) {
      case 0:
        y = ry + rh;
        break;
      case 1:
        x = rx - w;
        break;
      case 2:
        y = ry - h;
        break;
      case 3:
        x = rx + rw;
        break;
      default:
        break;
    }
    this.rect = [x, y, w, h];
  }

  public notify(event: INotifyEvent<ICollisionEvent>): void {
    super.notify(event);

    if (isCollisionEvent(event) && event.type === EVENT.COLLISION.ENTITY) {
      if (event.initiator === this) {
        // if (event.entity.getCollision() && event.entity.getEntityType() !== 'award') {
        if (['allyTank', 'base', 'brick', 'brickWall', 'enemyTank'].includes(event.entity.getEntityType())) {
          // const [x, y] = this.getCenter();
          // const [rx, ry] = event.entity.getCenter();
          // let [nx, ny, w, h] = this.getNextFrameRect();
          // nx = nx + w / 2;
          // ny = ny + h / 2;
          // const distance = Math.sqrt((x - rx) ** 2 + (y - ry) ** 2);
          // const nextDistance = Math.sqrt((nx - rx) ** 2 + (ny - ry) ** 2);
          // if (distance < nextDistance && isEntityCollision(this.getLastRect(), event.entity.getRect())) {
          //   this.rect = this.getNextFrameRect();
          // } else {
          // }
          this.resolveCollisionEntity(event.entity);
        }

        if (event.entity.getEntityType() === 'bullet' && event.entity.getCamp() !== this.getCamp()) {
          this.hit();
        }
      } else if (
        event.entity === this &&
        event.initiator.getEntityType() === 'bullet' &&
        event.initiator.getCamp() !== this.getCamp()
      ) {
        this.hit();
      }
    }
  }
}

export default Tank;
