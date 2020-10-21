/**
 * 开始游戏窗体
 * 游戏模式选择 欢迎界面，游戏玩家选择界面
 */
class WinStart extends Win {
  constructor() {
    super();
    this.cPosIndex = 0;
    this.cStatusTick = new Tickers(5);
    this.flagPos = [315, 350, 385];
    this.bgImage = this.getBackground();
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.anima();

    // fix 第一次加载的时候字体文件未加载完成造成的字体异常的问题
    setTimeout(() => (this.bgImage = this.getBackground()), 500);
  }

  getBackground() {
    const { canvas, ctx } = getCanvas(516, 456);
    ctx.fillStyle = '#fff';
    ctx.font = '14px prstart, Songti SC';
    ctx.drawImage(GAME_ASSETS_IMAGE.getLogo()[0], 70, 95); // logo 376 * 160
    ctx.fillText('1P - Hi  20000', 30, 50);
    ctx.fillText('2P - Hi  20000', 300, 50);
    ctx.font = '18px prstart, Songti SC';
    ctx.fillText('1 PLAYER', 200, this.flagPos[0]);
    ctx.fillText('2 PLAYERS', 200, this.flagPos[1]);
    ctx.fillText('CONSTRUCTOR', 200, this.flagPos[2]);
    return canvas;
  }

  taggleWindow() {
    console.log('start');
    if (this.cPosIndex === 2) {
      new WinMapEdit();
      console.log('地图编辑器');
    } else {
      new WinRankPick();
      console.log('关卡选择');
      if (this.cPosIndex === 1) {
        GAME_ARGS_CONFIG.PLAYERNUM = 2;
        GAME_ARGS_CONFIG.PLAYERS.push({ life: 3, tank: null });
      }
    }
    this.isOver = true;
  }

  update() {
    this.cStatusTick.update();
    // 按键检测
    if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.up)) {
      this.cPosIndex = this.cPosIndex <= 0 ? 2 : this.cPosIndex - 1;
    } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.down)) {
      this.cPosIndex = this.cPosIndex >= 2 ? 0 : this.cPosIndex + 1;
    } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.start)) {
      this.taggleWindow();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.bgImage, 0, 0);
    this.ctx.drawImage(
      GAME_ASSETS_IMAGE.getPlayerOneTank()[2][1][this.cStatusTick.isTick() ? 1 : 0],
      155,
      this.flagPos[this.cPosIndex] - 25
    );
  }
}
