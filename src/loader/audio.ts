/**
 * 资源加载器 -- 音频
 * @author  hec9527
 */

import Printer from '../util/print';

/** 音乐文件列表 */
import config from '../config';

const files = config.resource.audios;

const multiChannelList: Files[] = ['attack', 'attackOver', 'count', 'misc', 'pause'];

export type Files = typeof files[number];

export type CacheAudio = { [K in Files]: [HTMLAudioElement] };

export function loadAudio(): Promise<Sound> {
  const cache = {} as CacheAudio;

  const loadAudio = (str: Files) => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.onerror = reject;
      audio.oncanplaythrough = () => {
        resolve();
        cache[str] = [audio];
        if (multiChannelList.includes(str)) {
          const audio1 = audio.cloneNode() as HTMLAudioElement;
          const audio2 = audio.cloneNode() as HTMLAudioElement;
          const audio3 = audio.cloneNode() as HTMLAudioElement;
          cache[str].push(audio1, audio2, audio3);
        }
      };
      audio.src = `/audio/${str}.mp3`;
    });
  };

  return Promise.all(files.map(loadAudio)).then(() => {
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
