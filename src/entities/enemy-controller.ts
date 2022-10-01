import EVENT from '../event';
import config from '../config';
import { isCollisionEvent } from '../guard';

export default class EnemyController implements ISubScriber {
  private tank: IEnemyTank;
  private eventManager = EVENT.EM;
  private changeDirectionInterval = 30;
  private changeDirectionTicker = 0;

  constructor(tank: IEnemyTank) {
    this.tank = tank;

    this.eventManager.addSubscriber(this, [EVENT.COLLISION.BORDER, EVENT.COLLISION.ENTITY]);
  }

  private getRandomDirection(prefer: IDirection): IDirection {
    if (Math.random() < 0.3) return prefer;
    return Math.floor(Math.random() * 4) as IDirection;
  }

  private changeDirection(force = false): void {
    if (++this.changeDirectionTicker <= this.changeDirectionInterval) return;
    this.changeDirectionTicker = 0;
    if (!force && Math.random() < 0.8) return;

    const [bx, by] = config.base;
    const [x, y] = this.tank.getRect();
    let direction: IDirection = 2;

    if (y < by) {
      direction = this.getRandomDirection(2);
    } else {
      if (x < bx) {
        direction = this.getRandomDirection(1);
      } else {
        direction = this.getRandomDirection(3);
      }
    }
    this.tank.setDirection(direction);
  }

  public getTank(): IEnemyTank {
    return this.tank;
  }

  public update(): void {
    this.tank.shoot();
    this.changeDirection();
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isCollisionEvent(event) && event.initiator === this.tank) {
      this.changeDirection(true);
    }
  }
}
