import Tank from './tank';
import EVENT from '../event';
import Config from '../config';
import StatusToggle from '../object/status-toggle';

import { R } from '../loader';
import { randomInt } from '../util';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class EnemyTank extends Tank implements IEnemyTank {
  protected readonly type: IEntityType = 'enemyTank';
  protected rect: IEntityRect;
  protected isCollision = true;
  protected shootStatus = new StatusToggle([0, 1], Config.ticker.enemyShoot, 1);

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

    this.shootStatus.setFinished(true);
    this.initSpeed();
  }

  protected hit(bullet: IBullet): void {
    if (this.protected) return;
    if (this.level >= 4) {
      this.level--;
    } else {
      this.level = 1;
      this.bulletLimit = 1;
    }
    R.Audio.play('hit');
    if (this.award >= 1) {
      this.award--;
      this.eventManager.fireEvent<ITankEvent>({ type: EVENT.TANK.AWARD_TANK_HIT, tank: this });
      return;
    }
    if (this.armor >= 1) {
      this.armor--;
      return;
    }
    this.destroy(bullet.getTank());
  }

  private initSpeed(): void {
    const { enemySlow, enemyFast, enemyNormal } = Config.speed;
    switch (this.enemyType) {
      case 0:
      case 1:
        this.speed = enemyNormal;
        break;
      case 2:
        this.speed = enemyFast;
        break;
      case 3:
      default:
        this.speed = enemySlow;
        break;
    }
  }

  protected destroy(killer?: ITank): void {
    this.eventManager.fireEvent({ type: EVENT.TANK.ENEMY_TANK_DESTROYED, tank: this, killer });
    super.destroy();
  }

  protected addLife(): void {
    this.award = randomInt(1, 3);
  }

  public update(): void {
    if (this.bullets === 0) {
      this.shootStatus.update();
    }
    super.update();
  }

  public setAward(award: number): void {
    this.award = award;
  }

  public setArmor(armor: number): void {
    this.armor = armor;
  }

  public getEnemyType(): IEnemyType {
    return this.enemyType;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDestroyed) return;
    let clipX = this.enemyType * 64 + (this.award > 0 ? 32 : 0);
    if (this.enemyType === 3) {
      clipX = this.award > 0 ? 288 : 192 + Math.min(this.armor, 2) * 32;
    }

    const [x, y, w, h] = this.rect;
    ctx.drawImage(
      R.Image.enemyTank,
      clipX,
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
