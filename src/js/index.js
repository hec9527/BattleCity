/**
 * @author     hec9527
 * @time       2020-07-27
 * @change     2020-07-27
 * @description
 *      Battle City
 *
 *   1. 采用闭包的方式，防止修改或者使用私有变量
 *
 */

(function () {
  const printer = new Print();

  /** 计时器  按帧计数 */
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
    /** 获取当前路径 */
    this.getPwd = function () {
      const index = window.location.href.lastIndexOf('/');
      return window.location.href.slice(0, index + 1);
    };

    /** 获取canvas */
    this.getCanvas = function (w, h, c) {
      const canvas = c ? document.getElementById(c) : document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = w;
      canvas.height = h === undefined ? w : h;
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
        `background: url(${Tool.getPwd()}img/UI.png);padding:0px 184px; line-height:136px;margin: 15px calc(50% - 184px);`
      );
      console.log(
        `%c@author: hec9527\n@time:   2020-1-5\n@description: \n\n\thi，你好。你能看到这条消息，多半也是程序员。无论是不是，请在程序中保留第一作者，虽然微不足道，但这是对原作者的一种鼓励也是继续创作的动力所在。\n\t如果你在使用过程中发现有任何bug，或者优化建议，可以直接发送到我的邮箱:\thec9527@foxmail.com\n\n`,
        'color:red'
      );
    };
  }

  /** 键盘事件监测类 */
  function KeyBorad() {
    const pressed = new Set();
    const blocked = new Set();
    const blockTicks = 100; // 连续响应间隔
    let isPasued = false;

    window.addEventListener('keydown', (e) => {
      // paused key's keyCode 66,  b
      if ((isPasued && e.keyCode === 66) || !isPasued) {
        console.log('keyDown: ', e.keyCode);
        pressed.add(e.keyCode);
      }
    });

    window.addEventListener('keuup', (e) => {
      pressed.delete(e.keyCode);
    });

    /** 是否已经按下某个按键 , 非连续响应 */
    this.isPress = function (keyCode) {
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
            printer.error(`音频加载失败 ${path(key)}`);
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
      () => (isLoad = true),
      () => new Error('音频加载失败')
    );

    this.isLoad = function () {
      return isLoad;
    };
    this.play = function (fName) {
      if (!list.includes(fName)) {
        return printer.error(`未注册的音频文件: ${fName}`);
      }
      const player = new Audio();
      player.oncanplay = () => player.play() && console.log(1);
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
            printer.error(`图片加载失败  ${path(key)}`);
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
      () => (isLoad = true),
      () => new Error('图片加载失败')
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
      for (let i = 0; i < 4; i++) lis = lis.concat(getTankSprite(`playerOne${i}`, 2, i, i + 1));
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

  const imgs = new Images();
  setTimeout(() => {
    const { canvas, ctx } = new Tool().getCanvas(516, 456, 'canvas');
    let img = imgs.getBonus();
    console.log(img);
    // [类型][普通/带奖励][方向][形态]   类型=3 奖励0-3
    // img = img[3][0][3];
    // console.log(img);
    // ctx.drawImage(img[1][0][0], 150, 150);
    for (let i = 0; i < img.length; i++) {
      ctx.drawImage(img[i], 50 + 32 * (i - 0), 160);
    }
    // ctx.drawImage(img[0], 0, 0);
    console.log('draw');
  }, 200);

  /** 实体类 */
  class Entity {
    constructor(options) {
      this.camp = options.camp || 'neutral'; // ally enemy
      this.pos = options.pos || [0, 0];
      this.bPos = options.bPos || [0, 0];
      this.img = options.img;
      this.speed = options.speed || 0;
      this.width = options.width || 32;
      this.collision = options.collision || true; // 参与碰撞检测
      this.priority = 0; // 绘制优先级，先绘制的显示在下面
      this.dir = 'top'; // left right bottom
    }

    move() {
      if (this.speed === 0) {
        return false;
      }
    }

    update() {
      //
    }

    draw() {
      //
    }
  }

  /** 游戏窗体类 */
  class Win {
    constructor() {
      this.tickers = new Set();
      this.entity = {
        pre: new Set(),
        com: new set(),
        sub: new Set(),
        all: new Set(),
      };
    }
    /** 添加实体演员 */
    addEntity(entity) {
      if (entity.priority > 0) {
        this.entity.pre.add(entity);
      } else if (entity.priority < 0) {
        this.entity.sub.add(entity);
      }
      this.entity.com.add(entity);
    }
    /** 删除实体演员 */
    delEntity(entity) {
      if (this.entity.pre.has(entity)) {
        this.entity.pre.delete(entity);
      } else if (this.entity.sub.has(entity)) {
        this.entity.sub.delete(entity);
      } else if (this.entity.com.has(entity)) {
        this.entity.com.delete(entity);
      }
    }
    /** 获取所有entity */
    getAllEntity() {
      // this.entity.all = Array.from()
    }
    /** 添加计时器 */
    addTicker(ticker) {
      this.tickers.add(ticker);
    }
    /** 删除计时器 */
    delTicker(ticker) {
      this.tickers.delete(ticker);
    }
    /** 更新窗体 */
    update() {
      this.getAllEntity();
    }
  }
})();
