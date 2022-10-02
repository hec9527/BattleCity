import Tank from './tank';
import EVENT from '../event';
import config from '../config';
import { R } from '../loader';

const { paddingLeft: PL, paddingTop: PT } = config.battleField;
export const birthPlace = {
  P1: [128, 384, 32, 32] as IEntityRect,
  P2: [256, 384, 32, 32] as IEntityRect,
};

class AllyTank extends Tank implements IAllyTank {
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect;
  protected isCollision = true;
  private player: IPlayer;
  private clipX: number;
  private shooting = false;

  constructor(player: IPlayer) {
    super();
    this.rect = birthPlace[player.getRoleType()];
    this.player = player;
    this.camp = 'ally';
    this.direction = 0;
    this.clipX = player.getRoleType() === 'P1' ? 0 : 32 * 4;
    this.speed = config.speed.slow;

    this.addProtector();
  }

  public inheritFromTank(tank: IAllyTank): void {
    this.upGrade(tank.getLevel());
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

  public update(): void {
    super.update();
    if (this.shooting) {
      super.shoot();
    }
  }

  protected destroy(killer?: ITank): void {
    this.eventManager.fireEvent({ type: EVENT.TANK.ALLY_TANK_DESTROYED, tank: this, killer });
    super.destroy();
  }

  protected hit(bullet: IBullet): void {
    if (this.protected) return;
    if (this.level >= 2) {
      this.bulletLimit = 1;
      this.level--;
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
      this.clipX + (this.level - 1) * 32,
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
}

export default AllyTank;
