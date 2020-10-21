/**
 * 爆炸类
 */
class Explode extends Entity {
  constructor(props) {
    super(props);
    const [x, y] = props.pos;
    const width = props.isBullet ? 32 : 64;
    this.isBullet = props.isBullet || true;
    this.rect = [x - width / 2 + 35, y - width / 2 + 20, width, width];
    this.imgList = GAME_ASSETS_IMAGE.getExplodeAnima();
    this.imgIndex = 0;
    this.tick = 0;
    this.priority = 0;
  }

  update() {
    if (++this.tick % 2 == 0) {
      if (this.isBullet && ++this.imgIndex > 2) {
        this.imgIndex = 0;
      }
    }
    if (this.tick > 5) {
      this.die();
    }
  }

  draw() {
    this.ctx.drawImage(this.imgList[this.imgIndex], ...this.rect);
  }
}
