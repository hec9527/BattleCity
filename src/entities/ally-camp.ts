import config from '../config';
import EVENT from '../event';
import Ticker from '../ticker';
import AllyTank, { birthPlace } from './ally-tank';
import AllyController from './ally-controller';
import BirthAnimation from './birth-animation';
import { isTankEvent } from '../guard';

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
    const playerTank = player.getTank();
    if (!playerTank && player.getLife() === 0) {
      return;
    }
    new BirthAnimation(rect, () => {
      const tank = new AllyTank(player);

      if (playerTank) {
        tank.inheritFromTank(playerTank);
      } else {
        player.reduceLife();
      }

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
