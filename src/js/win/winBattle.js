/**
 * 战斗界面
 */
class WinBattle extends Win {
  constructor() {
    super();
    this.isGameOver = false;
    this.isGameBegin = false;
    this.isGamePaused = false;
    this.coverHeight = 228;
    this.map = this.getMapDate();
    // 延迟定时器
    this.enemyBirthTick = null; // 敌人出生延迟   200
    this.allyTankBirthTick = null; // 我方坦克出生延迟 100
    this.rankPassTick = null; // 通关场景切换延迟 300
    // 场景参数
    this.enemyTnakRemain = 20;
    this.enemyTnakAlive = 0;
    this.game_reward = null; // 当前场景的奖励
    this.birthIndex = 0;
    this.allyTank = [];
    this.player = GAME_ARGS_CONFIG.PLAYERS;
    this.isDouble = GAME_ARGS_CONFIG.PLAYERNUM === 2;
    // 相关绘制
    this.background = this.getBackground();
    this.initMap();
    this.anima();
  }

  getMapDate() {
    if (GAME_ARGS_CONFIG.MAPEDIT) {
      GAME_ARGS_CONFIG.MAPEDIT = false;
      return GAME_LONG_MAPDATA[0];
    } else {
      return GAME_LONG_MAPDATA[GAME_ARGS_CONFIG.RANK];
    }
  }

