/**
 * 资源加载类
 */

import Print from '../util/print';
import Images from './images';
import Sounds from './sounds';

class Source {
  private static instance?: Source;

  /** 资源是否已经加载完成 */
  private _isLoaded = false;
  public IMAGES: Images;
  public SOUNDS: Sounds;

  private constructor(callback?: (source: Source) => void) {
    let loaded = 0;
    const onload = () => {
      if (++loaded >= 2) {
        this._isLoaded = true;
        callback && callback(this);
      }
    };

    this.IMAGES = new Images(onload);
    this.SOUNDS = new Sounds(onload);
  }

  /** 是否已经加载完成 */
  public isLoaded(): boolean {
    return this._isLoaded;
  }

  public static getSource(callback?: (source: Source) => void) {
    if (!Source.instance) {
      Source.instance = new Source(callback);
    } else {
      callback?.(Source.instance);
    }
    return Source.instance;
  }
}

Source.getSource(() => Print.info('资源加载完毕'));

export default Source;
