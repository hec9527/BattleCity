/**
 * 边界碰撞检测 是否碰撞边界
 * @param rect {rect}
 */
function isCollisionBorder(rect) {
  const [x, y, w, h] = rect;
  return x < 0 || x > 416 - w || y < 0 || y > 416 - h;
}

/**
 * 实体碰撞检测， 不限实体的宽高
 */
function isCollisionEntity(rect1, rect2) {
  const [x1, y1, w1, h1] = rect1;
  const [x2, y2, w2, h2] = rect2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return -w2 < dx && dx < w1 && -h2 < dy && dy < h1;
}

/**
 * 获取两个实体的位置距离
 */
function getDistance(rect1, rect2) {
  const [x1, y1] = rect1;
  const [x2, y2] = rect2;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
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

/**
 * 倒计时
 */
function CountDown(count = 0) {
  this.update = () => count > 0 && --count;
  this.isCount = () => count > 0;
}

/**
 * 计时器  按帧计数  切换属性
 */
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

/**
 * Tool
 * 工具类
 */
function Tool() {
  let cacheElement = {}; // 缓存DOM中 canvas元素
  /** 获取当前路径 */
  this.getPwd = function () {
    const index = window.location.href.lastIndexOf('/');
    return window.location.href.slice(0, index + 1);
  };
}

/**
 * 获取canvas
 */
function getCanvas(w, h, c) {
  const canvas = c ? document.getElementById(c) : document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h === undefined ? w : h;
  return { canvas, ctx };
}

/**
 * 自定义地图可能会导致Boss和玩家坦克、地方坦克被放置砖块
 * 需要修复它们
 */
function fixMap(fixFence = false) {
  const MAP = GAME_LONG_MAPDATA[0];
  MAP[0][0] = 0;
  MAP[0][6] = 0;
  MAP[0][12] = 0;
  // MAP[11][5] = 18;
  // MAP[11][6] = 4;
  // MAP[11][7] = 17;
  MAP[12][4] = 0;
  // MAP[12][5] = 3;
  MAP[12][6] = 15; // Boss 标志
  // MAP[12][7] = 5;
  MAP[12][8] = 0;
  console.log('fixmap --> ', MAP);
}
