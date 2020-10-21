/**
 * 奖励类
 * 铁锹、五角星、坦克、安全帽、炸弹、闹钟  5
 */
class Reward extends Entity {
  constructor(props) {
    super(props);
    this.rect = [...this.getRandomPos(), 32, 32];
    this.type = (Math.random() * 6) | 0;
    this.img = GAME_ASSETS_IMAGE.getBonus()[this.type];
    this.tick = 0;
    this.check();
  }

  check() {
    if (this.word.game_reward instanceof Reward) {
      this.word.delEntity(this.word.game_reward);
    }
    this.word.game_reward = this;
  }

  /** 奖励生成的位置应该避开己方boss */
  getRandomPos() {
    const x = ((Math.random() * 24) | 0) + 1;
    const y = ((Math.random() * 24) | 0) + 1;
    if (22 < y && y < 25 && 10 < x && x < 15) {
      return this.getRandomPos();
    }
    return [x * 16, y * 16];
  }

  update() {
    // 10s
    if (++this.tick > 600) {
      super.die();
      this.word.game_reward = null;
    }
  }

  draw() {
    if (this.tick % 20 > 10) {
      super.draw();
    }
  }
}
