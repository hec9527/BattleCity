import { $ } from '../util';
import keyboard from './keyboard';

const isMobile = /iphone|ipad|ipod|android|micromessenger/i.test(window.navigator.userAgent);

if (isMobile) {
  window.onload = function () {
    const up = $('#up') as HTMLDivElement;
    const left = $('#left') as HTMLDivElement;
    const right = $('#right') as HTMLDivElement;
    const down = $('#down') as HTMLDivElement;
    const select = $('#select') as HTMLDivElement;
    const start = $('#start') as HTMLDivElement;
    const a = $('#a') as HTMLDivElement;
    const b = $('#b') as HTMLDivElement;

    const list: [HTMLDivElement, string][] = [
      [up, 'w'],
      [left, 'a'],
      [right, 'd'],
      [down, 's'],
      [select, 'v'],
      [start, 'b'],
      [a, 'g'],
      [b, 'h'],
    ];

    list.forEach(([el, key]) => {
      el.addEventListener('touchstart', () => keyboard.press(key));
      el.addEventListener('touchend', () => keyboard.release(key));
    });
  };

  // 禁用双击缩放
  document.documentElement.addEventListener('touchend', e => {
    e.preventDefault();
  });
}

export default undefined;
