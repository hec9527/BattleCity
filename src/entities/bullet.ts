/**
 * 子弹类
 */

import Config from '../config/const';
import { Resource } from '../loader';
import { Ticker } from '../util/ticker';
import EntityMoveAble from './entity-moveable';

const R = Resource.getResource();

class Bullet extends EntityMoveAble implements IBullet {
  public type: IEntityType;
  public isCollision = true;
  public readonly level: number;
  protected readonly speed: number;
  private lifeCircle: IBulletLifeCircle = 'survival';
  private dieCallback: (bullet: IBullet) => void;

  // status
  private explodeStatus: IMoveStatus = 0;

  // ticker
  private explodeTicker?: ITicker;

  constructor({ rect, camp, level, direction, beforeDie }: IBulletOption) {
    super({ rect, camp, direction });

    this.level = level || 1;
    this.speed = this.level > 1 ? Config.entity.bullet.speedFast : Config.entity.bullet.speed;
    this.dieCallback = beforeDie;
    this.type = 'bullet';
  }

  public getDir(): IDirection {
    return this.direction;
  }

  /** noAnimation ？子弹爆炸没有动画， 子弹与子弹对撞没有 子弹打中坦克没有 */
  public die(noAnimation = false): void {
    if (this.lifeCircle === 'death') return;

    this.dieCallback(this);
    if (noAnimation) {
      super.die();
    } else {
      this.isCollision = false;
      this.lifeCircle = 'death';
      this.explodeTicker = new Ticker(
        Config.ticker.bulletExplodeStatus,
        () => (this.explodeStatus = this.explodeStatus ? 0 : 1),
        true,
      );
      this.world.addTicker(this.explodeTicker);
      this.world.addTicker(
        new Ticker(Config.ticker.explodeBullet, () => {
          this.world.delTicker(this.explodeTicker!);
          this.explodeTicker = undefined;
          super.die();
        }),
      );
    }
  }

  move(lis: readonly IEntity[]): void {
    if (this.isCollisionBorderNextFrame()) {
      return this.die();
    }

    lis.every(entity => {
      if (entity === this || !entity.isCollision) return true;
      // 子弹-坦克  相同阵营
      if (
        (this.camp === 'enemy' && entity.type === 'enemyTank') ||
        (this.camp === 'ally' && entity.type === 'allyTank')
      ) {
        return true;
      }

      if (this.isCollisionEntityNextFrame(entity)) {
        // 子弹-子弹
        if (entity.type === 'bullet') {
          if (!entity.isCollision) return true;
          entity.die(true);
          this.die(true);
        }
        // 子弹-砖块
        else if (entity.type === 'brick') {
          entity.die(this);
          this.die();
        }
        // 子弹-坦克  不同阵营
        else if (
          (this.camp === 'enemy' && entity.type === 'allyTank') ||
          (this.camp === 'ally' && entity.type === 'enemyTank')
        ) {
          if (!entity.isCollision) return true;
          entity.die();
          this.die();
          // 坦克有保护罩子弹没有爆炸动画
        }
      }
      return true;
    });

    this.rect = this.getNextRect();
  }

  update(lis: readonly IEntity[]): void {
    if (this.lifeCircle === 'death') return;
    this.move(lis);
  }

  draw(): void {
    const [x, y, w, h] = this.rect;

    if (this.lifeCircle === 'survival') {
      this.ctx.main.drawImage(R.Image.tool, this.direction * 8, 0, 8, 8, x, y, w, h);
    } else {
      this.ctx.main.drawImage(R.Image.explode, this.explodeStatus * 64, 0, 64, 64, x - 28, y - 28, 64, 64);
    }
  }
}

export default Bullet;
