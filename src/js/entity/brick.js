/**
 * 砖块类
 */
class Brick extends Entity {
  constructor(props) {
    super(props);
    this.index = props.index;
    this.row = props.row;
    this.col = props.col;
    this.rect = [32 * props.col, 32 * props.row, 32, 32];
    this.rectPos = [...this.rect];
    this.img = GAME_ASSETS_IMAGE.getBrick()[props.index];
    this.isWallBrick = this.checkIsWallBrick();

    this.init();
  }

  checkIsWallBrick() {
    return (
      [11, 12].includes(this.row) &&
      [5, 6, 7].includes(this.col) &&
      !(this.col === 12 && this.row === 6)
    );
  }

  init() {
    switch (this.index) {
      // 不参与碰撞检测的部分
      case 11: {
        this.collision = 0;
        this.ctx.globalCompositeOperation = 'source-over';
      }
      // 砖块/铁块 -- 缺少下部分
      case 2:
      case 7: {
        this.rectPos[3] -= 16;
        break;
      }
      // 砖块/铁块 -- 缺少左部分
      case 3:
      case 8: {
        this.rectPos[0] += 16;
        break;
      }
      // 砖块/铁块 -- 缺少上部分
      case 4:
      case 9: {
        this.rectPos[1] += 16;
        break;
      }
      // 砖块/铁块 -- 缺少右部分
      case 5:
      case 10: {
        this.rectPos[2] -= 16;
        break;
      }
      // 砖块/铁块 -- 围墙右上角
      case 17:
      case 19: {
        const [x, y] = this.rectPos;
        this.rectPos = [x, y + 16, 16, 16];
        break;
      }
      // 砖块/铁块 -- 围墙左上角
      case 18:
      case 20: {
        const [x, y] = this.rectPos;
        this.rectPos = [x + 16, y + 16, 16, 16];
        break;
      }
    }
  }

  // TODO 砖块缺角
  reduce(level) {
    super.die();
  }

  die(level, callback = () => {}) {
    // 三级子弹可以消除草丛
    if (level >= 3) {
      if (this.index === 11) {
        super.die();
      }
    }
    // 2级的子弹可以打碎铁块
    if (level >= 2) {
      if ([6, 7, 8, 9, 10, 19, 20].includes(this.index)) {
        this.reduce(level);
        callback();
      }
    }
    // 1级的子弹可以打碎砖块
    if (level >= 1) {
      if ([1, 2, 3, 4, 5, 17, 18].includes(this.index)) {
        this.reduce(level);
        callback();
      }
    }
    // 我方boss受到攻击
    if (this.index === 15) {
      this.index++;
      this.img = GAME_ASSETS_IMAGE.getBrick()[this.index];
      // this.word.isGameOver = true;
      GAME_ASSETS_SOUND.play('misc');
      Printer.error('游戏结束');
    }
  }

  update() {}
}
