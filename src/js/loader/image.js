const GAME_ASSETS_IMAGE = new Images();

/**
 * 图片加载
 */
function Images() {
  let isLoad = false;
  const Imgs = [];
  const sprite = {};
  const path = (fName) => `./img/${fName}.png`;
  // 修改图片顺序可能会导致精灵图获取出现问题
  const list = [
    'bonus',
    'brick',
    'enemyTank',
    'explode',
    'getScore',
    'getScoreDouble',
    'myTank',
    'tool',
    'UI',
  ];
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
        const { canvas, ctx } = getCanvas(32, 32);
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
      const { canvas, ctx } = getCanvas(32, 32);
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
        const { canvas, ctx } = getCanvas(w, h);
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