  initMap() {
    const fillBrick = [1, 6, 11, 12, 13, 14, 15, 16];
    const part0 = [2, 5, 7, 10]; // 包含 0 部分 左上
    const part1 = [2, 3, 7, 8]; // 包含 1 部分  右上
    const part2 = [4, 5, 9, 10, 17, 19]; // 包含 2 部分  左下
    const part3 = [3, 4, 8, 9, 18, 20]; // 包含 3 部分  右下

    console.log(this.map);
    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        const index = this.map[row][col];
        const common = { word: this, row, col, index };
        if (fillBrick.includes(index)) {
          new Brick({ word: this, row, col, index });
        } else {
          const x = col * 32,
            y = row * 32;
          if (part0.includes(index)) {
            new BrickFragment({ ...common, pos: [x, y] });
          }
          if (part1.includes(index)) {
            new BrickFragment({ ...common, pos: [x + 16, y] });
          }
          if (part2.includes(index)) {
            new BrickFragment({ ...common, pos: [x, y + 16] });
          }
          if (part3.includes(index)) {
            new BrickFragment({ ...common, pos: [x + 16, y + 16] });
          }
        }
      }
    }
  }

  // 几乎不变的内容
  getBackground() {
    const { canvas, ctx } = getCanvas(516, 456);
    ctx.fillStyle = '#e3e3e3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(35, 20, 416, 416);
    ctx.drawImage(GAME_ASSETS_IMAGE.getBanner()[0], 470, 370);
    ctx.font = '18px prstart, Songti';
    ctx.fillText(GAME_ARGS_CONFIG.RANK, 485, 420);
    // 敌方坦克标识
    let [x, y] = [0, 0];
    for (let i = 1; i <= this.enemyTnakRemain; ) {
      i++ % 2 === 0 ? x++ : (x--, y++);
      ctx.drawImage(GAME_ASSETS_IMAGE.getTankFlag()[0], 480 + x * 16, 25 + y * 16);
    }
    // 我方坦克标识
    ctx.fillStyle = '#333';
    ctx.font = '18px prstart, Songti';
    ctx.fillText('1P', 465, 270);
    ctx.fillText(GAME_ARGS_CONFIG.PLAYERS[0].life, 485, 290);
    ctx.drawImage(GAME_ASSETS_IMAGE.getTankFlag()[1], 468, 275);
    if (GAME_ARGS_CONFIG.PLAYERNUM === 2) {
      ctx.fillText('2P', 465, 330);
      ctx.fillText(GAME_ARGS_CONFIG.PLAYERS[1].life, 485, 350);
      ctx.drawImage(GAME_ASSETS_IMAGE.getTankFlag()[1], 468, 335);
    }
    return (this.background = canvas);
  }

  generateEnemyTank() {
    this.enemyTnakRemain--;
    this.enemyTnakAlive++;
    this.background = this.getBackground();
    const rect = [this.birthIndex === 0 ? 0 : this.birthIndex === 1 ? 192 : 384, 0, 32, 32];
    const rand = Math.random() * 100;
    const type = rand < 35 ? 0 : rand < 60 ? 1 : rand < 85 ? 2 : 3;
    new BirthAnima({
      rect,
      word: this,
      onfinish: () => {
        new TankEnemy({ word: this, rect, type, onDie: () => this.enemyTnakAlive-- });
        !this.enemyBirthTick && (this.enemyBirthTick = new CountDown(100));
        ++this.birthIndex > 2 && (this.birthIndex = 0);
      },
    });
  }

  generateAllyTank(inheritTank, isDeputy = false) {
    const rect = [isDeputy ? 256 : 128, 384, 32, 32];
    new BirthAnima({
      rect,
      word: this,
      onfinish: () => {
        const tank = new TankAlly(inheritTank, {
          ...TANK_ALLY_OPTION,
          rect,
          isDeputy,
          word: this,
        });
        console.log('我方坦克：', tank);
      },
    });
    this.background = this.getBackground();
  }

  showGenerateAllyTank(isDeputy = false) {
    const tank = this.allyTank[isDeputy ? 1 : 0];
    const player = this.player[isDeputy ? 1 : 0];
    const playerOther = this.isDouble && this.player[isDeputy ? 0 : 1];
    const keys = GAME_CONFIG_KEYS[isDeputy ? 'p2' : 'p1'];
    if (!tank) {
      if (player.life > 0) {
        player.life--;
      } else if (
        player.life <= 0 &&
        playerOther.life > 0 &&
        GAME_LONG_KEYBORAD.isPressedAny(keys.a, keys.b)
      ) {
        playerOther.life--;
      } else {
        return;
      }
      this.allyTank[isDeputy ? 1 : 0] = {};
      this.generateAllyTank(player.tank || undefined, isDeputy);
    }
  }

  showGenerateEnemyTank() {
    if (
      this.enemyTnakRemain > 0 &&
      this.enemyTnakAlive < 5 &&
      (!this.enemyBirthTick || !this.enemyBirthTick.isCount())
    ) {
      Printer.info('生成敌方坦克');
      this.generateEnemyTank();
      this.enemyBirthTick = new CountDown(100);
    }
  }

  checkGameOver() {
    //
  }

  checkPassRound() {
    //
  }

  update() {
    // 更新计时器
    this.enemyBirthTick && this.enemyBirthTick.update();
    this.allyTankBirthTick && this.allyTankBirthTick.update();
    this.rankPassTick && this.rankPassTick.update();

    this.checkPassRound();
    this.checkGameOver();
    this.showGenerateEnemyTank();
    this.showGenerateAllyTank();
    this.isDouble && this.showGenerateAllyTank(true);

    // 更新演员
    this.entity.forEach((entity) => entity.update([...this.entity]));
  }

  draw() {
    this.ctx.clearRect(35, 20, 416, 416);
    this.ctx.drawImage(this.background, 0, 0);

    // 绘制演员
    this.entity.forEach((item) => item.draw());

    // cover 绘制拉幕
    if (this.coverHeight > 0) {
      this.coverHeight -= 10;
      this.ctx.fillStyle = '#e3e3e3';
      this.ctx.fillRect(0, 0, 516, this.coverHeight);
      this.ctx.fillRect(0, 456 - this.coverHeight, 516, this.coverHeight);
      this.coverHeight <= 0 && (this.isGameBegin = true);
    }
  }

  anima() {
    if (GAME_LONG_KEYBORAD.isTapKey(GAME_CONFIG_KEYS.p1.start) && this.isGameBegin) {
      this.isGamePaused = !this.isGamePaused;
      GAME_ASSETS_SOUND.play('pause');
    }
    if (!this.isGamePaused) {
      super.anima();
    } else {
      window.requestAnimationFrame(() => this.anima());
    }
  }
}
