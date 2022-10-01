import Tank from './tank';
import EVENT from '../event';
import Config from '../config';
import { R } from '../loader';

class EnemyTank extends Tank implements IEnemyTank {
  protected readonly type: IEntityType = 'enemyTank';
  protected rect: IEntityRect;
  protected flashTank = false;
  protected isCollision = true;

  private award = 0;
  private armor = 0;
  private enemyType: IEnemyType;

  private constructor(rect: IEntityRect, type: IEnemyType) {
    super();
    this.rect = rect;
    this.enemyType = type;

    this.initSpeed();
  }

  protected hit(): void {
    if (this.protected) return;
    if (this.armor >= 1) {
      this.armor--;
      this.eventManager.fireEvent<ITankEvent>({ type: EVENT.TANK.AWARD_TANK_HIT, tank: this });
      return;
    }
    super.hit();
  }

  private initSpeed(): void {
    const { normal, slow, fast } = Config.speed;
    switch (this.enemyType) {
      case 0:
      case 1:
        this.speed = normal;
        break;
      case 2:
        this.speed = fast;
        break;
      case 3:
      default:
        this.speed = slow;
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
      (this.direction * 2 + this.trackStatus) * 32,
      32,
      32,
      x,
      y,
      w,
      h,
    );
    super.draw(ctx);
  }
}

export default EnemyTank;
