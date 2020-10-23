/**
 * # 我方boss围墙
 * ```
 * 基础围墙由地图初始化的时候构建，
 *
 * 此处围墙旨在玩家获得铁锹之后增强围墙
 * ```
 */
class Wall {
  constructor(props) {
    super(props);
    this.tick = 0;
    this.buildWall(true);
  }

  buildWall(iron = false) {
    //
  }

  update() {
    if (++this.tick > 1000) {
      this.die();
    }
    if (this.tick >= 700) {
      if ((this.tick - 700) % 40 === 0) {
        this.buildWall();
      } else if ((this.tick - 700) % 40 === 20) {
        this.buildWall(true);
      }
    }
  }

  draw() {}
}
