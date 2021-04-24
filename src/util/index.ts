/* eslint-disable @typescript-eslint/no-explicit-any */
const regHTMLTag = /^<([a-z]+)>$/;

/** DOM 选择器  mini query */
export function $(select: string): HTMLElement | null | NodeList {
  if (/^#/.test(select)) {
    return document.getElementById(select.substring(1));
  }
  if (/^\./.test(select)) {
    return document.querySelectorAll(select);
  }
  if (regHTMLTag.test(select)) {
    const el = regHTMLTag.exec(select) as RegExpExecArray;
    return document.createElement(el[1]);
  }
  return document.querySelectorAll(select);
}

/**
 * 获得一个`canvas`和操作它的上下文对象
 * @param {Number} width canvas的宽度
 * @param {Number} height canvas的高度
 * @param {String} selecter id，如果给定则从页面选择canvas，否者生成一个离屏canvas
 * @return {{canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D}}
 */
export function getCanvas(width: number, height: number, selecter?: string): ICanvasCompose {
  const canvas = (selecter ? document.getElementById(selecter) : document.createElement('canvas')) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx };
}

/**
 *
 * @param {IDirection} direction
 * @param {IDirection} lastDirection
 * @returns {boolean}
 */
export function isOppositeDirection(direction: IDirection, lastDirection: IDirection): boolean {
  return Math.abs(direction - lastDirection) === 2;
}

/**
 * 获取两个实体之间的距离
 * @param {IEntityRect} rect1
 * @param {IEntityRect} rect2
 * @returns {Number}
 */
export function getDistance(rect1: IEntityRect, rect2: IEntityRect): number {
  const [x1, y1] = rect1;
  const [x2, y2] = rect2;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * 获取变量的实际类型
 * @param obj any
 */
export function getType(obj: any): 'Number' | 'String' | 'Object' | 'NaN' | 'Symbol' | 'Boolean' {
  if (obj !== obj) {
    return 'NaN';
  }
  return Object.prototype.toString.call(obj).slice(8, -1) as any;
}

/**
 * 获取坦克射击之后的子弹的位置
 */
export function getBulletPos(direction: IDirection, x: number, y: number): IEntityRect {
  ({
    0: () => (x += 12),
    1: () => ((x += 24), (y += 12)),
    2: () => ((x += 12), (y += 24)),
    3: () => (y += 12),
  }[direction]());
  return [x, y, 8, 8];
}

/**
 * 获取指定范围类的随机数 [min, max)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
