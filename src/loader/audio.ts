import config from '../config';
import Printer from '../util/print';

type Files = typeof files[number];

type Sounds = { [key in Files]: AudioBuffer };

const files = config.resource.audios;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.gain.value = 0;

class AudioLoader {
  private sounds = {} as Sounds;
  private playing: Set<Files> = new Set();

  public setSound(sound: Files, buffer: AudioBuffer) {
    this.sounds[sound] = buffer;
  }

  public play(file: Files) {
    if (this.playing.has(file)) return;
    this.playing.add(file);
    const source = audioCtx.createBufferSource();
    source.buffer = this.sounds[file];
    source.connect(gainNode).connect(audioCtx.destination);
    source.start(0);
    source.onended = () => {
      /**
       * 解决IOS第一次播放需要用户交互的问题
       * https://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
       */
      gainNode.gain.value = 1;
      this.playing.delete(file);
    };
  }
}

export function loadAudio() {
  const audio = new AudioLoader();

  const fetchAudio = (src: Files) => {
    return fetch(`/audio/${src}.wav`)
      .then(res => res.arrayBuffer())
      .then(res => {
        return audioCtx.decodeAudioData(res);
      })
      .then(res => audio.setSound(src, res));
  };

  return new Promise<AudioLoader>(resolve => {
    Promise.all(files.map(fetchAudio))
      .then(() => Printer.info('音频资源加载完毕', audio))
      .catch(rea => {
        Printer.error(`音频资源加载出错，${rea}`);
        alert('音频加载出错');
      })
      .finally(() => resolve(audio));
  });
}

type IAudioManager = AudioLoader;

export type { IAudioManager };

export default loadAudio;
