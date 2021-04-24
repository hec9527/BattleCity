/**
 * 敌方坦克类
 */

import Tank from './tank';
import Entity from './entity';
import Reward from './reward';
import Brick from './brick';
import Bullet from './bullet';
import { getDistance, isOppositeDirection, randomInt } from '../util/index';
import { GAME_TANK_CHANGEDIR_TICK } from '../config/const';

interface IEnemyTankOption {
  world: IGameWorld;
}

/** 地方坦克的出生点 */
const BIRTH_POS = [
  [0, 0, 32, 32],
  [192, 0, 32, 32],
  [384, 0, 32, 32],
] as IEntityRect[];

class EnemeyTank extends Tank {
  private static birthIndex: 0 | 1 | 2 = 1;

  // basic info
  private reward: number;

  // status info
  private isCanChangeDir = true;

  constructor(options: IEnemyTankOption) {
    super({ rect: BIRTH_POS[EnemeyTank.birthIndex], direction: 2, world: options.world });
    this.reward = 0;
    randomInt(0, 10) < 3 && this.addLife();
  }

  changeDirection(): void {
    if (!this.isCanChangeDir) return;
    this.isCanChangeDir = false;
    const direction: IDirection = randomInt(0, 4) as IDirection;
    if (isOppositeDirection(this.direction, direction) || this.direction === direction) {
      this.changeDirection();
    } else {
      super.changeDirection(direction);
    }
  }

  move(entityList: Entity[]) {
    let nextRect = this.getNextRect();

    if (this.isCollisionBorderNextFrame()) {
      this.changeDirection();
      nextRect = this.rect;
    } else {
      entityList.forEach(entity => {
        if (entity === this) return;

        if (this.isCollisionEntityNextFrame(entity.rect)) {
          // 奖励
          if (entity instanceof Reward) {
            entity.die();
            this.getReward();
          }
          // 坦克
          else if (entity instanceof Tank) {
            const cDistance = getDistance(this.rect, entity.rect);
            const nDistance = getDistance(nextRect, entity.rect);
            // 坦克之间更近了，不可以移动
            if (nDistance < cDistance) {
              nextRect = this.rect;
            }
          }
          // 砖块
          else if (entity instanceof Brick) {
            nextRect = this.rect;
          }
          // 子弹
          else if (entity instanceof Bullet) {
            this.die();
            entity.die();
          }
        }
      });
    }
    this.rect = nextRect;
  }

  die() {
    if (this.isProtected || this.birthStatus || this.deathStatus) {
      return false;
    } else {
      if (this.reward >= 1) {
        this.reward--;
        Reward.getNewReward();
      } else if (this.life-- <= 1) {
        super.die();
      }
    }
  }

  addLife(): void {
    this.reward += randomInt(1, 3);
  }

  getReward(): void {}

  upGrade(): void {}

  public update(entityList: Entity[]): void {
    super.update(entityList);
    if (['birth', 'death'].includes(this.lifeCircle)) return;
    this.move(entityList);
    this.shoot();
  }
}

export default EnemeyTank;
