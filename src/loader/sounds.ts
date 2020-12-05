/**
 * 资源加载器 -- 音频
 * @author  hec9527
 */

import Printer from '../util/print';

/** 音乐文件列表 */
const files = [
  'attack',
  'attackOver',
  'bomb',
  'count',
  'eat',
  'life',
  'misc',
  'move',
  'over',
  'pause',
  'start',
] as const;

type Files = typeof files[number];

type CacheSound = { [K in Files]: HTMLAudioElement };

class Sound {
  /** 背景音乐播放器 */
  private sounds: CacheSound = {} as CacheSound;

  constructor(callback?: () => void) {
    const context = require.context('../assets/audio/', false, /\.mp3/, 'sync');
    const loadAudio = () => {
      return files.map(key => {
        return new Promise((resolve, reject) => {
          const audio = new Audio();
          audio.oncanplay = () => resolve(key);
          audio.onerror = () => reject(audio);
          audio.src = context(`./${key}.mp3`).default;
          this.sounds[key] = audio;
        });
      });
    };

    Promise.all(loadAudio()).then(
      () => {
        Printer.info('音频资源加载完成');
        callback && callback();
      },
      rej => Printer.error(`音频资源加载失败: ${rej}`)
    );
  }

  /**
   *  谨慎使用多声道，可能会造成性能问题
   */
  public play(file: Files, /** 多声道播放 */ multichannel = true): void | never {
    if (!files.includes(file)) throw new Error(`未注册的音频文件: ${file}`);
    if (!multichannel) {
      this.sounds[file].play();
    } else {
      const audio = new Audio();
      audio.oncanplay = () => audio.play();
      audio.src = this.sounds[file].src;
    }
  }
}

export default Sound;
