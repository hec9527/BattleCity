/**
 * 键盘类
 */

class Keyboard {
  /** 键盘已经按下的按键 */
  private pressedKeys = new Set<String>();

  /** 键盘已经屏蔽的按键 */
  private blockedKeys = new Set<String>();

  /** 键盘按键连续响应的时间间隔 */
  private keyPulseTime = 150;

  /** 键盘类，  键盘相关操作 */
  constructor() {
    document.addEventListener('keydown', (e) => {
      this.pressedKeys.add(e.key);
    });
    document.addEventListener('keyup', (e) => {
      this.pressedKeys.delete(e.key);
      this.pressedKeys.delete(e.key);
    });
  }

  /** 按键检测：单次响应  必须抬起按键下次才能检测到 */
  isSingleKey(key: string): boolean {
    return !this.blockedKeys.has(key) && this.pressedKeys.has(key);
  }

  /** 按键检测：多次响应  间隔一定时间之后可以继续响应该按键 */
  isPulseKey(key: string): boolean {
    if (!this.blockedKeys.has(key) && this.pressedKeys.has(key)) {
      setTimeout(() => this.blockedKeys.delete(key), this.keyPulseTime);
      return true;
    }
    return false;
  }

  /** 按键检测：多次响应   响应无时间间隔 */
  isPressedKey(key: string): boolean {
    return this.pressedKeys.has(key);
  }
}

export const KEYBOARD = new Keyboard();

export default KEYBOARD;
