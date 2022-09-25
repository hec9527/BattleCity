import Entity from './entity';
import Config from '../config';
import EVENT from '../event';
import Bullet from './bullet';
import { Resource } from '../loader';
import Ticker, { BlinkTicker } from '../ticker';

const R = Resource.getResource();
const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

abstract class Tank extends Entity implements ITank {
  // basic info
  protected life = 1;
  protected level = 1;
  protected protected = false; // 保护罩
  protected bulletLimit = 1;
  protected bullets: Set<IEntity> = new Set<IEntity>();

  private canShoot = true;
  private protectorStatus = 1;
  protected trackStatus = 0;

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

  public notify(event: INotifyEvent<ICollisionEvent>): void {
    if (
      event.type === EVENT.COLLISION.ENTITY &&
      event.initiator instanceof Bullet &&
      event.initiator.getCamp() !== this.getCamp() &&
      event.entity === this
    ) {
      this.hit();
    }
  }
}

export default Tank;
