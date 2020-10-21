/**
 * 出生动画类
 */
class BirthAnima extends Entity {
  constructor(props) {
    super(props);
    this.rect = props.rect;
    this.imgList = GAME_ASSETS_IMAGE.getBirthAnima();
    this.imgIndex = 0;
    this.img = this.imgList[this.imgIndex];
    this.ticks = 0;
    this.onfinish = props.onfinish;
  }

  update() {
    if (++this.ticks % 4 == 0) {
      ++this.imgIndex > 3 && (this.imgIndex = 0);
      this.img = this.imgList[this.imgIndex];
    }
    if (this.ticks > 70) {
      this.die();
    }
  }

  die() {
    this.onfinish();
    super.die();
  }
}
