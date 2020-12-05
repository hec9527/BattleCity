/**
 * 文件加载器  -- 图片
 * @author  hec9527
 */

import Printer from '../util/print';

/** 文件列表 */
const files = [
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

type Files = typeof files[number];

type CacheImg = { [K in Files]: HTMLImageElement };

type CacheSprite = { [x: string]: CanvasImageSource };

class Images {
  /** 缓存加载的图片 */
  public imgs: CacheImg = {} as CacheImg;

  /** 缓存切分的精灵图 */
  public sprite: CacheSprite = {};

  constructor(callback?: () => void) {
    const context = require.context('../assets/img/', false, /\.png/, 'sync');
    const loadImages = () => {
      return files.map(key => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onerror = () => reject(img);
          img.onload = () => resolve(img);
          img.src = context(`./${key}.png`).default;
          this.imgs[key] = img;
        });
      });
    };

    Promise.all(loadImages()).then(
      () => {
        Printer.info('图片资源加载完成');
        callback && callback();
      },
      rej => Printer.error(`图片资源加载失败: ${rej}`)
    );
  }
}

export default Images;
