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
    this.ctx.fg.textAlign = 'center';
    this.ctx.fg.font = '16px prestart';
  }

  update(): void {
    if (this.taggleWin < this.targetHeight) {
      this.taggleWin += 10;
    } else {
      if (K.isPulseKey(keys.P1.Up)) {
        this.stage = this.stage < Config.game.maxStage ? this.stage + 1 : Config.game.maxStage;
      } else if (K.isPulseKey(keys.P1.Down)) {
        this.stage = this.stage > Config.game.minStage ? this.stage - 1 : Config.game.minStage;
      } else if (K.isPulseKey(keys.P1.Start)) {
        this.next();
      }
    }
  }
  draw(): void {
    this.ctx.fg.fillStyle = Config.colors.black;
    this.ctx.fg.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.fg.fillStyle = Config.colors.gray;
    this.ctx.fg.fillRect(0, 0, Config.canvas.width, this.taggleWin);
    this.ctx.fg.fillRect(0, Config.canvas.height - this.taggleWin, Config.canvas.width, Config.canvas.height);
    if (this.taggleWin >= this.targetHeight) {
      this.ctx.fg.fillStyle = Config.colors.black;
      this.ctx.fg.fillText('STAGE', 230, 228);
      this.ctx.fg.fillText(`${this.stage}`, 310, 228);
    }
  }

  next(): void {
    super.next(() => {
      import('./win-battle').then(win => {
        new win.default();
      });
    });
  }
}

export default WinSelect;
