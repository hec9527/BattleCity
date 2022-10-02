import EVENT from '../event';
import GameOver from './game-over';

export default class GameOverFactory implements ISubScriber {
  private eventManager = EVENT.EM;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.BASE.DESTROY, EVENT.GAME.DEFEAT]);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (event.type === EVENT.BASE.DESTROY || event.type === EVENT.GAME.DEFEAT) {
      new GameOver();
    }
  }
}
