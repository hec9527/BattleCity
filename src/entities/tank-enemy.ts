/**
 * 敌方坦克类
 */

import Tank from './tank';
import { dispense, randomInt } from '../util/index';
import Config from '../config/const';
import { Ticker } from '../util/ticker';
import { Resource } from '../loader';
import Reward from './reward';
import Game from '../object/game';

type IBirthPosIndex = 0 | 1 | 2;

const G = Game.getInstance();
const R = Resource.getResource();

class EnemyTank extends Tank {
  private static birthIndex: IBirthPosIndex = 1;
  private static enemyReserve: Array<number>; // 预备队
  private static enemyAlive: Set<EnemyTank> = new Set();

  public isCollision = true;
  public readonly score: number;
  public readonly type: IEntityType = 'enemyTank';
  protected birthWaitTime = Config.entity.enemyTank.birthWait;

  // basic info
  private reward: number;

  // status info
  private isCanChangeDir = true;

  private constructor(private tankType: IEnemyType) {
    super({ rect: [...Config.entity.enemyTank.birthPos[EnemyTank.birthIndex]], direction: 2, camp: 'enemy' });

    if (++EnemyTank.birthIndex >= 3) {
      EnemyTank.birthIndex = 0;
    }

    this.reward = 0;
    this.speed =
      tankType === 3
        ? Config.entity.enemyTank.speedSlow
        : tankType === 2
        ? Config.entity.enemyTank.speedFast
        : Config.entity.enemyTank.speed;
    // this.score = tankType ===3?500:tankType ===2:4
    this.score = 100;
    this.life = randomInt(1, tankType === 3 ? 5 : 1);
    this.tankType = tankType;
    randomInt(0, 10) < 30 && this.addLife();
  }

  /** ### 初始化敌方坦克
   *  - 回合数越高，高级坦克越多 */
  public static initEnemyCamp(round: number): void {
    const enemyCombatAbility = Config.entity.enemyTank.combatAbilityBase + round;
    this.enemyReserve = dispense(enemyCombatAbility, 20);
    this.enemyAlive = new Set();
    this.birthIndex = randomInt(0, 2) as IBirthPosIndex;
  }
  public static initEnemyTank(): EnemyTank | undefined {
    if (this.enemyReserve.length > 0 && this.enemyAlive.size < Config.entity.enemyTank.combatUnit) {
      const enemy = new EnemyTank(1);
      this.enemyAlive.add(enemy);
      EnemyTank.enemyReserve.pop();
      return enemy;
    }
  }
  public static getEnemyRemainNum(): number {
    return this.enemyReserve.length;
  }

  public static getEnemyAliveTank(): Set<EnemyTank> {
    return this.enemyAlive;
  }

  /** 消灭敌方所有坦克 */
  public static killAllEnemy(): void {
    Array.from(this.enemyAlive).forEach(entity => entity.die(true));
  }
  public static killEnemy(enemyTank: EnemyTank): void {
    this.enemyAlive.delete(enemyTank);
  }

  protected killAllOppositeCampTank(): void {
    G.getPlayer().forEach(p => p?.getTank()?.die(true));
  }

  protected stopAllOppositeCampTank(): void {
    G.getPlayer().forEach(p => p?.getTank()?.setStopStatus(true));
  }

  changeDirection(): void {
    if (!this.isCanChangeDir) return;
    this.isCanChangeDir = false;
    this.world.addTicker(new Ticker(Config.ticker.changeDirection, () => (this.isCanChangeDir = true)));
    const direction: IDirection = randomInt(0, 3) as IDirection;
    super.changeDirection(direction);
  }

  die(explode = false): void {
    if (this.lifeCircle === 'death') return;
    if (this.lifeCircle === 'survival' && !this.isProtected) {
      if (explode) return super.die(true);
      if (this.reward >= 1) {
        Reward.getNewReward();
        this.reward--;
      } else {
        super.die(explode, () => {
          EnemyTank.killEnemy(this);
        });
      }
    }
  }

  addLife(): void {
    this.reward += randomInt(3, 5);
    // this.reward += randomInt(1, 3);
  }

  public update(entityList: readonly IEntity[]): void {
    if (this.lifeCircle !== 'survival' || this.isStopped) return;
    this.move(entityList);
    randomInt(0, 100) < 5 && this.shoot();
    randomInt(0, 1000) < 5 && this.changeDirection();
  }

  public draw(): void {
    if (this.lifeCircle === 'survival') {
      const [x, y, w, h] = this.rect;
      let sx;

      if (this.tankType < 3) {
        sx = this.tankType * 2 + (this.reward ? 1 : 0);
      } else {
        sx = this.reward ? 9 : Math.floor(6 + this.life / 2);
      }

      this.ctx.main.drawImage(
        R.Image.enemyTank,
        sx * 32,
        this.direction * 64 + this.wheelStatus * 32,
        w,
        h,
        Config.battleField.paddingLeft + x,
        Config.battleField.paddingTop + y,
        w,
        h,
      );
    }
    super.draw();
  }
}

export default EnemyTank;
