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
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
      a: 'g', // single g
      b: 'h', // double h
      start: 'b', // start
    },
    p2: {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      a: 'k', // single
      b: 'l', // double
    },
  };
  const GAME_ARGS_CONFIG = {
    RANK: 1, // 当前关卡
    MAPEDIT: false, // 自定义地图
    PLAYERNUM: 1, // 玩家数量
    HISTORY: [], // 历史最高
    PLAYERS: [{ life: 3, tank: null }],
  };
  const TANK_ALLY_OPTION = {
    speed: 2,
    isDeputy: false,
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

  /** 边界碰撞检测 是否碰撞边界
   * @param rect {rect} */
  function isCollisionBorder(rect) {
    const [x, y, w, h] = rect;
    return x < 0 || x > 416 - w || y < 0 || y > 416 - h;
  }

  /** 获取矩形的 中心位置 */
  function getRectCenter(rect, dir) {
    const [x, y, w, h] = rect;
    return [x + w / 2, y + h / 2];
  }

  /** 移动
   * @param rect {rect}
   * @param dir
   * @param speeddd
   * */
  function move(rect, dir, speed) {
    let [x, y, w, h] = rect;
    const dirs = {
      0: () => (y -= speed),
      1: () => (x += speed),
      2: () => (y += speed),
      3: () => (x -= speed),
    };
    dirs[dir]();
    return [x, y, w, h];
  }

  /** 倒计时 */
  function CountDown(count = 0) {
    this.update = () => count > 0 && --count;
    this.isCount = () => count > 0;
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
      if ((isPasued && e.key === GAME_CONFIG_KEYS.p1.start) || !isPasued) {
        pressed.add(e.key);
      }
    });

    window.addEventListener('keyup', (e) => {
      pressed.delete(e.key);
      blocked.delete(e.key);
    });

    /** 是否已经按下某个按键 , 非连续响应 */
    this.isTapKey = function (key) {
      if (pressed.has(key) && !blocked.has(key)) {
        blocked.add(key);
        return true;
      }
      return false;
    };

    /** 是否已经按下某个按键， 可以快速连续响应 */
    this.isPressedKey = function (key) {
      return !blocked.has(key) && pressed.has(key);
    };

    /** 是否按下某个按键 */
    this.isKeyDown = function (key) {
      if (!blocked.has(key) && pressed.has(key)) {
        blocked.add(key);
        setTimeout(() => blocked.delete(key), blockTicks);
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
      this.word = options.word;
      this.canvas = canvas;
      this.ctx = ctx;
      this.rect = options.rect; // 实体位置，大小
      this.img = options.img; // 实体贴图
      this.camp = options.camp || 0; // -1 敌人   1 友军  0 中立
      this.collision = options.collision || 1; // 参与碰撞检测
      this.priority = 0; // 绘制优先级 1 先绘制，在下面

      this.word.addEntity(this);
    }

    draw() {
      this.ctx.drawImage(this.img, this.rect[0] + 35, this.rect[1] + 20);
    }

    die() {
      this.word.delEntity(this);
    }
  }

  /**
   * 碰撞检测： 边界、坦克、奖励、砖块
   * 我方坦克贴图[level][dir][status]
   * 敌方坦克贴图[普通/奖励][方向][形态]
   */
  class Tank extends Entity {
    constructor(props) {
      super(props);
      this.dir = 0; // 0上   1右   2下    3左
      this.speed = props.speed || 1; // 移动速度
      this.bullet = new Set();
      this.bulletNum = 1; // 默认坦克子弹数量为1
      this.level = props.level || 1; // 坦克等级
      this.life = 1; // 生命
      this.status = 0; // 状态
      this.tickStatus = 0; // 状态计时
      this.tickShoot = 0; // 射击间隔
      this.isProtected = false; // 保护罩
    }

    changeImg() {
      return (this.img = this.imgList[this.level][this.dir][this.status]);
    }

    move(entityLis) {
      const rect = move(this.rect, this.dir, this.speed);

      ++this.tickStatus;
      if (this.tickStatus > 5) {
        this.tickStatus = 0;
        this.status = this.status === 0 ? 1 : 0;
        this.changeImg();
      }

      // 边界
      if (!isCollisionBorder(rect)) {
        entityLis.forEach((entity) => {
          if (entity.collision === 0) {
            // 我方坦克 获得 奖励
            if (this.camp === 1 && entity instanceof Reward) {
              // TODO 处理  坦克-奖励  碰撞
            }
          } else {
            // 坦克-坦克 碰撞检测
            if (entity instanceof Tank) {
              //
              // 坦克-砖块 碰撞检测
            } else if (entity instanceof Brick) {
              //
            }
          }
        });
        this.rect = [...rect];
      } else if (this instanceof TankEnemy) {
        this.changeDir();
      }
    }

    shoot() {
      if (this.tickShoot <= 0 && this.bullet.size < this.bulletNum) {
        const [x, y] = this.rect;
        const dirs = {
          0: [x + 12, y],
          1: [x + 24, y + 12],
          2: [x + 12, y + 24],
          3: [x, y + 12],
        };
        const rect = [...dirs[this.dir], 8, 8];
        this.bullet.add(new Bullet({ dir: this.dir, camp: this.camp, rect, word: this.word, tank: this }));
        this.tickShoot = 10;
        this instanceof TankAlly && GAME_ASSETS_SOUND.play('attack');
      }
    }
  }

  /** 我方坦克类 */
  class TankAlly extends Tank {
    constructor(tank, props) {
      super(props);
      this.inherit(tank); // 部分数据继承上一关卡
      this.rect = [props.isDeputy ? 256 : 128, 384, 32, 32];
      this.camp = 1;
      this.isDeputy = props.isDeputy;
      this.imgList = props.isDeputy ? GAME_ASSETS_IMAGE.getPlayerTwoTank() : GAME_ASSETS_IMAGE.getPlayerOneTank();
      this.img = this.changeImg();
    }

    // 新的关卡继承上一关卡的坦克数据
    inherit(tank) {
      console.log('inherit:', tank);
      for (let key in tank) {
        this[key] = tank[key];
      }
    }

    changeDir(dir) {
      this.dir = dir;
      // 上下
      if (this.dir % 2) {
        this.rect[1] = (this.rect[1] / 16) * 16;
      } else {
        this.rect[0] = (this.rect[0] / 16) * 16;
      }
      this.changeImg();
    }

    update(lis) {
      this.tickShoot > 0 && --this.tickShoot;
      const PL = this.isDeputy ? GAME_CONFIG_KEYS.p2 : GAME_CONFIG_KEYS.p1;
      if (GAME_LONG_KEYBORAD.isPressedKey(PL.up)) {
        if (this.dir !== 0) {
          this.changeDir(0);
        } else {
          this.move(lis);
        }
      } else if (GAME_LONG_KEYBORAD.isPressedKey(PL.right)) {
        if (this.dir !== 1) {
          this.changeDir(1);
        } else {
          this.move(lis);
        }
      } else if (GAME_LONG_KEYBORAD.isPressedKey(PL.down)) {
        if (this.dir !== 2) {
          this.changeDir(2);
        } else {
          this.move(lis);
        }
      } else if (GAME_LONG_KEYBORAD.isPressedKey(PL.left)) {
        if (this.dir !== 3) {
          this.changeDir(3);
        } else {
          this.move(lis);
        }
      }

      if (GAME_LONG_KEYBORAD.isTapKey(PL.a) || GAME_LONG_KEYBORAD.isPressedKey(PL.b)) {
        this.shoot();
      }
    }
  }

  /**
   * 敌方坦克类
   * 贴图索引  [奖励/普通][dir][status]
   */
  class TankEnemy extends Tank {
    constructor(props) {
      super(props);
      this.birthIndex = props.birthIndex | 0 || 0;
      this.rect = [this.birthIndex === 0 ? 0 : this.birthIndex === 1 ? 192 : 384, 0, 32, 32];
      this.dir = 2;
      this.camp = 1;
      this.type = props.type | 0 || 0; // 0 弱、1 基础、 2 快速、 3巨型  巨型坦克有3种不带奖励的
      this.life = props.type === 3 ? (Math.random() * 4) | 0 : 1;
      this.reward = this.getRandomReward();
      this.imgList = this.getImageList();
      this.img = this.changeImg();
      this.speed = this.getSpeed();
    }

    changeDir() {
      let [x, y, w, h] = this.rect;

      this.dir = (Math.random() * 4) | 0;

      if (this.dir % 2 === 0) {
        y = ((y / 8) | 0) * 8;
      } else {
        x = ((x / 8) | 0) * 8;
      }

      this.rect = [x, y, w, h];
      this.changeImg();
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
      return this.type === 3 ? 0.8 : this.type === 2 ? 2.5 : 1.5;
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
      this.shoot();
      this.move(entityLis);
    }
  }

  /** 子弹类 */
  class Bullet extends Entity {
    constructor(props) {
      super(props);
      this.dir = props.dir;
      this.rect = props.rect;
      this.camp = props.camp;
      this.tank = props.tank;
      this.speed = props.speed || 4;
      this.img = GAME_ASSETS_IMAGE.getBullet()[this.dir];
    }

    update() {
      const rect = move(this.rect, this.dir, this.speed);
      // TODO 碰撞检测
      if (isCollisionBorder(rect)) {
        this.die();
      }
      this.rect = [...rect];
    }

    getExplosePos() {
      const [x, y, w, h] = this.rect;
      const dirs = {
        0: [x + w / 2, y],
        1: [x + w, y + h / 2],
        2: [x + w / 2, y + h],
        3: [x, y + h / 2],
      };
      return dirs[this.dir];
    }

    die() {
      this.tank.bullet.delete(this);
      super.die();
      new Explode({ pos: this.getExplosePos(), word: this.word });
    }
  }

  /** 爆炸类 */
  class Explode extends Entity {
    constructor(props) {
      super(props);
      const [x, y] = props.pos;
      const width = props.isBullet ? 32 : 64;
      this.isBullet = props.isBullet || true;
      this.rect = [x - width / 2 + 35, y - width / 2 + 20, width, width];
      this.imgList = GAME_ASSETS_IMAGE.getExplodeAnima();
      this.imgIndex = 0;
      this.tick = 0;
      this.priority = 0;
    }

    update() {
      if (++this.tick % 2 == 0) {
        if (this.isBullet && ++this.imgIndex > 2) {
          this.imgIndex = 0;
        }
      }
      if (this.tick > 5) {
        this.die();
      }
    }

    draw() {
      this.ctx.drawImage(this.imgList[this.imgIndex], ...this.rect);
    }
  }

  /** 奖励类 */
  class Reward extends Entity {
    constructor(props) {
      super(props);
    }
  }

  /** 砖块类 */
  class Brick extends Entity {
    constructor(props) {
      super(props);
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
      this.entity.pre.forEach((entity) => set.add(entity));
      this.entity.sub.forEach((entity) => set.add(entity));
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
      window.requestAnimationFrame(() => !this.isOver && this.anima());
      // setTimeout(() => !this.isOver && this.anima(), 50);
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
      if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.up)) {
        this.cPosIndex = this.cPosIndex <= 0 ? 2 : this.cPosIndex - 1;
      } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.down)) {
        this.cPosIndex = this.cPosIndex >= 2 ? 0 : this.cPosIndex + 1;
      } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.start)) {
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
      this.flagTick = new Tickers(15);
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
      if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.up)) {
        GAME_ARGS_CONFIG.RANK++;
      } else if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.down)) {
        --GAME_ARGS_CONFIG.RANK < 1 && GAME_ARGS_CONFIG.RANK++;
      }
      if (GAME_LONG_KEYBORAD.isKeyDown(GAME_CONFIG_KEYS.p1.start)) {
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
      if (GAME_ARGS_CONFIG.PLAYERS[0].life > 0 || GAME_ARGS_CONFIG.PLAYERS[0].tank) {
        this.generateAllyTank(GAME_ARGS_CONFIG.PLAYERS[0].tank);
      }
      if (GAME_ARGS_CONFIG.PLAYERNUM >= 2 && (GAME_ARGS_CONFIG.PLAYERS[1].life > 0 || GAME_ARGS_CONFIG.PLAYERS[1].tank)) {
        this.generateAllyTank(GAME_ARGS_CONFIG.PLAYERS[1].tank, true);
      }
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
      new TankEnemy({ word: this, birthIndex: Math.random() * 3, type: Math.random() * 4 });
    }

    generateAllyTank(inheritTank = {}, isDeputy = false) {
      const tank = new TankAlly(inheritTank, { ...TANK_ALLY_OPTION, isDeputy, word: this });
      console.log(tank);
      this.addEntity(tank);
      this.background = this.getBackground();
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
      if (this.enemyTnakRemain > 0 && this.enemyTnakAlive < 5 && (!this.enemyBirthTick || !this.enemyBirthTick.isCount())) {
        Printer.info('生成敌方坦克');
        this.generateEnemyTank();
        this.enemyBirthTick = new CountDown(100);
      }

      // 判断是否 需要生成我方坦克
      if (!GAME_ARGS_CONFIG.PLAYERS[0].tank && GAME_ARGS_CONFIG.PLAYERS[0].life > 0) {
        // 生成我方坦克1
      }
      if (GAME_ARGS_CONFIG.PLAYERNUM === 2 && !GAME_ARGS_CONFIG.PLAYERS[1].tank && GAME_ARGS_CONFIG.PLAYERS[1].life > 0) {
        // 生成我方坦克2
      }

      // 更新演员
      const entityList = this.getAllEntity();
      entityList.forEach((entity) => entity.update(entityList));
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
      GAME_CURRENT_WINDOW = new WinStart();
      // GAME_CURRENT_WINDOW = new WinMapEdit();
      // GAME_CURRENT_WINDOW = new WinRankPick();
      // GAME_CURRENT_WINDOW = new WinBattle();
      fixMap(true);
      // Printer.copyright();
    }, 10);
  })();

  setTimeout(() => {
    // const { canvas, ctx } = new Tool().getCanvas(516, 456, 'canvas');
    // ctx.fillStyle = '#e3e3e3';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // let img = GAME_ASSETS_IMAGE.getExplodeAnima();
    // console.log(img);
    // // [类型][普通/带奖励][方向][形态]   类型=3 奖励0-3
    // // img = img[3][0][3];
    // // console.log(img);
    // // ctx.drawImage(img[1][0][0], 150, 150);
    // for (let i = 0; i < img.length; i++) {
    //   ctx.drawImage(img[i], 50 + 32 * (i - 0), 160);
    // }
    // // ctx.drawImage(img[0], 0, 0);
  }, 200);
})();
