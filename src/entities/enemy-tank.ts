import Tank from './tank';
import EVENT from '../event';
import Config from '../config';
import { R } from '../loader';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class EnemyTank extends Tank implements IEnemyTank {
  protected readonly type: IEntityType = 'enemyTank';
  protected rect: IEntityRect;
  protected isCollision = true;

  private award = 0;
  private armor = 0;
  private enemyType: IEnemyType;

  constructor(rect: IEntityRect, type: IEnemyType) {
    super();
    this.rect = rect;
    this.enemyType = type;
    this.direction = 2;
    this.stop = false;
    this.camp = 'enemy';

    this.initSpeed();
  }

  protected hit(): void {
    if (this.protected) return;
    if (this.level >= 4) {
      this.level--;
    } else {
      this.level = 1;
      this.bulletLimit = 1;
    }
    if (this.award >= 1) {
      this.award--;
      this.eventManager.fireEvent<ITankEvent>({ type: EVENT.TANK.AWARD_TANK_HIT, tank: this });
      return;
    }
    if (this.armor >= 1) {
      this.armor--;
      return;
    }
    super.destroy();
  }

  private initSpeed(): void {
    const { normal, slower, slowest, slow, fast, faster } = Config.speed;
    switch (this.enemyType) {
      case 0:
      case 1:
        this.speed = slower;
        break;
      case 2:
        this.speed = faster;
        break;
      case 3:
      default:
        this.speed = slowest;
        break;
    }
  }

  public setAward(award: number): void {
    this.award = award;
  }

  public setArmor(armor: number): void {
    this.armor = armor;
  }

  public getScore() {
    switch (this.enemyType) {
      case 0: // normal
        return 100;
      case 1: // enhance
        return 200;
      case 2: // fast
        return 300;
      case 3: // armor
        return 400;
      default:
        console.warn(`unregistered enemy type: ${this.enemyType}`);
        return 400;
    }
  }

  public getEnemyType(): IEnemyType {
    return this.enemyType;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDestroyed) return;

    const [x, y, w, h] = this.rect;
    ctx.drawImage(
      R.Image.enemyTank,
      this.enemyType * 32,
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

export default EnemyTank;
