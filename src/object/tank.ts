/**
 * 坦克类
 */

import Bullet from './bullet';
import EntityMoveAble from './entity-moveable';
import { getBulletPos } from '../util/index';
import { Ticker, TickerList } from '@/util/ticker';

interface ITankOption {
  world: IGameWorld;
  rect: IEntityRect;
  direction: IDirection;
  life?: number;
  level?: number;
  BulletNum?: number;
}

abstract class Tank extends EntityMoveAble {
  // basic info
  protected life: number;
  protected level: number;
  protected isProtected = false;
  protected BulletNum = 1;
  protected Bullets: Set<Bullet> = new Set<Bullet>();
  public lifeCircle: ITankLifeCircle = 'birth';

  // status
  protected isCanShoot = true;
  protected wheelStatus: 0 | 1 = 0;
  protected deathStatus: 0 | 1 = 0;
  protected birthStatus: 0 | 1 | 2 | 3 = 2;
  protected protecterStatus: 0 | 1 = 0;

  // Ticker
  private tickerList: TickerList = new TickerList();
  private protectTicker?: Ticker;
  private shootTicker?: Ticker;
  // private wheelTicker: Ticker = new Ticker(
  //   GAME_TANK_MOVE_STATUS_TICK,
  //   () => (this.wheelStatus = this.wheelStatus === 1 ? 0 : 1),
  //   true
  // );
  // private birthTicker: Ticker = new Ticker(
  //   GAME_TANK_BIRTH_TICK,
  //   () => (this.birthStatus = this.birthStatus < 3 ? (this.birthStatus++ as 0 | 1 | 2 | 3) : 0),
  //   true
  // );
  // private deatchTicker: Ticker = new Ticker(
  //   GAME_TANK_EXPLODE_TICK,
  //   () => (this.deathStatus = this.deathStatus === 1 ? 0 : 1),
  //   true
  // );

  constructor(option: ITankOption) {
    super(option);
    this.direction = option.direction || 0;
    this.life = option.life || 1;
    this.level = option.level || 1;
    this.BulletNum = option.BulletNum || 1;

    // this.tickerList.addTick(
    //   new Ticker(GAME_TANK_BIRTH_TICK, () => {
    //     this.lifeCircle = 'survival';
    //   })
    // );
  }

  /**
   * 改变实体移动方向
   * 实体的方向用于切图
   * @param {Direction} direction
   */
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
    if (!this.isCanShoot || this.Bullets.size >= this.BulletNum) return;
    const [x, y] = this.rect;
    this.Bullets.add(
      new Bullet({
        rect: getBulletPos(this.direction, x, y),
        tank: this,
        world: this.world,
        camp: this.camp,
        level: this.level,
      })
    );
    this.isCanShoot = false;
    // this.shootTicker = new Ticker(GAME_TANK_SHOOT_TICK, () => {
    //   this.isCanShoot = true;
    // });
    // this.tickerList.addTick(this.shootTicker);
  }

  protected addProtector(): void {
    if (this.protectTicker) {
      this.tickerList.delTick(this.protectTicker);
    }
    // this.protectTicker = new Ticker(GAME_PROTECTER_TICK, () => {
    //   this.isProtected = false;
    // });
    // this.tickerList.addTick(this.protectTicker);
    this.isProtected = true;
  }

  protected abstract getReward(rewardType: IRewardType): void;

  protected abstract upGrade(): void;

  protected abstract addLife(): void;

  /** 子弹死亡 */
  public bulletDie(bulet: Bullet) {
    this.Bullets.delete(bulet);
    this.shootTicker?.isAlive() && this.tickerList.delTick(this.shootTicker);
    this.isCanShoot = true;
  }

  /**
   * - 正在执行出生动画或者受保护的个体暂时免疫死亡
   * - 否则 life-- (仅限我方坦克)
   */
  public die(bullet?: Bullet) {
    this.lifeCircle === 'death';
    this.isCollision = false;
    // this.tickerList
    //   .addTick
    // new Ticker(GAME_TANK_EXPLODE_TICK, () => {
    //   this.tickerList.clearTick();
    //   super.die();
    // })
    // ();
  }

  public update(EntityList: IEntity[]): void {
    // update ticker
    // this.tickerList.updateTick();
  }

  public draw(): void {
    // eslint-disable-next-line prefer-const
    let [x, y, w, h] = this.rect;
    // x += GAME_BATTLEFIELD_PADDING_LEFT;
    // y += GAME_BATTLEFIELD_PADDING_TOP;

    // 绘制保护罩
    if (this.isProtected) {
      // this.ctx.drawImage(IMAGES.tool, 0, 32, 32, 32, x, y, w, h);
    }
    // 绘制坦克自身  出生动画 / 死亡动画 / 生存
    if (this.lifeCircle === 'survival') {
      // this.ctx.drawImage(this.spirte, 0, 0, 32, 32, x, y, w, h);
    } else if (this.lifeCircle === 'birth') {
      // this.ctx.drawImage(IMAGES.bonus, this.birthStatus * 32, 64, 32, 32, x, y, w, h);
    } else {
      // this.ctx.drawImage(IMAGES.explode, 0, 0, 32, 32, x, y, w, h);
    }
  }
}

export default Tank;
