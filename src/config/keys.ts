/**
 * 按键绑定
 * 在此配置键盘按键
 * @author hec9527
 */

export const P1 = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
  single: 'g',
  double: 'h',
  select: 'v',
  start: 'b',
} as const;

export const P2 = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  single: 'k',
  double: 'l',
} as const;

export default { P1, P2 };
