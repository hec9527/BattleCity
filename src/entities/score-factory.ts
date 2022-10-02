import EVENT from '../event';
import { isAwardEvent, isEnemyTankKilledEvent, isExplosionEvent } from '../guard';
import Score, { IScoreValue } from './score';

export default class ScoreFactory implements ISubScriber {
  private eventManager = EVENT.EM;

  constructor() {
    this.eventManager.addSubscriber(this, [
      EVENT.EXPLOSION.ENEMY_YANK_EXPLOSION,
      EVENT.AWARD.DESTROYED,
      EVENT.TANK.ENEMY_TANK_DESTROYED,
      EVENT.AWARD.ALLY_PICK_BOMB,
      EVENT.AWARD.ALLY_PICK_MINE,
      EVENT.AWARD.ALLY_PICK_SPADE,
    ]);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    switch (event.type) {
      case EVENT.EXPLOSION.ENEMY_YANK_EXPLOSION: {
        if (isExplosionEvent(event)) {
          const tank = event.target as IEnemyTank;
          if (!tank.getExploded()) {
            new Score(tank.getRect(), (tank.getEnemyType() + 1) as IScoreValue);
          }
        }
        break;
      }
      case EVENT.AWARD.DESTROYED:
        if (isAwardEvent(event)) {
          if (event.picker?.getCamp() === 'ally') {
            new Score(event.award.getRect(), 5);
          }
        }
        break;
      case EVENT.TANK.ENEMY_TANK_DESTROYED:
        if (isEnemyTankKilledEvent(event)) {
          const { tank, killer } = event;
          if (!tank || !killer) return;
          const player = killer.getPlayer();
          player.setKillRecord((tank as IEnemyTank).getEnemyType());
        }
        break;
      case EVENT.AWARD.ALLY_PICK_BOMB:
      case EVENT.AWARD.ALLY_PICK_MINE:
      case EVENT.AWARD.ALLY_PICK_SPADE:
        if (isAwardEvent(event)) {
          if (event.picker && event.picker.getCamp() === 'ally') {
            const player = (event.picker as IAllyTank).getPlayer();
            player.addScore(500);
          }
        }

        break;
    }
  }
}
