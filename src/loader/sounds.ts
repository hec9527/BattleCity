/**
 * 资源加载器 -- 音频
 * @author  hec9527
 */

import Printer from '../util/print';

/** 音乐文件列表 */
const list = [
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

type Files = typeof list[number];

type Player = { [K in Files]?: HTMLAudioElement };

class Sound {
  /** 背景音乐播放器 */
  private player: Player = {};

  private composePath(file: string): string {
    return `@/assets/audio/${file}.mp3`;
  }

  constructor(callback?: () => void) {
    Promise.all(this.loadAudio()).then(
      () => {
        Printer.info('资源加载完成');
        callback && callback();
      },
      rej => Printer.error(`资源加载失败: ${rej}`)
    );
  }

  private loadAudio() {
    return list.map(
      key =>
        new Promise((resolve, reject) => {
          const audio = new Audio();
          audio.oncanplay = () => resolve(audio);
          audio.onerror = () => reject(audio);
          audio.src = this.composePath(key);
          this.player[key] = audio;
        })
    );
  }

  play(file: Files, /** 是否强制重新播放 */ rePlay = false): void | never {
    if (!(file in list)) throw new Error(`未注册的音频文件: ${file}`);
    const audio = this.player[file] as HTMLAudioElement;
    if (!audio.ended && !rePlay) return;
    audio.play();
  }
}

export default Sound;
