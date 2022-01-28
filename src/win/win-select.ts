import Config from '../config/const';
import { P1 } from '../config/keys';
import AllyController from '../util/ally-controller';
import Win from './win';

const K = AllyController.getInstance();

export default class WinSelect extends Win implements IGameWorld {
  private toggleWin = 0;
  private targetHeight = Config.canvas.height / 2;
  private stage = 1;

  constructor() {
    super();
    this.ctx.fg.textAlign = 'center';
    this.ctx.fg.font = '16px prestart';
  }

  update(): void {
    if (this.toggleWin < this.targetHeight) {
      this.toggleWin += 10;
    } else {
      if (K.isPulseKey(P1.up)) {
        this.stage = this.stage < Config.game.maxStage ? this.stage + 1 : Config.game.maxStage;
      } else if (K.isPulseKey(P1.down)) {
        this.stage = this.stage > Config.game.minStage ? this.stage - 1 : Config.game.minStage;
      } else if (K.isTapKey(P1.select) || K.isTapKey(P1.start)) {
        this.next();
      }
    }
  }
  draw(): void {
    this.ctx.fg.fillStyle = Config.colors.black;
    this.ctx.fg.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.fg.fillStyle = Config.colors.gray;
    this.ctx.fg.fillRect(0, 0, Config.canvas.width, this.toggleWin);
    this.ctx.fg.fillRect(0, Config.canvas.height - this.toggleWin, Config.canvas.width, Config.canvas.height);
    if (this.toggleWin >= this.targetHeight) {
      this.ctx.fg.fillStyle = Config.colors.black;
      this.ctx.fg.fillText('STAGE', 230, 228);
      this.ctx.fg.fillText(`${this.stage}`, 310, 228);
    }
  }

  next(): void {
    import('./win-battle').then(win => {
      super.next();
      new win.default();
    });
  }
}
