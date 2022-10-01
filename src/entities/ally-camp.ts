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

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.TANK.ALLY_TANK_DESTROYED]);
  }

  public create(player: IPlayer) {
    const role = player.getRoleType();
    const rect = birthPlace[role];
    new BirthAnimation(rect, () => {
      const tank = new AllyTank(rect, player);
      new AllyController(tank);
    });
  }

  public update(): void {
    this.createTask.forEach(task => task.update());
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isTankEvent(event) && event.type === EVENT.TANK.ALLY_TANK_DESTROYED) {
      this.createTask.push(
        new Ticker(config.entity.createAllyInterval, () => {
          this.create((event.tank as IAllyTank).getPlayer());
        }),
      );
    }
  }
}
