/**
 * 游戏控制器
 *  通过控制器控制游戏中的实体
 *  抽象游戏控制逻辑，防止游戏逻辑与处理硬编码、强耦合
 *  TODO 后期考虑添加 gamePad 控制器 添加手柄操作方式
 */
import KEYS from '../config/keys';

const actions = ['up', 'down', 'left', 'right', 'single', 'double', 'start'] as const;
type ControllerKeys = typeof KEYS.P1 | typeof KEYS.P2;

export default class AllyController implements IController {
  public blocked = false;
  private _buttons: IControllerStatus = {
    up: false,
    right: false,
    down: false,
    left: false,
    single: false,
    double: false,
    select: false,
    start: false,
  };

  get buttons(): IControllerStatus {
    return this._buttons;
  }

  constructor(public readonly deputy = false) {
    const keys: any = deputy ? KEYS.P1 : KEYS.P2;
    document.addEventListener('keydown', e => {
      e.preventDefault();
      if (this.blocked) return;
      actions.some(a => {
        if (keys[a] === e.key) {
          return (this._buttons[a] = true);
        }
      });
    });
    document.addEventListener('keyup', e => {
      actions.some(a => {
        if (keys[a] === e.key) {
          return (this._buttons[a] = false);
        }
      });
    });
    setInterval(() => console.log(this.buttons), 1000);
  }

  // private _up = false;
  // private _right = false;
  // private _down = false;
  // private _left = false;
  // private _single = false;
  // private _double = false;
  // private _select = false;
  // private _start = false;
  // private _blocked = false; // 停止响应控制器
  // private _keys: ControllerKeys;
  // private readonly keyBlockTime = 120; // 按键屏蔽时长
  // private pressedKeys = new Set<string>();
  // private blockedKeys = new Set<string>();
  // constructor(deputy = false) {
  //   this._keys = deputy ? KEYS.P2 : KEYS.P1;
  //   document.addEventListener('keydown', e => {
  //     e.preventDefault();
  //     if (this._blocked) return;
  //     this.pressedKeys.add(e.key);
  //     const key = e.key as unknown as ControllerKeys;
  //     // switch (key) {
  //     //   case this._keys.Up:
  //     //     this._up = true;
  //     // }
  //   });
  //   document.addEventListener('keyup', e => {
  //     this.pressedKeys.delete(e.key);
  //     this.blockedKeys.delete(e.key);
  //   });
  // }
  // public isBlocked(): boolean {
  //   return this._blocked;
  // }
  // public setBlock(block: boolean): void {
  //   this._blocked = block;
  // }
  // public getStatus(): IControllerStatus {
  //   // eslint-disable-next-line @typescript-eslint/no-this-alias
  //   const self = this;
  //   return {
  //     get up(): boolean {
  //       return self._up;
  //     },
  //     get right(): boolean {
  //       return self._right;
  //     },
  //     get down(): boolean {
  //       return self._down;
  //     },
  //     get left(): boolean {
  //       return self._left;
  //     },
  //     get single(): boolean {
  //       return self._single;
  //     },
  //     get double(): boolean {
  //       return self._double;
  //     },
  //     get select(): boolean {
  //       return self._select;
  //     },
  //     get start(): boolean {
  //       return self._start;
  //     },
  //   };
  // }
}

const c = new AllyController();
