/**
 * 敌方坦克类
 */

import Tank from './tank';
import { isOppositeDirection } from '../util/index';

class EnemeyTank extends Tank {
  constructor(options: TankOption) {
    super(options);
  }

  changeDirection(): void {
    const direction: Direction = ((Math.random() * 4) >> 0) as Direction;
    if (isOppositeDirection(this.direction, direction) || this.direction === direction) {
      this.changeDirection();
    } else {
      super.changeDirection(direction);
    }
  }

  changeImg(): void {
    //
  }

  addLife(): void {
    //
  }

  getReward(): void {
    //
  }

  upGrade(): void {
    //
  }

  update(): void {
    if (['birth', 'death'].includes(this.lifeCircle)) return;
  }
}

export default EnemeyTank;
