import Entity from './entity';
import Config from '../config';
import StatusToggle from '../object/status-toggle';
import Ticker from '../object/ticker';
import { R } from '../loader';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

export default class BirthAnimation extends Entity {
  protected isCollision = false;
  protected type: IEntityType = 'spriteAnimation';
  protected rect: IEntityRect;
  private animationTicker = new StatusToggle([4, 3, 2, 1, 2, 3], Config.ticker.birthStatus);
  private survivalTicker: ITicker;

  constructor(rect: IEntityRect, callback: AnyFunction) {
    super();
    this.rect = rect;

    this.survivalTicker = new Ticker(Config.ticker.birth, () => {
      this.destroy();
      callback();
    });
  }

  public update(): void {
    this.animationTicker.update();
    this.survivalTicker.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.rect;
    ctx.drawImage(R.Image.bonus, this.animationTicker.getStatus() * 32, 64, 32, 32, x + PL, y + PT, w, h);
  }

  public notify(): void {}
}
