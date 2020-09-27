const regHTMLTag = /^\<([a-z]+)\>/;

/** DOM 选择器  mini jquery */
export function $(select: string) {
  if (/^\#/.test(select)) {
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

/** 从页面获取canvas或者直接生成canvas */
export function getCanvas(width: number, height: number, selecter: string) {
  const canvas = (selecter ? document.getElementById(selecter) : document.createElement('canvas')) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx };
}

/** 获取当前请求的路径 */
export function getLocationPath() {
  const index = window.location.href.lastIndexOf('/');
  return window.location.href.slice(0, index + 1);
}
