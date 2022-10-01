import Tank from './tank';
import config from '../config';
import { R } from '../loader';

const { paddingLeft: PL, paddingTop: PT } = config.battleField;

class AllyTank extends Tank implements IAllyTank {
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect;
  protected isCollision = true;
  private player: IPlayer;
  private clipX: number;
  private shooting = false;

  constructor(rect: IEntityRect, player: IPlayer) {
    super();
    this.rect = rect;
    this.player = player;
    this.camp = 'ally';
    this.direction = 0;
    this.clipX = player.getRoleType() === 'P1' ? 0 : 32 * 4;
    this.speed = config.speed.slow;

    this.addProtector();
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

  protected hit(): void {
    if (this.protected) return;
    if (this.level >= 2) {
      this.bulletLimit = 1;
      this.level--;
    } else {
      super.destroy();
    }
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
