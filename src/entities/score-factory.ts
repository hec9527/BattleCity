import EVENT from '../event';
import { isAwardEvent, isExplosionEvent } from '../guard';
import Score, { IScoreValue } from './score';

export default class ScoreFactory implements ISubScriber {
  eventManager = EVENT.EM;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.EXPLOSION.ENEMY_YANK_EXPLOSION, EVENT.AWARD.DESTROYED]);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isExplosionEvent(event) && event.type === EVENT.EXPLOSION.ENEMY_YANK_EXPLOSION) {
      const tank = event.target as IEnemyTank;
      if (!tank.getExploded()) {
        new Score(tank.getRect(), (tank.getEnemyType() + 1) as IScoreValue);
      }
    } else if (isAwardEvent(event) && event.type === EVENT.AWARD.DESTROYED) {
      if (event.picker?.getCamp() === 'ally') {
        new Score(event.award.getRect(), 5);
      }
    }
  }
}
