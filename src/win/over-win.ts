import EVENT from '../event';
import Ticker from '../object/ticker';
import config from '../config';

import { R } from '../loader';
import { isControlEvent } from '../object/guard';

export default class OverWin implements IGameWin, ISubScriber {
  private winManager: IWindowManager;
  private eventManager = EVENT.EM;
  private banControlTicker = new Ticker(180);
  private autoJumpTicker = new Ticker(300);
  private destroyed = false;

  constructor(winManager: IWindowManager) {
    R.Audio.play('over');

    this.winManager = winManager;
    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS]);
  }

  public update(): void {
    this.banControlTicker.update();
    this.autoJumpTicker.update();
    if (this.autoJumpTicker.isFinished()) {
      this.nextWin();
    }
  }

  public nextWin(): void {
    this.destroyed = true;
    this.winManager.toMenuWin();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.destroyed) return;
    ctx.fillStyle = config.colors.black;
    ctx.fillRect(0, 0, config.canvas.width, config.canvas.height);
    ctx.drawImage(R.Image.UI, 0, 160, 248, 160, 132, 148, 248, 160);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (this.banControlTicker.isFinished() && isControlEvent(event)) {
      this.nextWin();
    }
  }
}
