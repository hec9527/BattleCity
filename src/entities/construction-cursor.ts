import EVENT from '../event';
import Config from '../config';
import StatusToggle from '../object/status-toggle';
import EntityMoveable from './entity-moveable';

import { R } from '../loader';
import { isControlEvent } from '../object/guard';

const { UP, DOWN, LEFT, RIGHT, A, B } = EVENT.CONTROL.P1;
const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

export default class ConstructionCursor extends EntityMoveable {
  protected type: IEntityType = 'cursor';
  protected rect: IEntityRect = [0, 0, 32, 32];
  protected isCollision = false;
  protected speed = 32;
  protected moveFrequency = 8;

  /**
   * 13 14 river status
   * 15 16 base
   * 17 18 quarter brick
   * 19 20 quarter iron
   */
  private currentBrickIndex = 0;
  private buildSpace = false;
  private moved = false;
  private blinkTicker = new StatusToggle([0, 1], Config.ticker.cursorBlink);

  constructor() {
    super();
    this.zIndex = 4;
    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS, EVENT.KEYBOARD.RELEASE]);
  }

  private buildBrick(): void {
    this.eventManager.fireEvent({ type: EVENT.CONSTRUCT.BUILD, index: this.currentBrickIndex });
  }

  private buildNextBrick(): void {
    this.buildSpace = true;
    if (this.moved) {
      this.moved = false;
    } else {
      this.currentBrickIndex++;
    }
    if (this.currentBrickIndex === 14) {
      this.currentBrickIndex = 0;
    }
    // if (this.currentBrickIndex === 14) {
    //   this.currentBrickIndex = 17;
    // } else if (this.currentBrickIndex > 20) {
    //   this.currentBrickIndex = 0;
    // }
    this.buildBrick();
  }

  private buildPreBrick(): void {
    this.buildSpace = true;
    if (this.moved) {
      this.moved = false;
    } else {
      this.currentBrickIndex--;
    }
    if (this.currentBrickIndex < 0) {
      this.currentBrickIndex = 13;
    }
    // if (this.currentBrickIndex < 0) {
    //   this.currentBrickIndex = 20;
    // } else if (this.currentBrickIndex === 16) {
    //   this.currentBrickIndex = 13;
    // }
    this.buildBrick();
  }

  public keyPress(key: string) {
    switch (key) {
      case UP:
        this.setDirection(0);
        this.setStop(false);
        break;
      case RIGHT:
        this.setDirection(1);
        this.setStop(false);
        break;
      case DOWN:
        this.setDirection(2);
        this.setStop(false);
        break;
      case LEFT:
        this.setDirection(3);
        this.setStop(false);
        break;
      case A:
        this.buildPreBrick();
        break;
      case B:
        this.buildNextBrick();
        break;
      default:
        break;
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
      case A:
      case B:
        this.buildSpace = false;
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
    this.moved = true;
    if (this.buildSpace) {
      this.buildBrick();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.blinkTicker.getStatus() == 1) return;
    const [x, y, w, h] = this.rect;
    ctx.drawImage(R.Image.myTank, 0, 0, 32, 32, x + PL, y + PT, w, h);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    super.notify(event);

    if (isControlEvent(event)) {
      if (event.type === 'KEY_PRESS') {
        this.keyPress(event.key);
      } else if (event.type === 'KEY_RELEASE') {
        this.keyRelease(event.key);
      }
    }
  }
}
