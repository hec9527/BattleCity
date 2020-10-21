/**
 * 我方坦克类
 */
class TankAlly extends Tank {
  constructor(tank, props) {
    if (tank) {
      tank.rect = props.react;
      tank.dir = props.dir;
      return tank;
    }
    super(props);
    this.rect = props.rect;
    this.camp = 1;
    this.isDeputy = props.isDeputy;
    this.imgList = GAME_ASSETS_IMAGE[props.isDeputy ? 'getPlayerTwoTank' : 'getPlayerOneTank']();
    this.img = this.changeImg();
    this.isProtected = false;
    this.protecter = null;
    this.addProtecter();

    this.removeProtecter = this.removeProtecter.bind(this);
  }

  upgrade() {
    if (this.level < 3) {
      this.bulletNum = ++this.level;
      this.changeImg();
    } else {
      ++this.life > 2 && (this.life = 2);
    }
    console.log('tank upgrade:', this);
  }

  /** 添加保护罩 */
  addProtecter() {
    if (this.isProtected) this.removeProtecter();
    this.protecter = new Protecter({
      word: this.word,
      tank: this,
      onTimeOver: () => this.removeProtecter(),
    });
    this.isProtected = true;
  }

  removeProtecter() {
    this.isProtected = false;
    this.word.delEntity(this.protecter);
  }

  die() {
    if (this.isProtected) return;
    if (this.life > 1) {
      --this.life;
      this.level = 0;
      this.bulletNum = 1;
      this.changeImg();
    } else {
      this.word.allyTank[this.isDeputy ? 1 : 0] = undefined;
      GAME_ARGS_CONFIG.PLAYERS[this.isDeputy ? 1 : 0].tank = undefined;
      super.die();
    }
  }

  update(lis) {
    if (this.word.isGameOver) return;
    this.tickShoot > 0 && --this.tickShoot;
    const KEYS = GAME_CONFIG_KEYS[this.isDeputy ? 'p2' : 'p1'];

    ['up', 'right', 'down', 'left'].forEach((dir, index) => {
      if (GAME_LONG_KEYBORAD.isPressedKey(KEYS[dir])) {
        if (this.dir !== index) {
          this.changeDir(index);
        } else {
          this.move(lis);
        }
      }
    });

    if (GAME_LONG_KEYBORAD.isPressedAny(KEYS.a, KEYS.b)) {
      this.shoot();
    }
  }
}
