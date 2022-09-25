import ConstructionCursor from './construction-cursor';
import EVENT from '../event';

export default class ConstructionCursorController implements ISubScriber {
  private eventManager = EVENT.EM;

  constructor(private cursor: ConstructionCursor) {
    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS, EVENT.KEYBOARD.RELEASE]);
  }

  public notify(event: IControllerEvent): void {
    if (event.type === 'KEY_PRESS') {
      this.cursor.keyPress(event.key);
    } else if (event.type === 'KEY_RELEASE') {
      this.cursor.keyRelease(event.key);
    }
  }
}
