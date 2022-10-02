import EVENT from '../event';
import Bullet from './bullet';
import { isTankEvent } from '../guard';

export default class BulletFactory implements ISubScriber {
  private eventManager = EVENT.EM;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.TANK.SHOOT]);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isTankEvent(event)) {
      if (event.type === EVENT.TANK.SHOOT) {
        new Bullet(event.tank as ITank);
      }
    }
  }
}
