/**
 * 资源加载类
 */

import Images from './images';
import Sounds from './sounds';

// webpack API 资源加载测试
// const files = require.context('../assets/img/', false, /\.png/, 'sync');

// console.log(files.keys());

// const models = files.keys().map(key => {
//   return files(key).default;
// });

// document.body.style.background = `url(${models[8]})`;
// document.body.style.backgroundRepeat = 'no-repeat';

class Source {
  private static instance?: Source;

  /** 资源是否已经加载完成 */
  private _isLoaded = false;
  public IMAGES: Images;
  public SOUNDS: Sounds;

  private constructor(callback?: () => void) {
    let loaded = 0;
    const onload = () => {
      if (++loaded >= 2) {
        this._isLoaded = true;
        callback && callback();
      }
    };

    this.IMAGES = new Images(onload);
    this.SOUNDS = new Sounds(onload);
  }

  /** 是否已经加载完成 */
  public isLoaded(): boolean {
    return this._isLoaded;
  }

  public static getSource(callback?: AnyFunction) {
    if (!Source.instance) {
      Source.instance = new Source(callback);
    }
    return Source.instance;
  }
}

export default Source;
