import Tank from './tank';
import EVENT from '../event';
import config from '../config';
import StatusToggle from '../status-toggle';

import { R } from '../loader';
import { isTankEvent } from '../guard';

const { paddingLeft: PL, paddingTop: PT } = config.battleField;
export const birthPlace = {
  P1: [128, 384, 32, 32] as IEntityRect,
  P2: [256, 384, 32, 32] as IEntityRect,
};

class AllyTank extends Tank implements IAllyTank {
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect;
  protected isCollision = true;
  protected shootStatus = new StatusToggle([0, 1], config.ticker.allyShot, 1);

  private player: IPlayer;
  private clipX: number;
  private shooting = false;
  private slide = false;
  private slideStatus = new StatusToggle([0], 10, 1);

  constructor(player: IPlayer) {
    super();
    this.rect = birthPlace[player.getRoleType()];
    this.player = player;
    this.camp = 'ally';
    this.direction = 0;
    this.clipX = player.getRoleType() === 'P1' ? 0 : 32 * 4;
    this.speed = config.speed.ally;

    this.shootStatus.setFinished(true);
    this.protectorStatus.setLoop(config.ticker.protectorShort);
    this.protectorStatus.refresh();
    this.protected = true;

    this.eventManager.addSubscriber(this, [EVENT.TANK.ALLY_TANK_SLIDE]);
  }

  public inheritFromTank(tank: IAllyTank): void {
    this.level = tank.getLevel();
    if (this.level >= 3) {
      this.bulletLimit = 2;
    }
  }

  public setPlayer(player: IPlayer): void {
    this.player = player;
  }

  public getPlayer(): IPlayer {
    return this.player!;
  }

  public setShooting(shoot: boolean): void {
    this.shooting = shoot;
  }

  protected addProtector(): void {
    this.protectorStatus.setLoop(config.ticker.protector);
    super.addProtector();
  }

  public update(): void {
    super.update();
    this.shootStatus.update();
    if (this.shooting) {
      super.shoot();
    }
    if (this.slide) {
      this.move();
      this.slideStatus.update();
      if (this.slideStatus.isFinished()) {
        this.slide = false;
      }
    }
  }

  // @overwrite EntityMoveable.setStop
  public setStop(stop: boolean): void {
    if (this.slide) return;
    this.stop = stop;
    if (stop) {
      this.eventManager.fireEvent({ type: EVENT.TANK.ALLY_TANK_STOP, tank: this });
    }
  }

  protected destroy(killer?: ITank): void {
    this.eventManager.fireEvent({ type: EVENT.TANK.ALLY_TANK_DESTROYED, tank: this, killer });
    super.destroy();
  }

  protected hit(bullet: IBullet): void {
    if (this.protected) return;
    if (this.level >= 4) {
      this.bulletLimit = 1;
      this.level = 2;
      R.Audio.play('hit');
    } else {
      this.destroy(bullet.getTank());
    }
  }

  protected addLife(): void {
    this.player.addLife();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDestroyed) return;
    const [x, y, w, h] = this.rect;
    ctx.drawImage(
      R.Image.myTank,
      this.clipX + (Math.min(this.level, 4) - 1) * 32,
      (this.direction * 2 + this.trackStatus.getStatus()) * 32,
      32,
      32,
      x + PL,
      y + PT,
      w,
      h,
    );
    super.draw(ctx);
  }

  public notify(event: INotifyEvent<ICollisionEvent>): void {
    super.notify(event);
    if (event.type === EVENT.TANK.ALLY_TANK_SLIDE && isTankEvent(event) && event.tank === this) {
      this.slide = true;
      this.slideStatus.refresh();
    }
  }
}

export default AllyTank;
