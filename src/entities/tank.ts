/**
 * 坦克类
 */

import Bullet from './bullet';
import EntityMoveAble from './entity-moveable';
import { getBulletPos, getDistance, isAllyTank, isBrick, isEnemyTank, isReward } from '../util/index';
import { Ticker } from '../util/ticker';
import Config from '../config/const';
import { Resource } from '../loader';

const R = Resource.getResource();

abstract class Tank extends EntityMoveAble {
  // basic info
  protected life: number;
  protected level: number;
  protected isStopped = false; // 定身，无法移动和射击
  protected isProtected = false; // 保护罩
  protected birthWaitTime = Config.entity.allyTank.birthWait; // 出生等待时间
  protected bulletNum = 1;
  protected bullets: Set<IBullet> = new Set<IBullet>();
  protected lifeCircle: ITankLifeCircle = 'wait';
  public isCollision: boolean;

  // status
  protected isCanShoot = true;
  protected wheelStatus: IMoveStatus = 0;
  protected birthStatus: IBirthStatus = 0;
  protected explodeStatus: IExplodeStatus = 0;
  protected explodeStatusStep: IExplodeStatusStep = 1;
  protected protectorStatus: IProtectorStatus = 0;

  // Ticker
  private stopTicker?: Ticker; // 定身计时器
  private moveTicker?: Ticker; // 特殊的计时器，这个只能在实例中使用和更新，应为实例移动之后才能更新数据
  private birthTicker?: ITicker;
  private protectTicker?: ITicker;
  private explodeTicker?: ITicker;

  constructor({ rect, camp, direction, speed, level, life, bulletNum }: ITankOption) {
    super({ rect, camp, direction, speed });
    this.direction = direction || 0;
    this.life = life || 1;
    this.level = level || 1;
    this.bulletNum = bulletNum || 1;
    this.isCollision = false;

    this.initTicker();
  }

  protected initTicker(): void {
    // 初始化计时器
    this.world.addTicker(
      new Ticker(this.birthWaitTime, () => {
        this.lifeCircle = 'birth';
        this.isCollision = true;
        this.birthTicker = new Ticker(
          Config.ticker.birthStatus,
          () => {
            if (++this.birthStatus > 3) {
              this.birthStatus = 0;
            }
          },
          true,
        );
        this.world.addTicker(this.birthTicker);
        this.world.addTicker(
          new Ticker(Config.ticker.birth, () => {
            this.lifeCircle = 'survival';
            this.world.delTicker(this.birthTicker!);
            this.birthTicker = undefined;
          }),
        );
      }),
    );
    this.moveTicker = new Ticker(
      Config.ticker.moveStatus,
      () => {
        this.wheelStatus = this.wheelStatus ? 0 : 1;
      },
      true,
    );
  }

  /** 改变实体移动方向, 实体的方向用于切图   */
  protected changeDirection(direction: IDirection): void {
    // eslint-disable-next-line prefer-const
    let [x, y, w, h] = this.rect;
    if (direction % 2) {
      y = Math.round(y / 16) * 16;
    } else {
      x = Math.round(x / 16) * 16;
    }
    this.direction = direction;
    this.rect = [x, y, w, h];
  }

  protected shoot(): void {
    /** isCanShoot用于控制连续射击间隔，Bullets.size用于控制发射子弹的数量  */
    if (!this.isCanShoot || this.bullets.size >= this.bulletNum) return;

    const [x, y] = this.rect;
    this.bullets.add(
      new Bullet({
        rect: getBulletPos(this.direction, x, y),
        camp: this.camp,
        level: this.level,
        direction: this.direction,
        beforeDie: (bullet: IBullet) => this.bullets.delete(bullet),
      }),
    );
    this.isCanShoot = false;
    this.world.addTicker(new Ticker(Config.ticker.shoot, () => (this.isCanShoot = true)));
  }

  protected getReward(rewardType: IRewardType): void {
    // TODO 完成奖励类型的处理
    const rewards = {
      0: () => {}, // 🛠 铁锹
      1: () => this.upGrade(1), // ⭐️  五角星  等级+1
      2: () => this.addLife(), // 🚂 坦克
      3: () => this.addProtector(), // 🛡 保护套
      4: () => this.killAllOppositeCampTank(), // 💣  炸弹，敌人全部boom
      5: () => this.stopAllOppositeCampTank(), // ⏰  地雷，敌人静止不动
      6: () => this.upGrade(4), // 🔫 手枪 等级+4 life+1
    };
    const action = rewards[rewardType];
    if (action) {
      action();
    } else {
      throw new Error(`未知的奖励类型 ${rewardType}`);
    }
  }
  protected abstract addLife(): void;
  protected abstract stopAllOppositeCampTank(): void;
  protected abstract killAllOppositeCampTank(): void;

