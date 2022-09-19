const regHTMLTag = /^<([a-z]+)>$/;

export function removeFromArr(list: any[], item: any): void {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === item) {
      list.slice(i, 1);
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
export function getCanvas(width: number, height: number, selector?: string): ICanvasCompose {
  const canvas = (selector ? document.getElementById(selector) : document.createElement('canvas')) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = width;
  canvas.height = height;
  return [canvas, ctx];
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

/** 判断两个实体是否碰撞 */
export function isEntityCollision(rect1: IEntityRect, rect2: IEntityRect): boolean {
  const [x1, y1, w1, h1] = rect1;
  const [x2, y2, w2, h2] = rect2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const res = -w2 < dx && dx < w1 && -h2 < dy && dy < h1;
  return res;
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
export function getRewardRect(): IEntityRect {
  const x = randomInt(0, 24) * 16;
  const y = randomInt(0, 24) * 16;
  const rect: IEntityRect = [x, y, 32, 32];
  if (isEntityCollision(rect, [192, 384, 32, 32])) {
    return getRewardRect();
  }
  return rect;
}

/** 确定派生类类型 */
export function isEnemyTank(entity: IEntity): entity is import('../entities/enemy-tank').default {
  return entity.type === 'enemyTank';
}
export function isAllyTank(entity: IEntity): entity is import('../entities/ally-tank').default {
  return entity.type === 'allyTank';
}
export function isBrick(entity: IEntity): entity is import('../entities/brick').default {
  return entity.type === 'brick';
}
export function isBullet(entity: IEntity): entity is import('../entities/bullet').default {
  return entity.type === 'bullet';
}
export function isReward(entity: IEntity): entity is import('../entities/reward').default {
  return entity.type === 'reward';
}
