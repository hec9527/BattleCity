import Config from '@/config/const';
import keys from '@/config/keys';
import Keyboard from '@/util/keyboard';
import Win from './win';

const K = Keyboard.getInstance();

class WinSelect extends Win {
  private taggleWin = 0;
  private targetHeight = Config.canvas.height / 2;
  private stage = 1;

  constructor() {
    super();
    this.ctx.textAlign = 'center';
    this.ctx.font = '16px prestart';
  }

  update(): void {
    if (this.taggleWin < this.targetHeight) {
      this.taggleWin += 10;
    } else {
      if (K.isPulseKey(keys.P1.Up)) {
        this.stage = this.stage < 256 ? this.stage + 1 : 256;
      } else if (K.isPulseKey(keys.P1.Down)) {
        this.stage = this.stage > 1 ? this.stage - 1 : 1;
      } else if (K.isPulseKey(keys.P1.Start)) {
        this.next();
      }
    }
  }
  draw(): void {
    this.ctx.fillStyle = Config.colors.black;
    this.ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.fillStyle = Config.colors.gray;
    this.ctx.fillRect(0, 0, Config.canvas.width, this.taggleWin);
    this.ctx.fillRect(0, Config.canvas.height - this.taggleWin, Config.canvas.width, Config.canvas.height);
    if (this.taggleWin >= this.targetHeight) {
      this.ctx.fillStyle = Config.colors.black;
      this.ctx.fillText('STAGE', 230, 228);
      this.ctx.fillText(`${this.stage}`, 310, 228);
    }
  }

  next(): void {
    import('./win-battle').then(win => {
      new win.default();
      super.next();
    });
  }
}

export default WinSelect;
