import config from '../config';
import EVENT from '../event';
import Ticker from '../object/ticker';

export default class MineTicker implements ISubScriber {
  private eventManager = EVENT.EM;
  private enemyTicker: ITicker | null = null;
  private allyTicker: ITicker | null = null;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.AWARD.ALLY_PICK_MINE, EVENT.AWARD.ENEMY_PICK_MINE]);
  }

  public update() {
    if (this.enemyTicker && !this.enemyTicker.isFinished()) {
      this.enemyTicker.update();
      if (this.enemyTicker.isFinished()) {
        this.eventManager.fireEvent({ type: EVENT.MINE.ENEMY_OVER });
      }
    }

    if (this.allyTicker && !this.allyTicker.isFinished()) {
      this.allyTicker.update();
      if (this.allyTicker.isFinished()) {
        this.eventManager.fireEvent({ type: EVENT.MINE.ALLY_OVER });
      }
    }
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (event.type === EVENT.AWARD.ALLY_PICK_MINE) {
      this.enemyTicker = new Ticker(300 || config.ticker.mine);
    } else if (event.type === EVENT.AWARD.ENEMY_PICK_MINE) {
      this.allyTicker = new Ticker(300 || config.ticker.mine);
    }
  }
}
