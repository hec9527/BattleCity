/**
 * 文件加载器  -- 图片
 * @author  hec9527
 */

import Printer from '../util/print';

/** 文件列表  */
const files = ['bonus', 'brick', 'enemyTank', 'explode', 'getScore', 'getScoreDouble', 'myTank', 'tool', 'UI'] as const;

export type Files = typeof files[number];

export type CacheImg = { [K in Files]: HTMLImageElement };

export async function loadImages(): Promise<CacheImg> {
  const cache = {} as CacheImg;

  const loadImage = (str: Files) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        resolve();
        cache[str] = img;
      };
      img.src = `/src/assets/img/${str}.png`;
    });
  };

  return Promise.all(files.map(loadImage)).then(() => {
    Printer.info('图片加载完成', cache);
    return cache;
  });
}

export default loadImages;
