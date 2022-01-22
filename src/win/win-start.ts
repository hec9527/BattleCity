import Config from '../config/const';
import Log from '../util/print';
import Win from './win';
import { Resource } from '../loader';
import Keyboard from '../util/keyboard';
import Keys from '../config/keys';
import { Ticker } from '../util/ticker';
import Game from '../object/game';
import { getWinStartBackground } from '../util/off-screen-canvas';

const G = Game.getInstance();
const R = Resource.getResource();
const K = Keyboard.getInstance();
const textMarginLeft = (Config.canvas.width / 2 - 60) | 0;

class WinStart extends Win {
  private transformY: number = Config.canvas.height;
  private flag = 0;
  private flagStatus: IMoveStatus = 0;
  private background: HTMLCanvasElement;

  constructor() {
    super();
    Log.info('开始界面，init...');
    K.setBlockAll(true);

    // init cache background
    this.background = getWinStartBackground();

    // ticker
    this.tickerList.addTick(
      new Ticker(Config.ticker.moveStatusFast, () => (this.flagStatus = this.flagStatus ? 0 : 1), true),
    );

    document.addEventListener(
      'keydown',
      () => {
        this.transformY = 0;
        this.ctx.bg.drawImage(this.background, 0, this.transformY);
        setTimeout(() => K.setBlockAll(false), 100);
      },
      { once: true },
    );
    setTimeout(() => K.setBlockAll(false), 3800); // 自动滚动后立即解锁按键
  }

  update(): void {
    if (this.transformY > 0) {
      this.transformY -= 2;
    } else {
      if (K.isBlockAll()) return;
      if (K.isPulseKey(Keys.P1.Up)) {
        this.flag === 0 ? (this.flag = 2) : this.flag--;
      } else if (K.isPulseKey(Keys.P1.Down)) {
        this.flag === 2 ? (this.flag = 0) : this.flag++;
      } else if (K.isPulseKey(Keys.P1.Start)) {
        this.next();
      }
    }
  }

  draw(): void {
    if (this.transformY > 0) {
      this.ctx.bg.drawImage(this.background, 0, this.transformY);
    } else {
      this.ctx.fg.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
      this.ctx.fg.drawImage(
        R.Image.myTank,
        0,
        64 + this.flagStatus * 32,
        32,
        32,
        textMarginLeft - 50,
        this.flag * 35 + 242,
        32,
        32,
      );
    }
  }

  next(): void {
    super.next(() => {
      switch (this.flag) {
        case 0: {
          G.initPlayers(1);
          Log.info('To winSelect, one player');
          import('./win-select').then(win => new win.default());
          break;
        }
        case 1: {
          G.initPlayers(2);
          Log.info('To winSelect, two plater');
          import('./win-select').then(win => new win.default());
          break;
        }
        case 2: {
          G.isCustomized = true;
          Log.info('To Constructor');
          import('./win-construction').then(win => new win.default());
          break;
        }
        default:
          Log.error('unexpected flag number, expected 0-2');
      }
    });
  }
}

export default WinStart;
