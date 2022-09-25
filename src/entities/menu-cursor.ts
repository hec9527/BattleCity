import { R } from '../loader';
import StatusToggle from '../status-toggle';
import { Config } from '../config';
import Entity from './entity';
import EVENT from '../event';
import Ticker from '../ticker';

const { UP, DOWN, SELECT } = EVENT.CONTROL.P1;

export default class MenuCursor extends Entity implements ISubScriber {
  protected isCollision = false;
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect = [0, 0, 32, 32];

  private scrollY = 0;
  private trackStatus = new StatusToggle([0, 1], Config.ticker.trackStatus, true);
  private cursorTicker: ITicker | null = null;
  private menuIndex = 0;
  private menuItems = ['1 PLAYER', '2 PLAYERS', 'CONSTRUCTION'];

  constructor() {
    super();
    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS]);
  }

  private preMenuItem(): void {
    this.menuIndex = this.menuIndex - 1 >= 0 ? this.menuIndex - 1 : this.menuItems.length - 1;
  }

  private nextMenuItem(): void {
    this.menuIndex = this.menuIndex + 1 >= this.menuItems.length ? 0 : this.menuIndex + 1;
  }

  public getMenuIndex(): number {
    return this.menuIndex;
  }

  public setScrollY(scrollY: number): void {
    this.scrollY = scrollY;
  }

  public override update(): void {
    this.trackStatus.update();
    this.cursorTicker?.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const [, , w, h] = this.rect;

    this.menuItems.forEach((menu, i) => ctx.fillText(menu, 178, this.scrollY + 270 + 32 * i));
    this.scrollY === 0 &&
      ctx.drawImage(
        R.Image.myTank,
        0,
        64 + this.trackStatus.getStatus() * 32,
        32,
        32,
        128,
        247 + this.menuIndex * 32,
        w,
        h,
      );
  }

  public notify(event: IControllerEvent): void {
    if (this.cursorTicker && !this.cursorTicker.isFinished()) return;
    this.cursorTicker = new Ticker(Config.ticker.cursorMove);

    switch (event.key) {
      case UP:
        this.preMenuItem();
        break;
      case DOWN:
      case SELECT:
        this.nextMenuItem();
        break;
      default:
        break;
    }
  }
}
