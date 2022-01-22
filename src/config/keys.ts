/**
 * 按键绑定
 * 在此配置键盘按键
 * @author hec9527
 */

enum P1 {
  up = 'w',
  down = 's',
  left = 'a',
  right = 'd',
  single = 'g',
  double = 'h',
  Start = 'b',
}

enum P2 {
  up = 'ArrowUp',
  down = 'ArrowDown',
  left = 'ArrowLeft',
  right = 'ArrowRight',
  single = 'k',
  double = 'l',
}

export const keys = { P1, P2 };

export default keys;
