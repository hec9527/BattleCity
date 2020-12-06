/**
 * 坦克类
 */

import AllyTank from './tank-ally';
import Brick from './brick';
import Bullet from './bullet';
import Entity from './entity';
import Ctx from '@src/util/brush';
import EnemyTank from './tank-enemy';
import EntityMoveAble from './entity-moveable';
import Reward from './reward';
import Source from '@src/loader/index';
import { Ticker, getDistance, getBulletPos } from '../util/index';
import {
  GAME_PROTECTER_TICK as TICK_T,
  GAME_TANK_BIRTH_TICK as TICK_B,
  GAME_TANK_SHOOT_TICK as TICK_S,
  GAME_TANK_MOVE_STATUS_TICK as TICK_M,
} from '../config/const';

const IMAGES = Source.getSource().IMAGES.Cache;

const ChangeStatus: (s: 0 | 1) => 0 | 1 = s => +!s as 0 | 1;

abstract class Tank extends EntityMoveAble {
  // basic info
  protected life: number;
  protected level: number;
  protected isProtected = false;
  protected BulletNum = 1;
  protected Bullets: Set<Bullet> = new Set<Bullet>();
  public lifeCircle: TankLifeCircle = 'birth';

  // status
  protected isCanShoot = true;
  protected wheelStatus: 0 | 1 = 0;
  protected birthStatus: 0 | 1 = 0;
  protected deathStatus: 0 | 1 = 0;
  protected protecterStatus: 0 | 1 = 0;

  // spirte
  protected spirte!: CanvasImageSource;
  protected birthSprite!: CanvasImageSource;
  protected deathSprite!: CanvasImageSource;
  protected protecterSprite!: CanvasImageSource;

  // Tickers
  protected shootTicker = Ticker(TICK_S);
  protected birthTicker = Ticker(TICK_B, ChangeStatus.bind({}, this.birthStatus), 5);
  protected deathTicker = Ticker(TICK_B, ChangeStatus.bind({}, this.deathStatus), 5);
  protected protecterTicker = Ticker(TICK_T, ChangeStatus.bind({}, this.protecterStatus), 5);
  protected wheelStatusTicker = Ticker(TICK_M);

  constructor(option: TankOption) {
    super(option);
    this.direction = option.direction || 0;
    this.life = option.life || 1;
    this.level = option.level || 1;
  }

  /**
   * 改变实体移动方向
   * 实体的方向用于切图
   * @param {Direction} direction
   */
  protected changeDirection(direction: Direction): void {
    let [x, y, w, h] = this.rect;
    if (direction % 2) {
      y = Math.round(y / 16) * 16;
    } else {
      x = Math.round(x / 16) * 16;
    }
    this.direction = direction;
    this.rect = [x, y, w, h];
  }

  protected move(entityList: Entity[]): void {
    if (this.speed === 0) return;
    let nextRect = this.getNextRect();

    this.wheelStatusTicker(ChangeStatus.bind({}, this.wheelStatus));

    /** 碰撞到边界 */
    if (this.isCollisionBorderNextFrame()) {
      if (this instanceof EnemyTank) {
        this.changeDirection();
      }
      nextRect = this.rect;
    } else {
      entityList.forEach(entity => {
        if (entity === this) return;

        // 坦克 <---> 奖励
        if (entity instanceof Reward) {
          if (this.isCollisionEntityNextFrame(entity.rect)) {
            this.getReward(entity.rewardType);
            entity.die();
          }
        }

        // 坦克 <---> 坦克
        else if (entity instanceof Tank) {
          if (this.isCollisionEntityNextFrame(entity.rect)) {
            const distanceCurren = getDistance(this.rect, entity.rect);
            const distanceNextTick = getDistance(nextRect, entity.rect);
            if (distanceNextTick < distanceCurren) {
              nextRect = this.rect;
              if (this instanceof EnemyTank) this.changeDirection();
            }
          }
        }

        // 坦克 <---> 砖块
        else if (entity instanceof Brick) {
          if (this.isCollisionEntityNextFrame(entity.rect)) {
            nextRect = this.rect;
            if (this instanceof EnemyTank) this.changeDirection();
          }
        }
      });
    }
    this.rect = nextRect;
  }

  public distoryBullet(bullet: Bullet): void {
    this.Bullets.delete(bullet);
  }

  protected shoot(): void {
    /** isCanShoot用于控制连续射击间隔，Bullets.size用于控制发射子弹的数量  */
    if (!this.isCanShoot || this.Bullets.size >= this.BulletNum) return;
    const [x, y] = this.rect;
    this.Bullets.add(
      new Bullet({
        rect: getBulletPos(this.direction, x, y),
        tank: this,
        level: this.level,
        world: this.world,
        camp: this.camp,
      })
    );
    this.isCanShoot = false;
  }

  protected addProtector(): void {
    this.isProtected = true;
  }

  protected abstract getReward(rewardType: RewardType): void;

  protected abstract upGrade(): void;

  protected abstract addLife(): void;

  /**
   * - 正在执行出生动画或者受保护的个体暂时免疫死亡
   * - 否则 life-- (仅限我方坦克)
   */
  public die() {
    this.lifeCircle === 'death';
  }

  // 真正的死亡
  private realDeath() {
    if (this.isProtected || this.lifeCircle === 'birth') {
      return false;
    } else if (this.life > 1) {
      this.life = 1;
      this.level = this instanceof AllyTank ? 1 : this.level;
      return false;
    }
    super.die();
  }

  public update(): void {
    // update ticker
    // wheelStatusTicker 在移动的时候调用
    this.lifeCircle === 'birth' && this.birthTicker(() => this.lifeCircle === 'survival');
    this.lifeCircle === 'death' && this.deathTicker(() => this.realDeath());
    !this.isCanShoot && this.shootTicker(() => (this.isCanShoot = true));
    this.isProtected && this.protecterTicker(() => (this.isProtected = false));
  }

  public draw(): void {
    // 绘制保护罩
    if (this.isProtected) {
      Ctx.misc.draw(this.protecterSprite, 0, 0, 32, 32, ...this.rect);
    }
    // 绘制坦克自身  出生动画 / 死亡动画 / 生存
    if (this.lifeCircle === 'survival') {
      Ctx.main.draw(this.spirte, 0, 0, 32, 32, ...this.rect);
    } else if (this.lifeCircle === 'birth') {
      Ctx.misc.draw(this.birthSprite, 0, 0, 32, 32, ...this.rect);
    } else {
      Ctx.misc.draw(this.deathSprite, 0, 0, 32, 32, ...this.rect);
    }
  }
}

export default Tank;
