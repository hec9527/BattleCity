/**
 * 坦克类
 */

import EntityMoveAble from './entity-moveable';
import Brick from './brick';
import Bullet from './bullet';
import Entity from './entity';
import Reward from './reward';
import EnemyTank from './tank-enemy';
import { Ticker, getDistance } from '../util/index';
import {
  GAME_PROTECTER_TICK as TICK_T,
  GAME_TANK_BIRTH_TICK as TICK_B,
  GAME_TANK_SHOOT_TICK as TICK_S,
  GAME_TANK_MOVE_STATUS_TICK as TICK_M,
} from '../config/const';

abstract class Tank extends EntityMoveAble {
  protected life: number;
  protected level: number;
  protected status = 0;
  protected isProtected = false;
  protected lifeCircle: TankLifeCircle = 'birth';
  protected Bullets: Set<Bullet> = new Set<Bullet>();
  protected BulletNum = 1;
  protected isCanShoot = true;
  protected shootTicker = Ticker(TICK_S);
  protected birthTicker = Ticker(TICK_B);
  protected protectTicker = Ticker(TICK_T);
  protected moveStatusTick = Ticker(TICK_M);

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
    // this.changeImg();
  }

  protected move(entityList: Entity[]): void {
    if (this.speed === 0) return;
    let nextRect = this.getNextRect();

    this.moveStatusTick(() => (this.status = +!this.status));

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

  protected shoot(): void {
    /** isCanShoot用于控制连续射击间隔，Bullets.size用于控制发射子弹的数量  */
    if (!this.isCanShoot || this.Bullets.size >= this.BulletNum) return;
    const [x, y] = this.rect;
    const directions = {
      0: [x + 12, y],
      1: [x + 24, y + 12],
      2: [x + 12, y + 24],
      3: [x, y + 12],
    };
    const rect = [...directions[this.direction], 8, 8] as EntityRect;
    this.Bullets.add(
      new Bullet({ rect, tank: this, level: this.level, world: this.world, camp: this.camp })
    );
    this.isCanShoot = false;
    this.shootTicker(() => (this.isCanShoot = true));
  }

  protected addProtector(): void {
    this.isProtected = true;
    this.protectTicker = Ticker(TICK_T);
  }

  protected abstract getReward(rewardType: RewardType): void;

  protected abstract upGrade(): void;

  protected abstract addLife(): void;

  public update(): void {
    this.isProtected && this.protectTicker(() => (this.isProtected = false));
    this.lifeCircle === 'birth' && this.birthTicker(() => this.lifeCircle === 'survival');
    this.lifeCircle === 'death' && this.birthTicker(() => this.die());
  }
}

export default Tank;
