/**
 * 地方坦克类
 */

import Tank from './tank';

class TankEnemy extends Tank implements TankEnemyElement {
  constructor(options: TankEnemyOption) {
    super(options);
  }

  changeDir() {
    super.changeDir((Math.random() * 4) >> 0);
  }

  changeImg() {
    //
  }
}

export default TankEnemy;
