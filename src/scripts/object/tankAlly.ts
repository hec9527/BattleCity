/**
 * 我方坦克类
 */

import Tank from './tank';

class TankAlly extends Tank implements TankAllyElement {
  constructor(options: TankOption) {
    super(options);
  }

  changeImg() {
    //
  }
}

export default TankAlly;
