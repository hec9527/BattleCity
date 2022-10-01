const regHTMLTag = /^<([a-z]+)>$/;

export function removeFromArr(list: any[], item: any): void {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === item) {
      list.splice(i, 1);
      return;
    }
  }
}

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
 * @param {String} selector id，如果给定则从页面选择canvas，否者生成一个离屏canvas
 * @return {{canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D}}
 */
export function getCanvas(width: number, height: number, selector?: string) {
  const canvas = (selector ? document.getElementById(selector) : document.createElement('canvas')) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = width;
  canvas.height = height;
  return [canvas, ctx] as const;
}

/**
 * 判断两个方向是否相反
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
export function getType(obj: unknown): 'Number' | 'String' | 'Object' | 'NaN' | 'Symbol' | 'Boolean' {
  if (obj !== obj) {
    return 'NaN';
  }
  return Object.prototype.toString.call(obj).slice(8, -1) as any;
}

/**
 *
 * @returns [t, r, b, l]
 */
export function getBoundingRect(rect: IEntityRect) {
  const [x, y, w, h] = rect;
  return [y, x + w - 1, y + h - 1, x];
}

/** 判断两个实体是否碰撞 */
export function isEntityCollision(rect1: IEntityRect, rect2: IEntityRect): boolean {
  const [x1, y1, w1, h1] = rect1;
  const [x2, y2, w2, h2] = rect2;

  const dx = x1 - x2;
  const dy = y1 - y2;

  return -w1 < dx && dx < w2 && -h1 < dy && dy < h2;
}

/** 获取指定范围类的随机数 [min, max] */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 将一个数分成多个数的和  ---->   类似于红包算法 */
export function dispense(value: number, size = 20): Array<number> {
  const lis: Array<number> = [];

  for (let i = 0; i < size; i++) {
    const r = size - i; // 剩余个数
    if (r <= 1) {
      lis.push(value);
    } else {
      const min = 1;
      const max = (value / r) * 2;
      const _value = randomInt(min, max - 1);
      lis.push(_value);
      value -= _value;
    }
  }
  return lis;
}

/** 获取奖励生成位置 */
export function getAwardRect(): IEntityRect {
  const x = randomInt(0, 24) * 16;
  const y = randomInt(0, 24) * 16;
  const rect: IEntityRect = [x, y, 32, 32];
  if (isEntityCollision(rect, [192, 384, 32, 32])) {
    return getAwardRect();
  }
  return rect;
}
