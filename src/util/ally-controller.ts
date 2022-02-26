/**
 * 游戏控制器
 *  通过控制器控制游戏中的实体
 *  抽象游戏控制逻辑，防止游戏逻辑与处理硬编码、强耦合
 */
import { P1, P2 } from '../config/keys';

type Keys = ValueOf<typeof P1> | ValueOf<typeof P2>;

export default class AllyController implements IAllyController {
  static instance: AllyController;

  // private readonly lastPressedKeys: Keys[] = [];

  private readonly pressedKeys: Set<Keys> = new Set();

  private readonly blockedKeys: Set<Keys> = new Set();

  private readonly pulseTime = 150;

  private blocked = false;

  private constructor() {
    document.addEventListener('keydown', e => {
      if (this.blocked) return;
      // if (this.lastPressedKeys.length >= 1) {
      //   this.lastPressedKeys.shift();
      // }
      // this.lastPressedKeys.push(e.key as Keys);
      this.pressedKeys.add(e.key as any);
      if ([P2.up, P2.right, P2.down, P2.left].includes(e.key as any)) {
        e.preventDefault();
        e.cancelBubble = true;
        return false;
      }
    });
    document.addEventListener('keyup', e => {
      this.blockedKeys.delete(e.key as any);
      this.pressedKeys.delete(e.key as any);
    });
  }

  public static getInstance(): AllyController {
    if (!AllyController.instance) {
      AllyController.instance = new AllyController();
    }
    return AllyController.instance;
  }

  public lock(): void {
    this.blocked = true;
  }

  public unlock(): void {
    this.blocked = false;
  }

  get isLocked(): boolean {
    return this.blocked;
  }

  /**
   * 检测按键是否被按下，只响应一次
   */
  public isTapKey(key: Keys): boolean {
    if (!this.blocked && this.isPressKey(key)) {
      this.blockedKeys.add(key);
      return true;
    }
    return false;
  }

  /**
   * 检测按键是否被按下，一定时间后可以继续响应
   */
  public isPulseKey(key: Keys, pulseTime = this.pulseTime): boolean {
    if (this.isTapKey(key)) {
      setTimeout(() => this.blockedKeys.delete(key), pulseTime);
      return true;
    }
    return false;
  }

  /**
   * 检测按键是否被按下，可以连续响应
   */
  public isPressKey(key: Keys): boolean {
    return !this.blocked && !this.blockedKeys.has(key) && this.pressedKeys.has(key);
  }
}
