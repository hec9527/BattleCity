/**
 * 关卡选择界面
 */
class WinRankPick extends Win {
  constructor() {
    super();
    this.listenKey = true;
    this.coverHeight = 0; // TO 228
    this.anima();
  }

  update() {
    this.coverHeight <= 228 && (this.coverHeight += 10);
    if (!this.listenKey) return;
    if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.up)) {
      GAME_ARGS_CONFIG.RANK++;
    } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.down)) {
      --GAME_ARGS_CONFIG.RANK < 1 && GAME_ARGS_CONFIG.RANK++;
    }
    if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.start)) {
      this.listenKey = false;
      setTimeout(() => (this.isOver = true), 50);
      GAME_ASSETS_SOUND.play('start');
      new WinBattle();
    }
  }

  drawFont() {
    this.ctx.fillStyle = '#444';
    this.ctx.font = '18px prstart, Songti';
    this.ctx.fillText(`STAGE ${GAME_ARGS_CONFIG.RANK}`, 200, 228);
  }

  draw() {
    this.ctx.fillStyle = '#e3e3e3';
    this.ctx.fillRect(0, 0, 516, this.coverHeight);
    this.ctx.fillRect(0, 456 - this.coverHeight, 516, this.coverHeight);
    if (this.coverHeight >= 228) {
      this.drawFont();
    }
  }
}