  protected addProtector(tickerTime = Config.ticker.protector): void {
    if (this.protectTicker) {
      this.world.delTicker(this.protectTicker);
    }
    this.protectTicker = new Ticker(
      Config.ticker.protectorStatus,
      () => (this.protectorStatus = this.protectorStatus ? 0 : 1),
      true,
    );
    this.world.addTicker(this.protectTicker);
    this.world.addTicker(
      new Ticker(tickerTime, () => {
        this.world.delTicker(this.protectTicker!);
        this.protectTicker = undefined;
        this.isProtected = false;
      }),
    );
    this.isProtected = true;
  }

  protected upGrade(level: number): void {
    this.level += level;
    if (this.level > 4) {
      if (this.life <= 1) {
        this.life++;
      }
      if (isAllyTank(this)) {
        this.bulletNum = 2;
      }
    }
  }

  public setStopStatus(stop: boolean): void {
    if (this.stopTicker) {
      this.world.delTicker(this.stopTicker);
    }
    this.stopTicker = new Ticker(Config.ticker.stopStatus, () => {
      this.world.delTicker(this.stopTicker!);
      this.stopTicker = undefined;
      this.isStopped = false;
    });
    this.world.addTicker(this.stopTicker);
    this.isStopped = stop;
  }

  /**- 正在执行出生动画或者受保护的个体暂时免疫死亡
   * - 否则 life--   */
  public die(explode = false, callback?: () => void): void {
    if (this.life <= 1 || explode) {
      this.lifeCircle = 'death';
      this.isCollision = false;
      this.explodeTicker = new Ticker(
        Config.ticker.explodeStatus,
        () => {
          this.explodeStatus += this.explodeStatusStep;
          if (this.explodeStatus === 3 || this.explodeStatus === 0) {
            this.explodeStatusStep = -this.explodeStatusStep as IExplodeStatusStep;
          }
        },
        true,
      );
      this.world.addTicker(this.explodeTicker);
      this.world.addTicker(
        new Ticker(Config.ticker.explode, () => {
          this.world.delTicker(this.moveTicker);
          this.world.delTicker(this.explodeTicker!);
          this.explodeTicker = undefined;
          super.die();
          callback?.();
        }),
      );
    } else {
      this.life--;
      this.level = this.level > 1 ? this.level - 1 : 1;
      if (isAllyTank(this) && this.level < 4) {
        this.bulletNum = 1;
      }
    }
  }

  protected move(entityList: readonly IEntity[]): void {
    let move = true; // 这一帧是否可以移动
    const nextRect = this.getNextRect();

    // 下一帧碰到边界
    if (this.isCollisionBorderNextFrame()) {
      // eslint-disable-next-line prefer-const
      let [x, y, w, h] = nextRect;
      if (x < 0) {
        x = 0;
      } else if (x > Config.battleField.width - w) {
        x = Config.battleField.width - w;
      }
      if (y < 0) {
        y = 0;
      } else if (y > Config.battleField.height - h) {
        y = Config.battleField.height - h;
      }
      this.rect = [x, y, w, h];
      if (isEnemyTank(this)) this.changeDirection();
      return;
    }

    // 检测下一帧是否碰撞到其它实体
    entityList.every(entity => {
      if (entity === this) return true;
      if (this.isCollisionEntityNextFrame(entity)) {
        // 坦克-奖励
        if (isReward(entity)) {
          this.getReward(entity.rewardType);
          entity.die();
          console.log('reward die');
          return true;
        }
        // 坦克-坦克
        else if (isAllyTank(entity) || isEnemyTank(entity)) {
          if (!entity.isCollision) return true;
          const distance = getDistance(this.rect, entity.rect);
          const distanceNextFrame = getDistance(nextRect, entity.rect);
          if (distanceNextFrame < distance) {
            if (isEnemyTank(this)) this.changeDirection();
            return (move = false);
          }
        }
        // 坦克-砖块
        else if (isBrick(entity)) {
          if (entity.isCollision) {
            if (isEnemyTank(this)) this.changeDirection();
            return (move = false);
          }
        }
      }
      return true;
    });
    if (move) {
      this.rect = nextRect;
      this.moveTicker?.update();
    }
  }

  public draw(): void {
    const [x, y, w, h] = this.rect;

    // 出生动画 / 死亡动画   坦克自身由各个派生类自己实现
    if (this.lifeCircle === 'birth') {
      this.ctx.main.drawImage(R.Image.bonus, 32 * this.birthStatus, 64, 32, 32, x, y, w, h);
    } else if (this.lifeCircle === 'death') {
      this.ctx.main.drawImage(R.Image.explode, 64 * this.explodeStatus, 0, 64, 64, x - 16, y - 16, 64, 64);
    } else if (this.isProtected) {
      // 绘制保护罩
      this.ctx.main.drawImage(R.Image.tool, 32 + 32 * this.protectorStatus, 0, 32, 32, x, y, w, h);
    }
  }
}

export default Tank;
