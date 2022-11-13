/**
 * 资源加载器 -- 音频
 * @author  hec9527
 */

import Printer from '../util/print';

/** 音乐文件列表 */
import config from '../config';

const files = config.resource.audios;

const multiChannelList: Files[] = ['attack', 'hit', 'count', 'misc', 'pause'];

export type Files = typeof files[number];

export type CacheAudio = { [K in Files]: HTMLAudioElement[] };

export function loadAudio(): Promise<Sound> {
  const cache = {} as CacheAudio;

  const loadAudio = (str: Files) => {
    return new Promise<void>(resolve => {
      const audio = new Audio();
      audio.onerror = () => {
        resolve();
        Printer.error(`音频加载失败：${str}`);
      };
      audio.preload = 'auto';
      audio.oncanplaythrough = () => {
        resolve();
        cache[str] = [audio, ...(cache[str] || [])];
      };
      audio.src = `/audio/${str}.ogg`;

      // preload 在IOS中被禁止，可以先静音播放，让音频加载进来，然后立马暂停并且解除静音
      audio.muted = true;
      audio.play();
      audio.pause();
      audio.muted = false;
    });
  };

  const mapAudio = () => {
    const arr = [...files];
    files.forEach(file => {
      if (multiChannelList.includes(file)) {
        arr.push(file);
        arr.push(file);
      }
    });
    return arr.map(loadAudio);
  };

  return Promise.all(mapAudio()).then(() => {
    Printer.info('音频加载完成', cache);
    return new Sound(cache);
  });
}

export class Sound {
  private playingList: Set<HTMLAudioElement> = new Set();

  constructor(private sounds: CacheAudio) {}

  private _play(audio: HTMLAudioElement) {
    audio.volume = 0.8;
    audio.play();
    audio.onended = () => this.playingList.delete(audio);
  }

  /**
   *  注意： 谨慎使用多声道，可能会造成性能问题
   */
  public play(file: Files, /** 多声道播放 */ multichannel = true): void {
    if (!files.includes(file)) throw new Error(`未注册的音频文件: ${file}`);
    if (!multichannel) {
      const audio = this.sounds[file][0];
      this.playingList.add(audio);
      this._play(audio);
    } else {
      const audios = this.sounds[file];
      for (let i = 0; i < audios.length; i++) {
        if (!this.playingList.has(audios[i])) {
          this.playingList.add(audios[i]);
          this._play(audios[i]);
        }
      }
    }
  }
}
