import Config from '../config';
import EVENT from '../event';
import Ticker from '../ticker';
import StatusToggle from '../status-toggle';
import EntityMoveable from './entity-moveable';

import { R } from '../loader';
import { isBulletEvent, isCollisionEvent } from '../guard';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

abstract class Tank extends EntityMoveable implements ITank {
  protected protected = false;
  protected bulletLimit = 1;
  protected bullets = 0;
  protected level = 1;

  protected trackStatus = new StatusToggle([0, 1], Config.ticker.trackStatus);
  protected shootStatus = new StatusToggle([0, 1], Config.ticker.shootInterval, 1);
  protected protectorStatus = new StatusToggle([0, 1], Config.ticker.protectorStatus);

  private protectorTicker: ITicker | null = null;

  constructor() {
    super();
    this.shootStatus.setFinished(true);
    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY, EVENT.BULLET.DESTROYED, EVENT.BULLET.CREATE]);
  }

  public shoot(): void {
    if (this.bullets < this.bulletLimit && this.shootStatus.isFinished()) {
      this.bullets += 1;
      this.shootStatus.refresh();
      this.eventManager.fireEvent({ type: EVENT.TANK.SHOOT, tank: this });
    }
  }

  public getLevel(): number {
    return this.level;
  }

  public update(): void {
    this.shootStatus.update();
    this.protectorStatus.update();
    if (this.protected) {
      this.protectorTicker?.update();
    }
    super.update();
  }

  protected postMove(): void {
    this.trackStatus.update();
  }

  protected removeProtector(): void {
    this.protected = false;
    this.protectorTicker = null;
  }

  protected addProtector(): void {
    this.protected = true;
    this.protectorStatus.refresh();
    this.protectorTicker = new Ticker(Config.ticker.protector, () => {
      this.removeProtector();
    });
  }

  protected upGrade(level: number): void {
    this.level += level;
    if (this.level > 4) {
      this.level = 4;
    }
    if (this.level >= 3) {
      this.bulletLimit = 2;
    }
  }
  public isProtected(): boolean {
    return this.protected;
  }

  public destroy(): void {
    this.eventManager.removeSubscriber(this);
    this.eventManager.fireEvent({ type: EVENT.TANK.DESTROYED, tank: this });

    if (this.camp === 'ally') {
      this.eventManager.fireEvent({ type: EVENT.TANK.ALLY_TANK_DESTROYED, tank: this });
    } else if (this.camp === 'enemy') {
      this.eventManager.fireEvent({ type: EVENT.TANK.ENEMY_TANK_DESTROYED, tank: this });
    }

    super.destroy();
  }

  protected abstract hit(): void;

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.protected) {
      const [x, y] = this.rect;
      ctx.drawImage(R.Image.tool, (1 + this.protectorStatus.getStatus()) * 32, 0, 32, 32, x + PL, y + PT, 32, 32);
    }
  }

  private resolveCollisionEntity(entity: IEntity): void {
    const [x, y, w, h] = this.rect;
    const [rx, ry, rw, rh] = entity.getRect();
    let nx = x;
    let ny = y;

    switch (this.direction) {
      case 0:
        ny = ry + rh;
        break;
      case 1:
        nx = rx - w;
        break;
      case 2:
        ny = ry - h;
        break;
      case 3:
        nx = rx + rw;
        break;
      default:
        break;
    }

    // 解决碰撞砖块后，越过砖块的问题， 这里应该有其他解决办法
    if (Math.abs(x - nx) > 8 || Math.abs(y - ny) > 8) return;

    this.rect = [nx, ny, w, h];
  }

  public notify(event: INotifyEvent<ICollisionEvent>): void {
    super.notify(event);

    if (isCollisionEvent(event) && event.type === EVENT.COLLISION.ENTITY) {
      if (event.initiator === this) {
        switch (event.entity.getEntityType()) {
          case 'allyTank':
          case 'enemyTank':
          case 'base':
          case 'brick':
            if (!event.entity.getCollision()) return;
            this.resolveCollisionEntity(event.entity);
            break;
          case 'bullet':
            if (event.entity.getCamp() !== this.camp) {
              this.hit();
            }
            break;
        }
      } else if (
        event.entity === this &&
        event.initiator.getEntityType() === 'bullet' &&
        event.initiator.getCamp() !== this.getCamp()
      ) {
        this.hit();
      }
    } else if (isBulletEvent(event)) {
      if (event.type === EVENT.BULLET.DESTROYED && event.bullet.getTank() === this) {
        this.bullets -= 1;
      }
    }
  }
}

export default Tank;
