const regHTMLTag = /^<([a-z]+)>$/;

/** DOM 选择器  mini jquery */
export function $(select: string): HTMLElement | null | NodeList {
  if (/^#/.test(select)) {
    return document.getElementById(select.substring(1));
  }
  if (/^\./.test(select)) {
    return document.querySelectorAll(select);
  }
  if (regHTMLTag.test(select)) {
    const el = regHTMLTag.exec(select);
    return document.createElement(el![1]);
  }
  return document.querySelectorAll(select);
}

/**
 * 获得一个`canvas`和操作它的上下文对象
 * @param {Number} width canvas的宽度
 * @param {Number} height canvas的高度
 * @param {String} selecter id，如果给定则从页面选择canvas，否者生成一个离屏canvas
 * @return `canvas` 和操作它的上下文 `ctx`
 */
export function getCanvas(width: number, height: number, selecter?: string): CanvasCompose {
  const canvas = (selecter
    ? document.getElementById(selecter)
    : document.createElement('canvas')) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx };
}

/** 获取当前请求的路径 */
export function getLocationPath(): string {
  const index = window.location.href.lastIndexOf('/');
  return window.location.href.slice(0, index + 1);
}

/**
 * 计时系统，指定帧数之后执行回调
 * @param tick 计时周期
 * @param callBack 回调函数
 * @param perTick  每过多少个周期执行回调
 */
export function Ticker(tick: number): AnyFunction;
export function Ticker(tick: number, callBack: () => void, perTick: number): AnyFunction;
export function Ticker(tick: any, callback?: any, perTick?: any): AnyFunction {
  let cTick = 0;
  let cPTick = 0;
  return perTick === undefined
    ? (cb: AnyFunction): void => ++cTick >= tick && ((cTick = 0), cb())
    : (cb: AnyFunction) => {
        ++cPTick >= perTick && ((cPTick = 0), callback());
        ++cTick >= tick && ((cTick = 0), cb());
      };
}

/**
 *
 * @param {Direction} direction
 * @param {Direction} lastDirection
 * @returns {boolean}
 */
export function isOppositeDirection(direction: Direction, lastDirection: Direction): boolean {
  return Math.abs(direction - lastDirection) === 2;
}

/**
 * 获取两个实体之间的距离
 * @param {EntityRect} rect1
 * @param {EntityRect} rect2
 * @returns {Number}
 */
export function getDistance(rect1: EntityRect, rect2: EntityRect): number {
  const [x1, y1] = rect1;
  const [x2, y2] = rect2;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * 获取变量的实际类型
 * @param obj any
 */
export function getType(obj: any) {
  if (obj !== obj) {
    return 'NaN';
  }
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 获取坦克射击之后的子弹的位置
 */
export function getBulletPos(direction: Direction, x: number, y: number): EntityRect {
  ({
    0: () => (x += 12),
    1: () => ((x += 24), (y += 12)),
    2: () => ((x += 12), (y += 24)),
    3: () => (y += 12),
  }[direction]());
  return [x, y, 8, 8];
}

export default {};
