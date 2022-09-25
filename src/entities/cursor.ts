import EVENT from '../event';
import config from '../config';
import Entity from './entity';
import StatusToggle from '../status-toggle';

const { UP, DOWN, LEFT, RIGHT } = EVENT.CONTROL.P1;

export default abstract class Cursor extends Entity {
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect = [0, 0, 32, 32];
  protected isCollision = false;
  protected speed = 32;
  protected moveTicker: ITicker = new StatusToggle([0, 1], config.ticker.cursorMove);

  constructor() {
    super();
  }

  public update(): void {
    this.moveTicker?.update();
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    switch (event.type) {
      case UP: {
        this.setDirection(0);
        this.setStop(false);
        break;
      }

      case RIGHT: {
        this.setDirection(1);
        this.setStop(false);
        break;
      }

      case DOWN: {
        this.setDirection(2);
        this.setStop(false);
        break;
      }
      case LEFT: {
        this.setDirection(2);
        this.setStop(false);
        break;
      }
      default: {
        this.setStop(true);
      }
    }
  }
}
