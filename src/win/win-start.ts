import Config from '@/config/const';
import Log from '@/util/print';
import Win from './win';
import { Resource } from '@/loader';
import Keyboard from '@/util/keyboard';
import Keys from '@/config/keys';
import { Ticker } from '@/util/ticker';
import Game from '@/object/game';
import { getWinStartBackground } from '@/util/off-screen-canvas';
import Players from '@/object/player';

const G = Game.getInstance();
const R = Resource.getResource();
const K = Keyboard.getInstance();
const textMarginleft = (Config.canvas.width / 2 - 60) | 0;

K.setBlockAll(true);

class WinStart extends Win {
  private transformY: number = Config.canvas.height;
  private flag = 0;
  private flagStatus: IMoveStatus = 0;
  private background: HTMLCanvasElement;

  constructor() {
    super();
    Log.info('开始界面，init...');

    // init cache background
    this.background = getWinStartBackground();

    // fill
    this.ctx.fillStyle = Config.colors.black;

    // ticker
    this.tickerList.addTick(
      new Ticker(Config.ticker.moveStatusFast, () => (this.flagStatus = this.flagStatus ? 0 : 1), true)
    );

    document.addEventListener(
      'keydown',
      () => {
        this.transformY = 0;
        setTimeout(() => K.setBlockAll(false), 100);
      },
      { once: true }
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
    this.ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.drawImage(this.background, 0, this.transformY);
    if (this.transformY <= 0) {
      this.ctx.drawImage(
        R.Image.myTank,
        0,
        64 + this.flagStatus * 32,
        32,
        32,
        textMarginleft - 50,
        this.flag * 35 + 242,
        32,
        32
      );
    }
  }

  next(): void {
    switch (this.flag) {
      case 0: {
        G.mode = 'single';
        G.players = Players.getInstance(1);
        Log.info('To winSelect, one player');
        import('./win-select').then(win => new win.default());
        break;
      }
      case 1: {
        G.mode = 'double';
        G.players = Players.getInstance(2);
        Log.info('To winSelect, two plater');
        import('./win-select').then(win => new win.default());
        break;
      }
      case 2: {
        G.isCustomed = true;
        Log.info('To Constructor');
        import('./win-construction').then(win => new win.default());
        break;
      }
      default:
        Log.error('unexpected flag number, expected 0-2');
    }
    super.next();
  }
}

export default WinStart;
