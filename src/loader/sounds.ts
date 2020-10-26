/**
 * 资源加载器 -- 音频
 * @author  hec9527
 */

import Printer from '../util/print';

type files = 'attack' | 'attackOver' | 'bomb' | 'count' | 'eat' | 'life' | 'misc' | 'move' | 'over' | 'pause' | 'start';

class Sound {
  /** 背景音乐播放器 */
  private playerBg: HTMLAudioElement = new Audio();

  /** 音乐文件列表 */
  private list: string[] = ['attack', 'attackOver', 'bomb', 'count', 'eat', 'life', 'misc', 'move', 'over', 'pause', 'start'];

  private composePath(file: string): string {
    return `../../assets/audio/${file}.mp3`;
  }

  constructor(callback?: Function) {
    const loadAudio = () =>
      this.list.map(
        (key: string) =>
          new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplay = () => resolve(audio);
            audio.onerror = () => reject(audio);
            audio.src = this.composePath(key);
          })
      );

    Promise.all(loadAudio()).then(
      (res) => {
        Printer.info('音频加载完成');
        callback && callback(res);
      },
      (rej) => Printer.error(`资源加载失败: ${rej}`)
    );
  }

  /**
   * 播放音效
   * @param file
   */
  play(file: files): void {
    const audio = new Audio();
    audio.oncanplay = () => audio.play();
    audio.src = this.composePath(file);
  }

  /**
   * 播放背景音乐
   * @param file
   */
  playBackgroundAudio(file: files): void {
    this.playerBg.oncanplay = () => this.playerBg.play();
    this.playerBg.src = this.composePath(file);
  }
}

export default Sound;
