import config from '../config';
import EVENT from '../event';
import Ticker from '../ticker';
import AllyTank from './ally-tank';
import AllyController from './ally-controller';
import { isTankEvent } from '../guard';
import BirthAnimation from './birth-animation';

const birthPlace = {
  P1: [128, 384, 32, 32] as IEntityRect,
  P2: [256, 384, 32, 32] as IEntityRect,
};

export default class AllyCamp implements ISubScriber {
  private eventManager = EVENT.EM;
  private createTask: ITicker[] = [];
  private defeat = false;
  private palsy = false;

  constructor() {
    this.eventManager.addSubscriber(this, [
      EVENT.TANK.ALLY_TANK_DESTROYED,
      EVENT.BASE.DESTROY,
      EVENT.MINE.ALLY_OVER,
      EVENT.AWARD.ENEMY_PICK_MINE,
    ]);
  }

  public create(player: IPlayer) {
    const role = player.getRoleType();
    const rect = birthPlace[role];
    new BirthAnimation(rect, () => {
      const tank = new AllyTank(rect, player);
      if (!this.defeat) {
        const controller = new AllyController(tank);
        controller.setPalsy(this.palsy);
      }
    });
  }

  public update(): void {
    this.createTask.forEach(task => task.update());
    // this.createTask[0]?.update();
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isTankEvent(event) && event.type === EVENT.TANK.ALLY_TANK_DESTROYED) {
      this.createTask.push(
        new Ticker(config.entity.createAllyInterval, () => {
          this.create((event.tank as IAllyTank).getPlayer());
        }),
      );
    } else if (event.type === EVENT.BASE.DESTROY) {
      this.defeat = true;
    } else if (event.type === EVENT.MINE.ALLY_OVER) {
      this.palsy = false;
    } else if (event.type === EVENT.AWARD.ENEMY_PICK_MINE) {
      this.palsy = true;
    }
  }
}
