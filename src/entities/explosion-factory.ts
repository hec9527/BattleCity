import EVENT from '../event';
import { isBaseEvent, isBulletExplosionEvent, isTankEvent } from '../guard';
import Explosion from './explosion';

export default class ExplosionFactory implements ISubScriber {
  eventManager = EVENT.EM;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.BULLET.DESTROYED, EVENT.TANK.DESTROYED, EVENT.BASE.DESTROY]);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isBulletExplosionEvent(event) && event.explosion) {
      new Explosion(event.bullet, 'bullet');
    } else if (isTankEvent(event) && event.type === EVENT.TANK.DESTROYED) {
      new Explosion(event.tank, 'base');
    } else if (isBaseEvent(event) && event.type == EVENT.BASE.DESTROY) {
      new Explosion(event.base, 'base');
    }
  }
}
