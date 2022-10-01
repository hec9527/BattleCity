import EVENT from '../event';
import { isBaseEvent, isBulletExplosionEvent, isTankEvent } from '../guard';
import ExplosionAnimation from './explosion-animation';

export default class ExplosionFactory implements ISubScriber {
  eventManager = EVENT.EM;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.BULLET.DESTROYED, EVENT.TANK.DESTROYED, EVENT.BASE.DESTROY]);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isBulletExplosionEvent(event) && event.explosion) {
      new ExplosionAnimation(event.bullet.getRect(), 'bullet');
    } else if (isTankEvent(event) && event.type === EVENT.TANK.DESTROYED) {
      new ExplosionAnimation(event.tank.getRect(), 'base');
    } else if (isBaseEvent(event) && event.type == EVENT.BASE.DESTROY) {
      new ExplosionAnimation(event.base.getRect(), 'base');
    }
  }
}
