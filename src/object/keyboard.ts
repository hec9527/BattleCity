import EVENT from '../event';

const mapper: { [K in string]: string } = {
  // p1
  w: EVENT.CONTROL.P1.UP,
  a: EVENT.CONTROL.P1.LEFT,
  s: EVENT.CONTROL.P1.DOWN,
  d: EVENT.CONTROL.P1.RIGHT,
  g: EVENT.CONTROL.P1.A,
  h: EVENT.CONTROL.P1.B,
  v: EVENT.CONTROL.P1.SELECT,
  b: EVENT.CONTROL.P1.START,
  // p2
  arrowup: EVENT.CONTROL.P2.UP,
  arrowleft: EVENT.CONTROL.P2.LEFT,
  arrowdown: EVENT.CONTROL.P2.DOWN,
  arrowright: EVENT.CONTROL.P2.RIGHT,
  k: EVENT.CONTROL.P2.A,
  l: EVENT.CONTROL.P2.B,
};

const preventKey = ['arrowup', 'arrowleft', 'arrowdown', 'arrowright'];

/**
 * keyboard Control
 */
class Keyboard implements IController {
  private events: IControllerEvent[] = [];
  private eventManager = EVENT.EM;

  constructor() {
    document.addEventListener('keydown', e => {
      this.events.push({ type: 'KEY_PRESS', key: mapper[e.key.toLocaleLowerCase()] });
      if (preventKey.includes(e.key.toLocaleLowerCase())) {
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', e => {
      this.events.push({ type: 'KEY_RELEASE', key: mapper[e.key.toLocaleLowerCase()] });
      e.preventDefault();
    });
  }

  public emitControl(): void {
    this.events.forEach(event => {
      this.eventManager.fireEvent<IControllerEvent>(event);
    });
    this.events = [];
  }
}

export default Keyboard;