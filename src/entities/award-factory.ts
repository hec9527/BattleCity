import EVENT from '../event';
import Award from './award';

export default class AwardFactory implements ISubScriber {
  eventManager = EVENT.EM;
  award: IAward | null = null;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.AWARD.DESTROYED, EVENT.TANK.AWARD_TANK_HIT]);
  }

  private destroy() {
    if (this.award && !this.award.getDestroyed()) {
      this.award.destroy();
    }
    this.award = null;
  }

  private create() {
    this.award = new Award();
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (event.type === EVENT.AWARD.DESTROYED) {
      this.destroy();
    } else if (event.type === EVENT.TANK.AWARD_TANK_HIT) {
      this.destroy();
      this.create();
    }
  }
}
