/**
 * 文件加载器  -- 图片
 * @author  hec9527
 */

import Printer from '../util/print';

/** 文件列表 */
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
] as const;

type Files = typeof list[number];

type CacheImg = { [K in Files]?: HTMLImageElement };

type CacheSprite = { [x: string]: CanvasImageSource };

class Images {
  /** 缓存加载的图片 */
  private _imgs: CacheImg = {};

  /** 缓存切分的精灵图 */
  private _sprite: CacheSprite = {};

  private composePath(file: string): string {
    return `@src/assets/img/${file}.png`;
  }

  constructor(callback?: () => void) {
    Promise.all(this.loadImages()).then(
      () => {
        Printer.info('资源加载完成');
        callback && callback();
      },
      rej => Printer.error(`资源加载失败: ${rej}`)
    );
  }

  private loadImages() {
    return list.map(
      key =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onerror = () => reject(img);
          img.onload = () => resolve(img);
          img.src = this.composePath(key);
          this._imgs[key] = img;
        })
    );
  }
}

export default Images;
