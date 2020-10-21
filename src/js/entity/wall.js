/**
 * 我方boss围墙
 */
class Wall extends Entity {
  constructor(props) {
    super(props);
    this.tick = 0;
    this.buildWall(true);
    // TODO 完成 Brick 之后再来完成围墙
  }

  buildWall(iron = false) {
    const map = this.word.map;
    if (iron) {
      map[11][5] = 20;
      map[11][6] = 9;
      map[11][7] = 19;
      map[12][5] = 8;
      map[12][7] = 10;
    } else {
      map[11][5] = 18;
      map[11][6] = 4;
      map[11][7] = 17;
      map[12][5] = 3;
      map[12][7] = 5;
    }
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
