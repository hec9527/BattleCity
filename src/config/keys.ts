/**
 * 按键绑定
 * 在此配置键盘按键
 * @author hec9527
 */

enum P1 {
  Up = 'w',
  Down = 's',
  Left = 'a',
  Right = 'd',
  Single = 'g',
  Double = 'h',
  Start = 'b',
}

enum P2 {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight',
  Single = 'k',
  Double = 'l',
}

export const keys = { P1, P2 };

export default keys;
