import config from '../config';
import EVENT from '../event';
import StatusToggle from '../object/status-toggle';

import { R } from '../loader';
import { isControlEvent } from '../object/guard';

export default class PauseFactory implements ISubScriber {
  private eventManager = EVENT.EM;
  private pause = false;
  private active = true;
  private pauseStatus = new StatusToggle([1, 0], config.ticker.pause);

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS]);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (!this.active || this.pause) return;
        this.pause = true;
        this.eventManager.fireEvent({ type: EVENT.GAME.PAUSE });
        this.pauseStatus.refresh();
        R.Audio.play('pause');
      }
    });
  }

  public update(): void {
    if (!this.active) return;
    if (this.pause) {
      this.pauseStatus.update();
    }
  }

  public setActive(active: boolean): void {
    this.active = active;
  }

  public getPause(): boolean {
    return this.pause;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.pause || this.pauseStatus.getStatus() === 0) return;
    ctx.save();
    ctx.font = '20px prestart';
    ctx.fillStyle = config.colors.red;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSE', config.canvas.width / 2, config.canvas.height / 2);
    ctx.restore();
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (!this.active) return;
    if (isControlEvent(event) && event.type === EVENT.KEYBOARD.PRESS && event.key === EVENT.CONTROL.P1.START) {
      this.pause = !this.pause;
      this.eventManager.fireEvent({ type: EVENT.GAME.PAUSE });

      if (this.pause) {
        this.pauseStatus.refresh();
        R.Audio.play('pause');
      }
    }
  }
}
