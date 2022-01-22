/**
 * 资源加载器 -- 音频
 * @author  hec9527
 */

import Printer from '../util/print';

/** 音乐文件列表 */
import config from '../config/const';

const files = config.resource.audios;

export type Files = typeof files[number];

export type CacheAudio = { [K in Files]: HTMLAudioElement };

export function loadAudio(): Promise<Sound> {
  const cache = {} as CacheAudio;

  const loadAudio = (str: Files) => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.onerror = reject;
      audio.oncanplaythrough = () => {
        resolve();
        cache[str] = audio;
      };
      audio.src = `/src/assets/audio/${str}.mp3`;
    });
  };

  return Promise.all(files.map(loadAudio)).then(() => {
    Printer.info('音频加载完成', cache);
    return new Sound(cache);
  });
}

export class Sound {
  private playingList: Set<Files> = new Set();

  constructor(private sounds: CacheAudio) {}

  private _play(file: Files) {
    this.sounds[file].play();
    this.sounds[file].onended = () => this.playingList.delete(file);
  }

  /**
   *  注意： 谨慎使用多声道，可能会造成性能问题
   */
  public play(file: Files, /** 多声道播放 */ multichannel = true): void {
    if (!files.includes(file)) throw new Error(`未注册的音频文件: ${file}`);
    if (this.playingList.has(file)) return;

    if (!multichannel) {
      this.playingList.add(file);
    }
    this._play(file);
  }
}
