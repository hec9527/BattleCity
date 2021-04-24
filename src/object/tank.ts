/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-const */
/**
 * 坦克类
 */

import Bullet from './bullet';
import EntityMoveAble from './entity-moveable';
import { getBulletPos, getDistance, isAllyTank, isBrick, isEnemyTank, isReward } from '@/util/index';
import { Ticker } from '@/util/ticker';
import Config from '@/config/const';
import { Resource } from '@/loader';

const R = Resource.getResource();

abstract class Tank extends EntityMoveAble {
  // basic info
  protected life: number;
  protected level: number;
  protected isProtected = false;
  protected bulletNum = 1;
  protected bullets: Set<IBullet> = new Set<IBullet>();
  protected lifeCircle: ITankLifeCircle = 'birth';

  // status
  protected isCanShoot = true;
  protected wheelStatus: IMoveStatus = 0;
  protected birthStatus: IBrithStatus = 0;
  protected explodeStatus: IExplodeStatus = 0;
  protected protecterStatus: IProtecterStatus = 0;

  // Ticker
  private moveTicker: Ticker; // 特殊的计时器，这个只能在实例中使用和更新，应为实例移动之后才能更新数据
  private birthTicker?: ITicker;
  private protectTicker?: ITicker;
  private explodeTicker?: ITicker;

  constructor({ world, rect, camp, direction, speed, level, life, bulletNum }: ITankOption) {
    super({ world, rect, camp, direction, speed });
    this.direction = direction || 0;
    this.life = life || 1;
    this.level = level || 1;
    this.bulletNum = bulletNum || 1;

    // 初始化计时器
    this.birthTicker = new Ticker(
      Config.ticker.brithStatus,
      () => {
        if (++this.birthStatus > 3) {
          this.birthStatus = 0;
        }
      },
      true
    );
    this.world.addTicker(this.birthTicker);
    this.world.addTicker(
      new Ticker(Config.ticker.brith, () => {
        this.lifeCircle = 'survival';
        this.world.delTicker(this.birthTicker!);
        this.birthTicker = undefined;
      })
    );
    this.moveTicker = new Ticker(
      Config.ticker.moveStatus,
      () => {
        this.wheelStatus = this.wheelStatus ? 0 : 1;
      },
      true
    );
  }

  /** 改变实体移动方向, 实体的方向用于切图   */
  protected changeDirection(direction: IDirection): void {
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
        world: this.world,
        camp: this.camp,
        level: this.level,
        direction: this.direction,
        beforeDie: (bullet: IBullet) => this.bullets.delete(bullet),
      })
    );
    this.isCanShoot = false;
    this.world.addTicker(new Ticker(Config.ticker.shoot, () => (this.isCanShoot = true)));
  }

  protected addProtector(tickerTime = Config.ticker.protecterStatus): void {
    console.log(this);

    if (this.protectTicker) {
      this.world.delTicker(this.protectTicker);
    }
    this.protectTicker = new Ticker(
      Config.ticker.protecterStatus,
      () => (this.protecterStatus = this.protecterStatus ? 0 : 1),
      true
    );
    this.world.addTicker(this.protectTicker);
    this.world.addTicker(
      new Ticker(tickerTime, () => {
        this.world.delTicker(this.protectTicker!);
        this.protectTicker = undefined;
        this.isProtected = false;
      })
    );
    this.isProtected = true;
  }

  protected abstract getReward(rewardType: IRewardType): void;

  protected abstract upGrade(): void;

  protected abstract addLife(): void;

  /**- 正在执行出生动画或者受保护的个体暂时免疫死亡
   * - 否则 life--   */
  public die(explode = false): void {
    if (this.lifeCircle === 'survival' && !this.isProtected) {
      if (this.life <= 1 || explode) {
        this.lifeCircle = 'death';
        this.isCollision = false;
        this.explodeTicker = new Ticker(
          Config.ticker.explodeStatus,
          () => (this.explodeStatus = this.explodeStatus ? 0 : 1),
          true
        );
        this.world.addTicker(
          new Ticker(Config.ticker.explode, () => {
            this.world.delTicker(this.explodeTicker!);
            this.explodeTicker = undefined;
            super.die();
          })
        );
      } else {
        this.life--;
        this.level = this.level > 1 ? this.level - 1 : 1;
      }
    }
  }

  move(entityList: readonly IEntity[]): void {
    let move = true; // 这以帧是否移动
    const nextRect = this.getNextRect();

    // 下一帧碰到边界
    if (this.isCollisionBorderNextFrame()) {
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
      if (this.isCollisionEntityNextFrame(entity.rect)) {
        // 坦克-奖励
        if (isReward(entity)) {
          this.getReward(entity.rewardType);
          entity.die();
          console.log('reward die');
          return true;
        }
        // 坦克-坦克
        else if (isAllyTank(entity) || isEnemyTank(entity)) {
          const distance = getDistance(this.rect, entity.rect);
          const distanceNextFrame = getDistance(nextRect, entity.rect);
          console.log(`closer:${distanceNextFrame < distance}`, distanceNextFrame, distance);

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
      this.moveTicker.update();
    }
  }

  public draw(): void {
    let [x, y, w, h] = this.rect;
    x += Config.battleField.paddingLeft;
    y += Config.battleField.paddingTop;

    // 出生动画 / 死亡动画   坦克自身由各个派生类自己实现
    if (this.lifeCircle === 'birth') {
      this.ctx.drawImage(R.Image.bonus, 32 * this.birthStatus, 64, 32, 32, x, y, w, h);
    } else if (this.lifeCircle === 'death') {
      this.ctx.drawImage(R.Image.explode, 32 * this.explodeStatus, 0, 32, 32, x - 16, y - 16, w, h);
    } else {
      // 绘制保护罩
      if (this.isProtected) {
        this.ctx.drawImage(R.Image.tool, 32 + 32 * this.protecterStatus, 0, 32, 32, x, y, w, h);
      }
    }
  }
}

export default Tank;
