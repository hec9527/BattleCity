/**
 * 文件加载器  -- 图片
 * @author  hec9527
 */

import Printer from '../util/print';

type files = 'bonus' | 'brick' | 'enemyTank' | 'explode' | 'getScore' | 'getScoreDouble' | 'myTank' | 'tool' | 'UI';

type CacheImg = { [k in files]?: HTMLImageElement } & AnyHTMLImageElementMap;

interface AnyHTMLImageElementMap {
  [x: string]: HTMLImageElement;
}

interface CacheSprite {
  //
  //
}

class Images {
  /** 文件列表 */
  private list = ['bonus', 'brick', 'enemyTank', 'explode', 'getScore', 'getScoreDouble', 'myTank', 'tool', 'UI'];

  /** 缓存加载的图片 */
  private _imgs: CacheImg = {};

  /** 缓存切分的精灵图 */
  private _sprite: CacheSprite = {};

  private composePath(file: string): string {
    return `../../assets/img/${file}.png`;
  }

  constructor(callback?: Function) {
    const loadImages = () =>
      this.list.map(
        (key: string) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onerror = () => reject(img);
            img.onload = () => resolve(img);
            img.src = this.composePath(key);
            this._imgs[key] = img;
          })
      );

    Promise.all(loadImages()).then(
      () => {
        Printer.info('资源加载完成');
        callback && callback();
      },
      (rej) => Printer.error(`资源加载失败: ${rej}`)
    );
  }
}

export default Images;
