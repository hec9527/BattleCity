import Config from '../config';
import EVENT from '../event';
import StatusToggle from '../status-toggle';
import EntityMoveable from './entity-moveable';

import { R } from '../loader';
import { isBulletEvent, isCollisionEvent } from '../guard';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

abstract class Tank extends EntityMoveable implements ITank {
  protected protected = false;
  protected bulletLimit = 1;
  protected bullets = 0;
  protected level = 1; // 2级子弹加快， 3级2发子弹  4级护甲、可以击穿铁块
  private exploded = false;

  protected abstract shootStatus: StatusToggle;
  protected trackStatus = new StatusToggle([0, 1], Config.ticker.trackStatus);
  protected protectorStatus = new StatusToggle([0, 1], Config.ticker.protectorStatus, Config.ticker.protector);

  constructor() {
    super();

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

  public getExploded(): boolean {
    return this.exploded;
  }

  public isProtected(): boolean {
    return this.protected;
  }

  public explosion(): void {
    if (!this.protected) {
      this.exploded = true;
      this.destroy();
    }
  }

  public update(): void {
    if (this.protected) {
      this.protectorStatus.update();
      if (this.protectorStatus.isFinished()) {
        this.protected = false;
      }
    }
    super.update();
  }

  protected postMove(): void {
    this.trackStatus.update();
    if (this.camp === 'ally') {
      // TODO 优化move音效
      // R.Audio.play('move');
    }
  }

  protected removeProtector(): void {
    this.protected = false;
    this.protectorStatus.setFinished(true);
  }

  protected addProtector(): void {
    this.protected = true;
    this.protectorStatus.refresh();
  }

  protected upGrade(level = 1): void {
    this.level = Math.min(4, this.level + level);

    if (this.level >= 3) {
      this.bulletLimit = 2;
    }
  }

  protected destroy(): void {
    this.eventManager.fireEvent({ type: EVENT.TANK.DESTROYED, tank: this });
    R.Audio.play('explosion');
    super.destroy();
  }

  protected abstract addLife(): void;
  protected abstract hit(bullet: IBullet): void;

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

  private pickAward(award: IAward): void {
    if (this.getCamp() === 'enemy' && !window.allowEnemyPick) return;

    switch (award.getAwardType()) {
      // 铁锹
      case 0:
        if (this.camp === 'enemy') {
          this.eventManager.fireEvent({ type: EVENT.AWARD.ENEMY_PICK_SPADE, award, picker: this });
        } else {
          this.eventManager.fireEvent({ type: EVENT.AWARD.ALLY_PICK_SPADE, award, picker: this });
        }
        break;
      // 五角星
      case 1:
        this.upGrade();
        break;
      // 坦克
      case 2:
        this.addLife();
        break;
      // 保护
      case 3:
        this.addProtector();
        break;
      // 炸弹
      case 4:
        if (this.camp === 'enemy') {
          this.eventManager.fireEvent({ type: EVENT.AWARD.ENEMY_PICK_BOMB, award, picker: this });
        } else {
          this.eventManager.fireEvent({ type: EVENT.AWARD.ALLY_PICK_BOMB, award, picker: this });
        }
        break;
      // 地雷
      case 5:
        if (this.camp === 'enemy') {
          this.eventManager.fireEvent({ type: EVENT.AWARD.ENEMY_PICK_MINE, award, picker: this });
        } else {
          this.eventManager.fireEvent({ type: EVENT.AWARD.ALLY_PICK_MINE, award, picker: this });
        }
        break;
      // 手枪
      case 6:
        this.upGrade(4);
        break;
    }

    if (this.camp === 'ally') {
      switch (award.getAwardType()) {
        case 2:
        case 4:
          break;
        default:
          R.Audio.play('eat');
      }
    }
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
              this.hit(event.entity as IBullet);
            }
            break;
          case 'award':
            this.pickAward(event.entity as IAward);
            break;
        }
      } else if (
        event.entity === this &&
        event.initiator.getEntityType() === 'bullet' &&
        event.initiator.getCamp() !== this.getCamp()
      ) {
        this.hit(event.initiator as IBullet);
      }
    } else if (isBulletEvent(event)) {
      if (event.type === EVENT.BULLET.DESTROYED && event.bullet.getTank() === this) {
        this.bullets -= 1;
      }
    }
  }
}

export default Tank;
