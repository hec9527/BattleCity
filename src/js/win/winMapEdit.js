/**
 * 地图编辑器窗口
 */
class WinMapEdit extends Win {
  constructor() {
    super();
    this.map = GAME_LONG_MAPDATA[0];
    this.flagPos = { x: 0, y: 0 };
    this.flagTick = new Tickers(15);
    this.anima();
  }

  taggleWindow() {
    fixMap();
    this.isOver = true;
    GAME_ARGS_CONFIG.MAPEDIT = true;
    setTimeout(() => new WinStart(), 0);
  }

  update() {
    this.flagTick.update();
    // 修改索引
    const indexAdd = (index) => (index === 14 ? index + 3 : index < 20 ? index + 1 : 0);
    const indexReduce = (index) => (index === 17 ? index - 3 : index > 0 ? index - 1 : 20);

    // 完成
    if (GAME_LONG_KEYBORAD.isTapKey(GAME_CONFIG_KEYS.p1.start)) {
      return this.taggleWindow();
    }

    // 移动
    if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.up) && this.flagPos.y > 0) {
      this.flagPos.y--;
    } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.down) && this.flagPos.y < 12) {
      this.flagPos.y++;
    } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.left) && this.flagPos.x > 0) {
      this.flagPos.x--;
    } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.right) && this.flagPos.x < 12) {
      this.flagPos.x++;
    }
    // 填充
    let brickIndex = this.map[this.flagPos.y][this.flagPos.x];
    if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.a)) {
      brickIndex = indexReduce(brickIndex);
    } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.b)) {
      brickIndex = indexAdd(brickIndex);
    }
    this.map[this.flagPos.y][this.flagPos.x] = brickIndex;
  }

  draw() {
    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw background
    this.ctx.fillStyle = '#e3e3e3';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(35, 20, 416, 416);
    // draw brick
    for (let col = 0; col <= 12; col++) {
      for (let row = 0; row <= 12; row++) {
        this.ctx.drawImage(
          GAME_ASSETS_IMAGE.getBrick()[this.map[row][col]],
          col * 32 + 35,
          row * 32 + 20
        );
      }
    }
    // draw flag
    this.flagTick.isTick() &&
      this.ctx.drawImage(
        GAME_ASSETS_IMAGE.getPlayerOneTank()[0][0][0],
        this.flagPos.x * 32 + 35,
        this.flagPos.y * 32 + 20
      );
  }
}
