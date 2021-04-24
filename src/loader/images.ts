/**
 * 文件加载器  -- 图片
 * @author  hec9527
 */

import Printer from '@/util/print';

/** 文件列表  */
const files = ['bonus', 'brick', 'enemyTank', 'explode', 'getScore', 'getScoreDouble', 'myTank', 'tool', 'UI'] as const;

type Files = typeof files[number];

export type CacheImg = { [K in Files]: HTMLImageElement };

export function loadImages(): Promise<CacheImg> {
  const context = require.context('../assets/img/', false, /\.png/, 'sync');
  const cache = {} as CacheImg;

  return new Promise<CacheImg>((resolve, reject) => {
    Promise.all([
      ...files.map(key => {
        return new Promise<void>((res, rej) => {
          const url = context(`./${key}.png`).default;
          const img = new Image();
          img.onload = () => res();
          img.onerror = () => {
            Printer.error('图片加载失败：' + url);
            rej();
          };
          img.src = url;
          cache[key] = img;
        });
      }),
    ]).then(() => {
      Printer.info('图片资源加载完成');
      resolve(cache);
    }, reject);
  });
}

export default loadImages;
