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

export type CacheSound = { [K in Files]: HTMLAudioElement };

export function loadAudio(): Promise<CacheSound> {
  // const context = require.context('../assets/audio/', false, /\.mp3/, 'sync');
  const context = import.meta.globEager('./assets/audio/**.mp3');
  const sounds: CacheSound = {} as CacheSound;

  return new Promise<CacheSound>((resolve, reject) => {
    Promise.all([
      ...files.map(key => {
        return new Promise((res, rej) => {
          const audio = new Audio();
          audio.oncanplay = res;
          audio.onerror = rej;
          // audio.src = context(`./${key}.mp3`).default;
          sounds[key] = audio;
        });
      }),
    ]).then(
      () => {
        Printer.info('音频资源加载完成');
        Sound.getInstance(sounds);
        resolve(sounds);
      },
      rej => {
        Printer.error(`音频资源加载失败: ${rej}`);
        reject();
      },
    );
  });
}

export class Sound {
  private static instance: Sound;

  private constructor(private sounds: CacheSound) {}

  public static getInstance(sounds?: CacheSound): Sound {
    if (!Sound.instance && sounds) {
      Sound.instance = new Sound(sounds);
    }
    return Sound.instance;
  }

  /**
   *  谨慎使用多声道，可能会造成性能问题
   */
  public play(file: Files, /** 多声道播放 */ multichannel = true): void {
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
