import EVENT from '../event';
import { isControlEvent, isTankEvent } from '../guard';

export default class AllyController implements ISubScriber {
  private eventManager = EVENT.EM;
  private tank: IAllyTank;
  private role: 'P1' | 'P2';
  private pause = false;
  private defeat = false;
  private hasShoot = false;

  constructor(tank: IAllyTank) {
    this.tank = tank;
    this.role = tank.getPlayer().getRoleType();
    this.eventManager.addSubscriber(this, [
      EVENT.KEYBOARD.PRESS,
      EVENT.KEYBOARD.RELEASE,
      EVENT.GAME.PAUSE,
      EVENT.TANK.ALLY_TANK_DESTROYED,
      EVENT.BASE.DESTROY,
    ]);
  }

  private keyPress(key: string) {
    const { UP, DOWN, RIGHT, LEFT, A, B } = EVENT.CONTROL[this.role];
    switch (key) {
      case UP:
        this.tank.setDirection(0);
        this.tank.setStop(false);
        break;
      case RIGHT:
        this.tank.setDirection(1);
        this.tank.setStop(false);
        break;
      case DOWN:
        this.tank.setDirection(2);
        this.tank.setStop(false);
        break;
      case LEFT:
        this.tank.setDirection(3);
        this.tank.setStop(false);
        break;
      case A:
        if (this.hasShoot) return;
        this.tank.shoot();
        this.hasShoot = true;
        break;
      case B:
        this.tank.setShooting(true);
        break;
      default:
        break;
    }
  }

  private releaseKey(key: string) {
    const { UP, DOWN, RIGHT, LEFT, A, B } = EVENT.CONTROL[this.role];
    switch (key) {
      case UP:
      case RIGHT:
      case DOWN:
      case LEFT:
        this.tank.setStop(true);
        break;
      case A:
        this.hasShoot = false;
        break;
      case B:
        this.tank.setShooting(false);
        break;
      default:
        break;
    }
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (this.defeat) return;

    if (event.type === EVENT.BASE.DESTROY) {
      this.defeat = true;
      this.tank.setStop(true);
      this.tank.setShooting(false);
      return;
    }

    if (event.type === EVENT.GAME.PAUSE) {
      this.pause = !this.pause;
      return;
    }

    if (this.pause) return;

    if (isControlEvent(event)) {
      if (event.type === EVENT.KEYBOARD.PRESS) {
        this.keyPress(event.key);
      } else if (event.type === EVENT.KEYBOARD.RELEASE) {
        this.releaseKey(event.key);
      }
    }

    if (isTankEvent(event) && event.type === EVENT.TANK.ALLY_TANK_DESTROYED && event.tank === this.tank) {
      this.eventManager.removeSubscriber(this);
    }
  }
}
