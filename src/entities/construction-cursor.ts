import EVENT from '../event';
import Config from '../config';
import Entity from './entity';
import StatusToggle from '../status-toggle';
import { Resource } from '../loader';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;
const { UP, DOWN, LEFT, RIGHT } = EVENT.CONTROL.P1;
const R = Resource.getResource();

export default class ConstructionCursor extends Entity {
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect = [0, 0, 32, 32];
  protected isCollision = false;
  protected speed = 32;
  protected moveFrequency = 8;

  private blinkTicker = new StatusToggle([0, 1], Config.ticker.cursorBlink, true);

  constructor() {
    super();

    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS, EVENT.KEYBOARD.RELEASE]);
  }

  public keyPress(key: string) {
    switch (key) {
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
        this.setDirection(3);
        this.setStop(false);
        break;
      }
      default: {
        break;
      }
    }
  }

  public keyRelease(key: string) {
    switch (key) {
      case UP:
      case RIGHT:
      case LEFT:
      case DOWN:
        this.setStop(true);
        break;
      default:
        break;
    }
  }

  public update(): void {
    this.blinkTicker.update();
    super.update();
  }

  protected postMove(): void {
    this.blinkTicker.refresh();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.blinkTicker.getStatus() == 1) return;
    const [x, y, w, h] = this.rect;
    ctx.drawImage(R.Image.myTank, 0, 0, 32, 32, x + PL, y + PT, w, h);
  }

  public getRect(): IEntityRect {
    return this.rect;
  }
}
