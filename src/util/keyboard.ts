/**
 * 键盘类
 */

import KEYS from '../config/keys';

class Keyboard {
  private static instance: Keyboard;

  /** 键盘已经按下的按键 */
  private pressedKeys = new Set<string>();

  /** 键盘已经屏蔽的按键 */
  private blockedKeys = new Set<string>();

  /** 键盘按键连续响应的时间间隔 */
  private keyPulseTime = 120;

  private _isBlockAll = false;

  public isBlockAll(): boolean {
    return this._isBlockAll;
  }

  public setBlockAll(block: boolean): void {
    setTimeout(() => (this._isBlockAll = block), 0);
  }

  /** 键盘类，  键盘相关操作 */
  private constructor() {
    document.addEventListener('keydown', e => {
      if (this._isBlockAll) return;
      this.pressedKeys.add(e.key);
      if ([KEYS.P2.Left, KEYS.P2.Up, KEYS.P2.Right, KEYS.P2.Down].includes(e.key as any)) {
        e.preventDefault();
        e.cancelBubble = true;
        return false;
      }
    });
    document.addEventListener('keyup', e => {
      this.pressedKeys.delete(e.key);
      this.blockedKeys.delete(e.key);
    });
  }

  public static getInstance(): Keyboard {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }
    return Keyboard.instance;
  }

  /** 按键检测: 单次响应  必须抬起按键下次才能检测到 */
  public isSingleKey(key: string): boolean {
    if (!this.blockedKeys.has(key) && this.pressedKeys.has(key)) {
      this.blockedKeys.add(key);
      return true;
    }
    return false;
  }

  /** 按键检测: 多次响应  间隔一定时间之后可以继续响应该按键 */
  public isPulseKey(key: string): boolean {
    if (this.isSingleKey(key)) {
      setTimeout(() => this.blockedKeys.delete(key), this.keyPulseTime);
      return true;
    }
    return false;
  }

  /** 按键检测：多次响应   响应无时间间隔 */
  public isPressedKey(key: string): boolean {
    return this.pressedKeys.has(key);
  }
}

// export default Keyboard;
