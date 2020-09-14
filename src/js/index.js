/**
 * @author     hec9527
 * @time       2020-01-24
 * @change     2020-01-24
 * @description
 *      Battle City
 *
 *   1. 采用闭包的方式，防止修改游戏运行参数
 *
 */

(function () {
  const Printer = new Print();
  const GAME_ASSETS_IMAGE = new Images();
  const GAME_ASSETS_SOUND = new Sound();
  const GAME_LONG_KEYBORAD = new KeyBorad();
  const GAME_LONG_MAPDATA = []; // 地图数据
  const GAME_CONFIG_CUSTOME_MAP = [];
  const GAME_CONFIG_KEYS = {
    p1: {
      up: 87, // w
      down: 83, // s
      left: 65, // a
      right: 68, // d
      a: 71, // single g
      b: 72, // double h
      start: 66, // b
    },
    p2: {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
      a: 75, // single
      b: 76, // double
    },
  };
  const GAME_ARGS_CONFIG = {
    RANK: 1, // 当前关卡
    MAPEDIT: false, // 自定义地图
    PLAYERNUM: 1, // 玩家数量
    HISTORY: [], // 历史最高
    PLAYERS: [{ life: 3, tank: null }],
  };
  let GAME_CURRENT_WINDOW = null;

  for (let i = 0; i < 13; i++) GAME_CONFIG_CUSTOME_MAP.push(new Array(13).fill(0));

  /** 自定义地图可能会导致Boss和围墙 被修改，需要修复它们 */
  function fixMap(fixFence = false) {
    GAME_CONFIG_CUSTOME_MAP[12][6] = 15; // Boss 标志
    GAME_CONFIG_CUSTOME_MAP[11][5] = 18;
    GAME_CONFIG_CUSTOME_MAP[11][6] = 4;
    GAME_CONFIG_CUSTOME_MAP[11][7] = 17;
    GAME_CONFIG_CUSTOME_MAP[12][5] = 3;
    GAME_CONFIG_CUSTOME_MAP[12][7] = 5;
    console.log('fixmap --> ', GAME_CONFIG_CUSTOME_MAP);
  }

  /** 倒计时 */
  function CountDown(count = 0, cb = () => {}) {
    this.update = () => --count;
    this.isCount = () => count > 0 && cb();
  }

  /** 计时器  按帧计数  切换属性 */
  function Tickers(ticks = 30) {
    let flag = false;
    let tick = 0;

    this.update = function () {
      if (++tick > ticks) {
        tick = 0;
        flag = !flag;
      }
    };

    this.isTick = function () {
      return flag;
    };
  }

  /** Tool 工具类 */
  function Tool() {
    let cacheElement = {}; // 缓存DOM中 canvas元素
    /** 获取当前路径 */
    this.getPwd = function () {
      const index = window.location.href.lastIndexOf('/');
      return window.location.href.slice(0, index + 1);
    };

    /** 获取canvas */
    this.getCanvas = function (w, h, c) {
      if (c && cacheElement.c === c) return cacheElement.el;
      const canvas = c ? document.getElementById(c) : document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = w;
      canvas.height = h === undefined ? w : h;
      c && (cacheElement = { c, el: { canvas, ctx } });
      return { canvas, ctx };
    };
  }

  /** 日志打印类 */
  function Print() {
    this.debug = function (msg) {
      console.debug(`%cdebug: ${msg}`, 'color:#58C9B9');
    };

    this.info = function (msg) {
      console.info(`%cinfo: ${msg}`, 'color:#30A9DE');
    };

    this.warn = function (msg) {
      console.warn(`%cwarn: ${msg}`, 'color:#f9c00c');
    };

    this.error = function (msg) {
      console.error(`%cerror: ${msg}`, 'color:#E53A40');
    };

    this.copyright = function () {
      console.clear();
      console.log(
        '%c ',
        `background: url(${new Tool().getPwd()}img/UI.png);padding:0px 184px; line-height:136px;margin: 15px calc(50% - 184px);`
      );
      console.log(`%c@author: hec9527\n@time:   2020-1-24\n@note: \n\n\thi，你好`, 'color:red;font-size:16px;');
      console.log(
        `%c这是一个彩蛋，但是我还没想好写啥`,
        'color:#30A9DE;font-size:32px;padding:35px calc(50% - 256px);background:#30A9DE33;'
      );
      console.log('%c广告位招租', 'color:#abf;font-size:26px; padding:35px calc(50% - 65px); text-align:center;background: #abf3');
    };
  }

  /** 键盘事件监测类 */
  function KeyBorad() {
    const pressed = new Set();
    const blocked = new Set();
    const blockTicks = 150; // 连续响应间隔
    let isPasued = false;

    window.addEventListener('keydown', (e) => {
      // paused key's keyCode 66,  b
      if ((isPasued && e.keyCode === 66) || !isPasued) {
        console.log('keyDown: ', e.keyCode);
        pressed.add(e.keyCode);
      }
    });

    window.addEventListener('keyup', (e) => {
      pressed.delete(e.keyCode);
    });

    /** 是否已经按下某个按键 , 非连续响应 */
    this.isPressedKey = function (keyCode) {
      if (pressed.has(keyCode) && !blocked.has(keyCode)) {
        blocked.add(keyCode);
        setTimeout(() => blocked.delete(keyCode), blockTicks);
        return true;
      }
      return false;
    };

    /** 游戏是否暂停 */
    this.isPasued = function () {
      return isPasued;
    };

    /** 清除所有按键 */
    this.clearKeys = function () {
      try {
        pressed.clear();
        blocked.clear();
      } catch (e) {
        new Print().error(e);
        return true;
      }
      return true;
    };
  }

  /** 音频加载 */
  function Sound() {
    let isLoad = false;
    const path = (fName) => `./audio/${fName}.mp3`;
    const list = ['attack', 'attackOver', 'bomb', 'eat', 'life', 'misc', 'move', 'over', 'pause', 'start'];
    const loadSound = () => {
      return list.map((key) => {
        return new Promise((resolve, reject) => {
          const player = new Audio();
          const timer = setTimeout(() => {
            Printer.error(`音频加载失败 ${path(key)}`);
            reject();
          }, 5000);
          player.oncanplay = () => {
            resolve(player);
            clearTimeout(timer);
          };
          player.src = path(key);
        });
      });
    };

    Promise.all(loadSound()).then(
      () => (isLoad = true) && Printer.info('音频加载完成'),
      () => new Error('音频加载失败') && window.location.reload()
    );

    this.isLoad = function () {
      return isLoad;
    };
    this.play = function (fName) {
      if (!list.includes(fName)) {
        return Printer.error(`未注册的音频文件: ${fName}`);
      }
      const player = new Audio();
      player.oncanplay = () => player.play() && console.log('play');
      player.src = path(fName);
    };
  }

  /** 图片加载 */
  function Images() {
    let isLoad = false;
    const Imgs = [];
    const sprite = {};
    const path = (fName) => `./img/${fName}.png`;
    // 修改图片顺序可能会导致精灵图获取出现问题
    const list = ['bonus', 'brick', 'enemyTank', 'explode', 'getScore', 'getScoreDouble', 'myTank', 'tool', 'UI'];
    const loadImg = () => {
      return list.map((key, index) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          const timer = setTimeout(() => {
            Printer.error(`图片加载失败  ${path(key)}`);
            reject();
          }, 5000);
          image.onload = function () {
            resolve(image);
            clearTimeout(timer);
            Imgs[index] = image;
          };
          image.src = path(key);
        });
      });
    };
    /** key, imgIndex, jMin,  jMax */
    const getTankSprite = (k, index, jm, jM) => {
      if (sprite[k]) return sprite[k];
      const lis = [];
      for (let j = jm; j < jM; j++) {
        const _lis = [[], [], [], []];
        for (let i = 0; i < 8; i++) {
          const { canvas, ctx } = new Tool().getCanvas(32, 32);
          ctx.drawImage(Imgs[index], j * 32, i * 32, 32, 32, 0, 0, 32, 32);
          _lis[(i / 2) | 0][i % 2] = canvas;
        }
        lis.push(_lis);
      }
      return (sprite[k] = lis);
    };
    /** key, imgIndex, xMin, xMax, y, size  索引：[普通/奖励][方向][形态] */
    const getSmallSprite = (k, index, m, M, l = 0, size = 32) => {
      if (sprite[k]) return sprite[k];
      const lis = [];
      for (let i = m; i < M; ) {
        const { canvas, ctx } = new Tool().getCanvas(32, 32);
        ctx.drawImage(Imgs[index], i++ * size, l * size, size, size, 0, 0, 32, 32);
        lis.push(canvas);
      }
      return (sprite[k] = lis);
    };
    /** key, imgIndex, width, height, xMin, xMax, yMin, yMax */
    const getOtherSprite = (k, index, w, h, xMin, xMax, yMin, yMax) => {
      if (sprite[k]) return sprite[k];
      const lis = [];
      for (let j = xMin; j < xMax; j++) {
        for (let i = yMin; i < yMax; i++) {
          const { canvas, ctx } = new Tool().getCanvas(w, h);
          ctx.drawImage(Imgs[index], j * w, i * h, w, h, 0, 0, w, h);
          lis.push(canvas);
        }
      }
      return (sprite[k] = lis);
    };

    Promise.all(loadImg()).then(
      () => (isLoad = true) && Printer.info('图片加载完成'),
      () => new Error('图片加载失败') && window.location.reload()
    );

    /** 是否加载完成 */
    this.isLoad = () => isLoad;

    /** 获取奖励精灵图 bonus */
    this.getBonus = () => getSmallSprite('bonus', 0, 0, 6, 0);

    /** 获取分数精灵图 score */
    this.getScore = () => getSmallSprite('score', 0, 0, 5, 1);

    /** 获取出生动画 birthAnima */
    this.getBirthAnima = () => getSmallSprite('birthAnima', 0, 0, 4, 2);

    /** 获取砖块 brick  长度21 */
    this.getBrick = () => getSmallSprite('brick', 1, 0, 21, 0);

    /** 获取敌方坦克 弱   enemyTankWeek  索引：[普通/奖励][方向][形态] */
    this.getEnemyTankWeek = () => getTankSprite('enemyTankWeek', 2, 0, 2);

    /** 获取地方坦克 基础 enemyTankBase  索引：[普通/奖励][方向][形态] */
    this.getEnemyTankBase = () => getTankSprite('enemyTankbase', 2, 2, 4);

    /** 获取敌方坦克 快速 enemyTankFast */
    this.getEnemyTankFast = () => getTankSprite('enemyTankFast', 2, 4, 6);

    /** 获取敌方坦克 强大 enemyTankStrong */
    this.getEnemyTankStrong = () => getTankSprite('enemyTankStrong', 2, 6, 10);

    /** 获取敌方坦克  索引：[等级][普通/带奖励][方向][形态] */
    this.getEnemyTank = () => {
      if (sprite.enemy) return sprite.enemy;
      let lis = [];
      for (let i = 0; i < 3; i++) lis.push(getTankSprite(`playerOne${i}`, 2, 2 * i, 2 * i + 2));
      lis.push(getTankSprite(`playerOne${4}`, 2, 6, 10));
      return (sprite.enemy = lis);
    };

    /** 获取玩家1坦克  playerOne  [等级][方向][形态] */
    this.getPlayerOneTank = () => {
      if (sprite.playOne) return sprite.playOne;
      let lis = [];
      for (let i = 0; i < 4; i++) lis = lis.concat(getTankSprite(`playerOne${i}`, 6, i, i + 1));
      return (sprite.playOne = lis);
    };

    /** 获取玩家2坦克  playerTwo  [等级][方向][形态] */
    this.getPlayerTwoTank = () => {
      if (sprite.playTwo) return sprite.playTwo;
      let lis = [];
      for (let i = 4; i < 8; i++) {
        const _lis = getTankSprite(`playerTwo${i}`, 6, i, i + 1);
        console.log(_lis);
        lis = lis.concat(_lis);
      }
      return (sprite.playTwo = lis);
    };

    /** 获取子弹  bullet  */
    this.getBullet = () => getOtherSprite('bullet', 7, 8, 8, 0, 4, 0, 1);

    /** 获取坦克标志  tankFlag */
    this.getTankFlag = () => getOtherSprite('tankFlag', 7, 16, 16, 0, 2, 1, 2);

    /** 获取保护罩 protecter */
    this.getProtecter = () => getOtherSprite('protecter', 7, 32, 32, 1, 3, 0, 1);

    /** 获取爆炸动画 explodeAnima   64*64 */
    this.getExplodeAnima = () => getOtherSprite('explodeAnima', 3, 64, 64, 0, 5, 0, 1);

    /** 获取旗帜 banner */
    this.getBanner = () => getOtherSprite('banner', 7, 32, 32, 4, 5, 0, 1);

    /** 获取箭头 arrow */
    this.getArrow = () => getOtherSprite('arrow', 7, 32, 32, 3, 4, 0, 1);

    /** 获取结算页面 settlement */
    this.getSettlement = () => getOtherSprite('settlement', 4, 516, 456, 0, 1, 0, 1);

    /** 获取双人结算页面 settlementDouble */
    this.getSettlementDouble = () => getOtherSprite('settlement', 5, 516, 456, 0, 1, 0, 1);

    /** 获取开始页面 logo */
    this.getLogo = () => getOtherSprite('logo', 8, 376, 160, 0, 1, 0, 1);

    // TODO fix position
    /** 获取游戏结束 gameover  */
    this.getGameOver = () => getOtherSprite('over', 8, 248, 160, 0, 1, 1, 2);
  }

  /** 实体类 */
  class Entity {
    constructor(options) {
      const { canvas, ctx } = new Tool().getCanvas(516, 456, 'canvas');
      this.canvas = canvas;
      this.ctx = ctx;
      this.rect = options.rect; // 实体位置，大小
      this.rectLast = this.rect;
      this.img = options.img; // 实体贴图
      this.camp = options.camp || 0; // -1 敌人   1 友军
      this.speed = options.speed || 0;
      this.collision = options.collision || true; // 参与碰撞检测
      this.priority = 0; // 绘制优先级，先绘制的显示在下面  1  0  -1
      this.dir = 1; // 1上   2右   3下    4左
      this.hasChange = false; // 缓存更改状态，没有修改的不同重新绘制    只有在位置、贴图、方向修改之后才会重新绘制
    }

    move() {
      if (this.speed === 0) return false;
    }

    clearRect() {
      if (!this.hasChange) return false;
      this.ctx = clearRect(...this.rectLast);
      this.rectLast = [...this.rect];
    }

    draw() {
      if (!this.hasChange) return false;
    }
  }

  /** 游戏窗体类 */
  class Win {
    constructor() {
      const { canvas, ctx } = new Tool().getCanvas(516, 456, 'canvas');
      this.canvas = canvas;
      this.ctx = ctx;
      this.isOver = false;
      this.entity = {
        pre: new Set(),
        sub: new Set(),
      };
    }
    /** 添加实体演员 */
    addEntity(entity) {
      if (entity.priority > 0) {
        this.entity.pre.add(entity);
      } else {
        this.entity.sub.add(entity);
      }
    }
    /** 删除实体演员 */
    delEntity(entity) {
      if (entity.priority > 0) {
        this.entity.pre.delete(entity);
      } else {
        this.entity.sub.delete(entity);
      }
    }
    /** 获取所有entity */
    getAllEntity() {
      const set = new Set();
      for (let key of ['pre', 'sub']) {
        this.entity[key].forEach(set.add);
      }
      return set;
    }
    /** 更新窗体 */
    update() {}
    /** 绘制演员 */
    draw() {}
    /** 循环渲染 */
    anima() {
      this.update();
      this.draw();
      // window.requestAnimationFrame(() => !this.isOver && this.anima());
      setTimeout(() => !this.isOver && this.anima(), 50);
    }
  }

  /** 开始游戏窗体  游戏模式选择 */
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
    }

    getBackground() {
      const { canvas, ctx } = new Tool().getCanvas(516, 456);
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
        GAME_CURRENT_WINDOW = new WinMapEdit();
        console.log('地图编辑器');
      } else {
        GAME_CURRENT_WINDOW = new WinRankPick();
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
      if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.up)) {
        this.cPosIndex = this.cPosIndex <= 0 ? 2 : this.cPosIndex - 1;
      } else if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.down)) {
        this.cPosIndex = this.cPosIndex >= 2 ? 0 : this.cPosIndex + 1;
      } else if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.start)) {
        this.taggleWindow();
      }
    }

    draw() {
      this.ctx.clearRect(155, this.flagPos[0] - 32, 32, 120);
      this.ctx.drawImage(this.bgImage, 0, 0);
      this.ctx.drawImage(
        GAME_ASSETS_IMAGE.getPlayerOneTank()[2][1][this.cStatusTick.isTick() ? 1 : 0],
        155,
        this.flagPos[this.cPosIndex] - 25
      );
    }
  }

  /** 地图编辑器窗口 */
  class WinMapEdit extends Win {
    constructor() {
      super();
      this.map = GAME_CONFIG_CUSTOME_MAP;
      this.flagPos = { x: 0, y: 0 };
      this.flagTick = new Tickers(7);
      this.anima();
    }

    taggleWindow() {
      fixMap();
      this.isOver = true;
      GAME_ARGS_CONFIG.MAPEDIT = true;
      setTimeout(() => (GAME_CURRENT_WINDOW = new WinStart()), 0);
    }

    update() {
      this.flagTick.update();
      // 修改索引
      const indexAdd = (index) => (index === 14 ? index + 3 : index < 20 ? index + 1 : 0);
      const indexReduce = (index) => (index === 17 ? index - 3 : index > 0 ? index - 1 : 20);

      // 完成
      if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.start)) {
        return this.taggleWindow();
      }

      // 移动
      if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.up) && this.flagPos.y > 0) {
        this.flagPos.y--;
      } else if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.down) && this.flagPos.y < 12) {
        this.flagPos.y++;
      } else if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.left) && this.flagPos.x > 0) {
        this.flagPos.x--;
      } else if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.right) && this.flagPos.x < 12) {
        this.flagPos.x++;
      }
      // 填充
      let brickIndex = this.map[this.flagPos.y][this.flagPos.x];
      if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.a)) {
        brickIndex = indexReduce(brickIndex);
      } else if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.b)) {
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
          this.ctx.drawImage(GAME_ASSETS_IMAGE.getBrick()[this.map[row][col]], col * 32 + 35, row * 32 + 20);
        }
      }
      // draw flag
      this.flagTick.isTick() &&
        this.ctx.drawImage(GAME_ASSETS_IMAGE.getPlayerOneTank()[0][0][0], this.flagPos.x * 32 + 35, this.flagPos.y * 32 + 20);
    }
  }

  /** 关卡选择界面 */
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
      if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.up)) {
        GAME_ARGS_CONFIG.RANK++;
      } else if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.down)) {
        --GAME_ARGS_CONFIG.RANK < 0 && GAME_ARGS_CONFIG.RANK++;
      }
      if (GAME_LONG_KEYBORAD.isPressedKey(GAME_CONFIG_KEYS.p1.start)) {
        this.listenKey = false;
        setTimeout(() => (this.isOver = true), 50);
        GAME_ASSETS_SOUND.play('start');
        GAME_CURRENT_WINDOW = new WinBattle();
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

  /** 战斗界面 */
  class WinBattle extends Win {
    constructor() {
      super();
      this.isBegin = false;
      this.coverHeight = 228;
      this.map = GAME_ARGS_CONFIG.MAPEDIT
        ? GAME_CONFIG_CUSTOME_MAP
        : GAME_LONG_MAPDATA[GAME_ARGS_CONFIG.RANK] && (GAME_ARGS_CONFIG.MAPEDIT = false);
      // 延迟定时器
      this.enemyBirthTick = null; // 敌人出生延迟   200
      this.allyTankBirthTick = null; // 我方坦克出生延迟 100
      this.rankPassTick = null; // 通关场景切换延迟 300
      // 场景参数
      this.enemyTnakRemain = 20;
      this.enemyTnakAlive = 0;
      this.game_reward = null; // 当前场景的奖励
      // 相关绘制
      this.background = this.getBackground();
      // start
      // this.generateEnemyTank();
      // this.generateEnemyTank();
      // this.generateEnemyTank();
      // TODO 生成敌方坦克
      this.generateAllyTank();
      this.generateAllyTank(true);
      this.anima();
    }

    // 几乎不变的内容
    getBackground() {
      const { canvas, ctx } = new Tool().getCanvas(516, 456);
      ctx.fillStyle = '#e3e3e3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(35, 20, 416, 416);
      ctx.drawImage(GAME_ASSETS_IMAGE.getBanner()[0], 470, 370);
      ctx.font = '18px prstart, Songti';
      ctx.fillText(GAME_ARGS_CONFIG.RANK, 485, 420);
      // 敌方坦克标识
      let x = 0;
      let y = 0;
      for (let i = 1; i <= this.enemyTnakRemain; ) {
        if (i++ % 2 === 0) {
          x++;
        } else {
          x--;
          y++;
        }
        ctx.drawImage(GAME_ASSETS_IMAGE.getTankFlag()[0], 480 + x * 16, 25 + y * 16);
      }
      // 我方坦克标识
      ctx.fillStyle = '#333';
      ctx.font = '18px prstart, Songti';
      ctx.fillText('1P', 465, 270);
      ctx.fillText(GAME_ARGS_CONFIG.PLAYERS[0].life, 485, 290);
      ctx.drawImage(GAME_ASSETS_IMAGE.getTankFlag()[1], 468, 275);
      // TODO fix
      if (GAME_ARGS_CONFIG.PLAYERNUM === 2 || true) {
        ctx.fillText('2P', 465, 330);
        ctx.fillText(GAME_ARGS_CONFIG.PLAYERS[0].life, 485, 350);
        ctx.drawImage(GAME_ASSETS_IMAGE.getTankFlag()[1], 468, 335);
      }
      return canvas;
    }

    generateEnemyTank() {
      this.enemyTnakRemain--;
      this.enemyTnakAlive++;
      this.background = this.getBackground();
    }

    generateAllyTank(isDeputy = false) {
      //
    }

    update() {
      // 拉幕效果
      if (this.coverHeight > 0) {
        this.coverHeight -= 10;
      }

      // 更新计时器
      this.enemyBirthTick && this.enemyBirthTick.update();
      this.allyTankBirthTick && this.allyTankBirthTick.update();
      this.rankPassTick && this.rankPassTick.update();

      // 通关条件 -- 敌方坦克为0，场上敌方坦克为0
      if (this.enemyTnakRemain <= 0 && this.enemyTnakAlive <= 0) {
        console.log('pass rank');
      }
      // 游戏结束
      if (
        (!GAME_ARGS_CONFIG.PLAYERS[0].tank && !GAME_ARGS_CONFIG.PLAYERS[0].life) ||
        (GAME_ARGS_CONFIG.PLAYERNUM === 2 && !GAME_ARGS_CONFIG.PLAYERS[1].life && !GAME_ARGS_CONFIG.PLAYERS[1].tank)
      ) {
        console.log('game over', GAME_ARGS_CONFIG);
      }

      // 判断是否 需要生成敌方坦克
      if (this.enemyTnakRemain > 0 && this.enemyTnakAlive <= 5) {
        let tick = this.enemyBirthTick;
        console.log(this.enemyBirthTick);
        !tick && this.generateEnemyTank();
        tick = new CountDown(200, function () {
          tick = null;
        });
      }

      // 判断是否 需要生成我方坦克
      if (!GAME_ARGS_CONFIG.PLAYERS[0].tank && GAME_ARGS_CONFIG.PLAYERS[0].life > 0) {
        // 生成我方坦克1
      }
      if (GAME_ARGS_CONFIG.PLAYERNUM === 2 && !GAME_ARGS_CONFIG.PLAYERS[1].tank && GAME_ARGS_CONFIG.PLAYERS[1].life > 0) {
        // 生成我方坦克2
      }

      // 更新演员
      this.getAllEntity().forEach((entity) => entity.update());
    }

    draw() {
      this.ctx.clearRect(35, 20, 416, 416);
      this.ctx.drawImage(this.background, 0, 0);

      // cover 绘制
      if (this.coverHeight > 0) {
        this.ctx.fillStyle = '#e3e3e3';
        this.ctx.fillRect(0, 0, 516, this.coverHeight);
        this.ctx.fillRect(0, 456 - this.coverHeight, 516, this.coverHeight);
      }

      // pre绘制
      this.entity.pre.forEach((item) => item.draw());

      // comon绘制
      this.entity.sub.forEach((item) => item.draw());
    }
  }

  (function main() {
    if (!GAME_ASSETS_IMAGE.isLoad() || !GAME_ASSETS_SOUND.isLoad()) return setTimeout(() => main(), 10);
    setTimeout(() => {
      // GAME_CURRENT_WINDOW = new WinStart();
      // GAME_CURRENT_WINDOW = new WinMapEdit();
      // GAME_CURRENT_WINDOW = new WinRankPick();
      GAME_CURRENT_WINDOW = new WinBattle();
      fixMap(true);
      // Printer.copyright();
    }, 10);
  })();

  setTimeout(() => {
    const { canvas, ctx } = new Tool().getCanvas(516, 456, 'canvas');
    // ctx.fillStyle = '#e3e3e3';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // let img = GAME_ASSETS_IMAGE.getTankFlag();
    // console.log(img);
    // // [类型][普通/带奖励][方向][形态]   类型=3 奖励0-3
    // // img = img[3][0][3];
    // // console.log(img);
    // // ctx.drawImage(img[1][0][0], 150, 150);
    // for (let i = 0; i < img.length; i++) {
    //   ctx.drawImage(img[i], 50 + 32 * (i - 0), 160);
    // }
    // // ctx.drawImage(img[0], 0, 0);
    console.log('draw');
  }, 200);
})();
