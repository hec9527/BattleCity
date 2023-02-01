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
