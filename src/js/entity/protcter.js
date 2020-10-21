/**
 * 保护罩类
 */
class Protecter extends Entity {
  constructor(props) {
    super(props);
    this.tank = props.tank;
    this.rect = props.tank.rect;
    this.imgList = GAME_ASSETS_IMAGE.getProtecter();
    this.imgIndex = 0;
    this.img = this.imgList[this.imgIndex];
    this.onTimeOver = props.onTimeOver || function () {};
    this.tick = 0;
  }

  update() {
    this.rect = this.tank.rect;

    if (++this.tick % 5 === 0) {
      ++this.imgIndex > 1 && (this.imgIndex = 0);
      this.img = this.imgList[this.imgIndex];
    }
    // TODO fix 300
    if (this.tick >= 100 && false) {
      this.die();
    }
  }

  die() {
    super.die();
    this.onTimeOver();
  }
}
