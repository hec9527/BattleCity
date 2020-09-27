/**
 * 资源加载类
 */

import Images from './images';
import Sounds from './sounds';

class Source {
  /** 资源是否已经加载完成 */
  private _isLoaded = false;

  constructor(callback?: Function) {
    new Promise((resolve) => {
      let loaded = 0;
      const onload = () => {
        if (++loaded >= 2) {
          callback && callback();
          resolve();
          this._isLoaded = true;
        }
      };

      new Images(onload);
      new Sounds(onload);
    });
  }

  /** 是否已经加载完成 */
  isLoaded() {
    return this._isLoaded;
  }
}

export default Source;
