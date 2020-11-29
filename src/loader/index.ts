/**
 * 资源加载类
 */

import Images from './images';
import Sounds from './sounds';

class Source {
  /** 资源是否已经加载完成 */
  private _isLoaded = false;

  constructor(callback: () => void) {
    let loaded = 0;
    const onload = () => {
      if (++loaded >= 2) {
        this._isLoaded = true;
        callback();
      }
    };

    new Images(onload);
    new Sounds(onload);
  }

  /** 是否已经加载完成 */
  public isLoaded(): boolean {
    return this._isLoaded;
  }
}

export default Source;
