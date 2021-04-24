import { getCanvas } from '@/util';
import Config from '@/config/const';
import Log from '@/util/print';
import Win from './win';
import { Resource } from '@/loader';
import Keyboard from '@/util/keyboard';
import Keys from '@/config/keys';
import { Ticker } from '@/util/ticker';

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
    this.background = this.getBackground();

    // fill
    this.ctx.fillStyle = '#000';

    // ticker
    this.tickerList.addTick(
      new Ticker(Config.ticker.moveStatus, () => (this.flagStatus = this.flagStatus ? 0 : 1), true)
    );

    document.addEventListener(
      'keydown',
      () => {
        this.transformY = 0;
        setTimeout(() => K.setBlockAll(false), 100);
      },
      { once: true }
    );
  }

  private getBackground(): HTMLCanvasElement {
    const { canvas, ctx } = getCanvas(Config.canvas.width, Config.canvas.height);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(R.Image.UI, 0, 0, 376, 136, 68, 80, 376, 136);

    // 底部信息
    ctx.font = '16px prestart';
    ctx.fillStyle = '#b82619';
    ctx.fillText('HEC9527', textMarginleft, 365);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillText('© 1995 2021', textMarginleft - 20, 400);
    ctx.fillText('ALL RIGHTS RESERVED', textMarginleft - 70, 435);
    // 选项
    ctx.fillText('1 PLAYER', textMarginleft, 260);
    ctx.fillText('2 PLAYERS', textMarginleft, 295);
    ctx.fillText('CONSTRUCTION', textMarginleft, 330);
    // 顶部信息
    ctx.font = '14px prestart';
    ctx.fillText('1P-', 50, 40);
    ctx.fillText('HI-', 200, 40);
    ctx.fillText('2P-', 350, 40);
    ctx.textAlign = 'right';
    ctx.fillText('00', 175, 40);
    ctx.fillText('20000', 325, 40);
    ctx.fillText('00', 475, 40);
    return canvas;
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
        Log.info('To winSelect, one player');
        import('./win-select').then(win => new win.default());
        break;
      }
      case 1: {
        Log.info('To winSelect, two plater');
        import('./win-select').then(win => new win.default());
        break;
      }
      case 2: {
        Log.info('To Constructor');
        // import()
        break;
      }
      default:
        Log.error('unexpected flag number, expected 0-2');
    }
    super.next();
  }
}

export default WinStart;
