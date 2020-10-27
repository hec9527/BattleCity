/**
 * 砖块类
 * 完整的32*32的砖块
 * 普通砖块受到攻击，变成砖块碎片 BrickFragment
 * 完整的砖块索引 1，6，11，12，13，14，15，16
 *
 * 变成碎片之后，按土砖块举例
 * |  16*16  |  16*16  |
 * --------------------
 * |  16*16  |  16*16  |
 *
 * 每个fragment 都有自己的rect，单独处理碰撞检测
 */
class Brick extends Entity {
  constructor(props) {
    super(props);
    this.index = props.index;
    this.row = props.row;
    this.col = props.col;
    this.rect = [32 * props.col, 32 * props.row, 32, 32];
    this.img = GAME_ASSETS_IMAGE.getBrick()[props.index];
    this.isWallBrick = this.checkIsWallBrick();

    if (this.index === 11) {
      this.collision = 0;
    }
  }

  checkIsWallBrick() {
    return (
      [11, 12].includes(this.row) &&
      [5, 6, 7].includes(this.col) &&
      !(this.col === 12 && this.row === 6)
    );
  }

  broken() {
    const common = { word: this.word, index: this.index, row: this.row, col: this.col };
    const [x, y] = this.rect;
    const POS = [
      [x, y],
      [x + 16, y],
      [x, y + 16],
      [x + 16, y + 16],
    ];
    POS.forEach((pos) => new BrickFragment({ ...common, pos }));
    super.die();
  }

  /**
   * 子弹击中砖块， 砖块破碎、死亡
   * @param {Bullet} param0
   */
  die({ level }) {
    switch (this.index) {
      // 6级子弹可以消除草丛
      case 11: {
        level >= 6 && super.die();
        break;
      }
      // 4级的子弹可以打碎铁块
      case 6: {
        level >= 4 && this.broken();
        break;
      }
      // 1级的子弹可以打碎砖块
      case 1: {
        this.broken();
        break;
      }
      // 我方boss受到攻击
      case 15: {
        this.index++;
        this.img = GAME_ASSETS_IMAGE.getBrick()[this.index];
        // TODO GAME over
        // this.word.isGameOver = true;
        GAME_ASSETS_SOUND.play('misc');
        Printer.error('游戏结束');
        break;
      }
    }
  }

  update() {}
}
