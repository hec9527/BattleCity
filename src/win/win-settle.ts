import Win from './win';
import Game from '../object/game';
import Config from '../config/const';
import { Resource } from '../loader';
import { Ticker } from '../util/ticker';

const G = Game.getInstance();
const R = Resource.getResource();

class WinSettle extends Win {
  private settleOverTicker: Ticker | undefined;

  constructor() {
    super();
    this.ctx.bg.fillStyle = Config.colors.black;
  }

  update(): void {
    if (!this.settleOverTicker) {
      this.settleOverTicker = new Ticker(Config.ticker.battleOver / 5, () => {
        this.settleOverTicker = undefined;
        import('./win-battle').then(({ default: Win }) => {
          G.nextStage();
          this.next(true, () => new Win());
        });
      });
      this.addTicker(this.settleOverTicker);
    }
  }

  draw(): void {
    this.ctx.bg.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.bg.drawImage(G.getMode() === 'single' ? R.Image.getScore : R.Image.getScoreDouble, 0, 0);
  }
}

export default WinSettle;
