/* eslint-disable no-case-declarations */
import EVENT from '../event';
import Config from '../config';
import EntityMoveable from './entity-moveable';
import config from '../config';

import { R } from '../loader';
import { isCollisionEvent } from '../object/guard';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class Bullet extends EntityMoveable implements IBullet {
  protected readonly isCollision = true;
  protected rect: IEntityRect;
  protected type: IEntityType = 'bullet';
  protected zIndex = 3;

  private tank: ITank;
  private level: number;

  constructor(tank: ITank) {
    super();
    this.tank = tank;
    this.direction = tank.getDirection();
    this.rect = this.getBulletRect();
    this.level = tank.getLevel();
    this.camp = tank.getCamp();
    this.speed = this.level > 1 ? config.speed.bulletEnhance : Config.speed.bullet;

    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY]);
  }

  private getBulletRect(): IEntityRect {
    let [x, y] = this.tank.getRect();
    ({
      0: () => (x += 12),
      1: () => ((x += 24), (y += 12)),
      2: () => ((x += 12), (y += 24)),
      3: () => (y += 12),
    }[this.direction]());
    return [x, y, 8, 8];
  }

  public getDir(): IDirection {
    return this.direction;
  }

  public getTank(): ITank {
    return this.tank;
  }

  public getLevel(): number {
    return this.level;
  }

  public update(): void {
    this.move();
  }

  protected destroy(explosion = true): void {
    this.rect = this.getNextFrameRect();
    this.eventManager.fireEvent<IBulletExplosionEvent>({ type: EVENT.BULLET.DESTROYED, bullet: this, explosion });
    super.destroy();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isDestroyed) {
      const [x, y, w, h] = this.rect;
      ctx.drawImage(R.Image.tool, this.direction * 8, 0, 8, 8, x + PL, y + PT, w, h);
    }
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (event.type === EVENT.GAME.PAUSE) {
      this.pause = !this.pause;
    }

    if (isCollisionEvent(event)) {
      const { entity, initiator, type } = event;

      if (initiator === this) {
        if (type === EVENT.COLLISION.BORDER) {
          this.destroy();
        } else if (type === EVENT.COLLISION.ENTITY && entity.getCollision()) {
          switch (entity.getEntityType()) {
            case 'allyTank':
            case 'enemyTank':
              if (this.camp !== entity.getCamp() && entity !== this.tank) {
                this.destroy();
              }
              break;
            case 'bullet':
              this.destroy(false);
              break;
            case 'base':
              this.destroy();
              break;
            case 'brick':
              if ((['brick', 'brickWall', 'iron'] as IBrickType[]).includes((entity as IBrick).getBrickType())) {
                this.destroy();
              }
              break;
            default:
              break;
          }
        }
      } else if (entity === this) {
        switch (initiator.getEntityType()) {
          case 'allyTank':
          case 'enemyTank':
            if (this.camp != initiator.getCamp()) {
              this.destroy(false);
            }
            break;
          case 'bullet':
            this.destroy(false);
            break;
          default:
            break;
        }
      }
    }
  }
}

export default Bullet;
