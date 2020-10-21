/**
 * 敌方坦克类
 * 贴图索引  [奖励/普通][dir][status]
 */
class TankEnemy extends Tank {
  constructor(props) {
    super(props);
    this.rect = props.rect;
    this.dir = 2;
    this.camp = -1; // 敌人阵营
    this.type = props.type | 0 || 0; // 0 弱、1 基础、 2 快速、 3巨型  巨型坦克有3种不带奖励的
    this.onDie = props.onDie;
    this.life = props.type === 3 ? (Math.random() * 3 + 1) | 0 : 1;
    this.reward = this.getRandomReward();
    this.imgList = this.getImageList();
    this.img = this.changeImg();
    this.speed = this.getSpeed();
    this.tickChangeDir = 0;
  }

  die(explode = false) {
    if (explode) {
      super.die();
      this.onDie();
      return;
    }
    if (this.reward > 0) {
      --this.reward;
      new Reward({ word: this.word });
    } else if (this.life > 1) {
      --this.life;
    } else {
      super.die();
      this.onDie();
    }
  }

  changeDir() {
    if (this.tickChangeDir > 0) return;
    super.changeDir();
    this.tickChangeDir = 20;
  }

  changeImg() {
    let index = 0;
    if (this.reward > 0) {
      index = this.type === 3 ? 3 : 1;
    } else {
      index = this.type === 3 ? this.life - 1 : 0;
    }
    return (this.img = this.imgList[index][this.dir][this.status]);
  }

  getSpeed() {
    return this.type === 3 ? 0.8 : this.type === 2 ? 2.5 : 1.3;
  }

  getImageList() {
    const types = {
      0: GAME_ASSETS_IMAGE.getEnemyTankWeek,
      1: GAME_ASSETS_IMAGE.getEnemyTankBase,
      2: GAME_ASSETS_IMAGE.getEnemyTankFast,
      3: GAME_ASSETS_IMAGE.getEnemyTankStrong,
    };
    return types[this.type]() || types[0]();
  }

  // 不同坦克携带的奖励不同
  getRandomReward() {
    const rand = Math.random() * 7;
    return rand > 5 ? (Math.random() * (this.type < 3 ? 2 : 4) + 1) | 0 : 0;
  }

  update(entityLis) {
    Math.random() < 0.0005 && this.changeDir();
    this.tickShoot > 0 && --this.tickShoot;
    this.tickChangeDir > 0 && --this.tickChangeDir;
    this.shoot();
    this.move(entityLis);
  }
}
