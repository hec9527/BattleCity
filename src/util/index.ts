const regHTMLTag = /^<([a-z]+)>/;

/** DOM 选择器  mini jquery */
export function $(select: string): HTMLElement | null | NodeList {
  if (/^#/.test(select)) {
    return document.getElementById(select.substring(1));
  } else if (/^\./.test(select)) {
    return document.querySelectorAll(select);
  } else if (regHTMLTag.test(select)) {
    const el = regHTMLTag.exec(select);
    return (el && el[1] && document.createElement(el[1])) || null;
  } else {
    return document.querySelectorAll(select);
  }
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
 * @param {Number} tick
 * @returns {Function}
 */
export function Ticker(tick = 30): AnyFunction {
  let cTick = 0;
  return (cb: AnyFunction): void => (cTick >= tick ? ((cTick = 0), cb()) : cTick++);
}

/**
 *
 * @param {Direction} direction
 * @param {Direction} lastDirection
 * @returns {boolean}
 */
export function isOppositeDirection(direction: Direction, lastDirection: Direction): boolean {
  return (
    (direction === 0 && lastDirection === 2) ||
    (direction === 1 && lastDirection === 3) ||
    (direction === 2 && lastDirection === 0) ||
    (direction === 3 && lastDirection === 1)
  );
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
