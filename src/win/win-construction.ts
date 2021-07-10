import Win from './win';
import keys from '@/config/keys';
import Keyboard from '@/util/keyboard';
import { getConstructionBackground } from '@/util/off-screen-canvas';
import { Resource } from '@/loader';
import Config from '@/config/const';
import { Ticker } from '@/util/ticker';
import { Maps, fixMapDataAll } from '@/map';
import Log from '@/util/print';

const M = Maps.getInstance();
const R = Resource.getResource();
const K = Keyboard.getInstance();
const moveSmear = 200;

class WinConstruction extends Win {
  private flagPos = { x: 0, y: 0 };
  private lastFlagPos = { ...this.flagPos };
  private flagShow = true;
  private isFlagJustMove = false; // 移动光标之后的很多时间内保持游标可见，否则移动的是否看上去怪怪的
  private lastIndex = 0; // 缓存上一个方块的索引，如果按下方向键和单发/连发键  快速平铺
  private map = fixMapDataAll(new Array(13).fill(0).map(() => new Array(13).fill(0)) as IMapData);

  constructor() {
    super();

    const [background] = getConstructionBackground();

    this.tickerList.addTick(new Ticker(Config.ticker.moveStatusSlow, () => (this.flagShow = !this.flagShow), true));

    this.ctx.bg.drawImage(background, 0, 0);

    // 先绘制一次，后面增量绘制
    this.map.forEach((row, y) => {
      row.forEach((col, x) => {
        this.ctx.main.drawImage(R.Image.brick, 32 * this.map[y][x], 0, 32, 32, x * 32, y * 32, 32, 32);
      });
    });
  }

  private handleMove(direction: IDirection): boolean {
    this.isFlagJustMove = true;
    setTimeout(() => (this.isFlagJustMove = false), moveSmear);
    let { x, y } = this.flagPos;
    this.lastFlagPos = { x, y };
    ({
      0: () => (y = y > 0 ? y - 1 : 0),
      1: () => (x = x < 12 ? x + 1 : 12),
      2: () => (y = y < 12 ? y + 1 : 12),
      3: () => (x = x > 0 ? x - 1 : 0),
    }[direction]());
    this.flagPos = { x, y };

    /** 快速平铺 反向抵消 */
    if (K.isPulseKey(keys.P1.Single)) {
      this.turnForward();
      return true;
    } else if (K.isPulseKey(keys.P1.Double)) {
      this.turnBack();
      return true;
    }
    return false;
  }

  /** index向后 > 小 */
  private turnBack(): void {
    const { x, y } = this.flagPos;
    if (--this.map[y][x] < 0) {
      this.map[y][x] = 13;
    }
    this.lastIndex = this.map[y][x];
    Log.debug(`当前 index: ${this.lastIndex}`);
  }

  // 向前
  private turnForward(): void {
    const { x, y } = this.flagPos;
    if (++this.map[y][x] > 13) {
      this.map[y][x] = 0;
    }
    this.lastIndex = this.map[y][x];
    Log.debug(`当前 index: ${this.lastIndex}`);
  }

  update(): void {
    if (K.isSingleKey(keys.P1.Start)) {
      // TODO fix
      Log.debug('map', this.map);
      Log.debug('map', JSON.stringify(this.map));
      M.setCustomMap(this.map);
      import('./win-start').then(win => {
        new win.default();
        super.next();
      });
    }

    if (K.isPulseKey(keys.P1.Single)) {
      this.turnBack();
    } else if (K.isPulseKey(keys.P1.Double)) {
      this.turnForward();
    }

    if (K.isPulseKey(keys.P1.Up)) {
      const res = this.handleMove(0);
      if (res) return;
    } else if (K.isPulseKey(keys.P1.Right)) {
      const res = this.handleMove(1);
      if (res) return;
    } else if (K.isPulseKey(keys.P1.Down)) {
      const res = this.handleMove(2);
      if (res) return;
    } else if (K.isPulseKey(keys.P1.Left)) {
      const res = this.handleMove(3);
      if (res) return;
    }
  }

  draw(): void {
    const { x, y } = this.flagPos;
    const { x: lx, y: ly } = this.lastFlagPos;

    // clear
    this.ctx.main.fillRect(x * 32, y * 32, 32, 32);
    this.ctx.main.fillRect(lx * 32, ly * 32, 32, 32);

    // draw
    this.ctx.main.drawImage(R.Image.brick, this.map[ly][lx] * 32, 0, 32, 32, lx * 32, ly * 32, 32, 32);
    this.ctx.main.drawImage(R.Image.brick, this.map[y][x] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);

    // draw flag
    if (this.flagShow || this.isFlagJustMove) {
      this.ctx.main.drawImage(R.Image.myTank, 0, 0, 32, 32, this.flagPos.x * 32, this.flagPos.y * 32, 32, 32);
    }
  }
}

export default WinConstruction;
