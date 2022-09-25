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

/**
 * keyboard Control
 */
class Keyboard implements IController {
  private pressedKey = new Set<string>();
  private eventManager = EVENT.EM;

  constructor() {
    document.addEventListener('keydown', e => {
      this.pressedKey.add(e.key.toLocaleLowerCase());
      e.preventDefault();
    });
    document.addEventListener('keyup', e => {
      this.pressedKey.delete(e.key.toLocaleLowerCase());
    });
  }

  public emitControl(): void {
    this.pressedKey.forEach(key => {
      const event = mapper[key];
      if (event) {
        this.eventManager.fireEvent({ type: event });
      }
    });
  }
}

export default Keyboard;
