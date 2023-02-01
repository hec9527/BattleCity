import config from '../config';
import Ticker from '../object/ticker';
import Entity from './entity';

export default class GameOver extends Entity {
  protected type: IEntityType = 'gameOverFlag';
  protected rect: IEntityRect = [104, 0, 248, 160];
  protected isCollision = false;
  protected zIndex = 4;
  private delayTick = new Ticker(config.ticker.defeat);
  private toggleY = config.battleField.height / 2;
  private slideY = config.battleField.height - 40;
  private speed = 3;

  constructor() {
    super();
  }

  public update(): void {
    if (this.delayTick.isFinished()) {
      if (this.slideY > this.toggleY) {
        this.slideY -= this.speed;
        if (this.slideY <= this.toggleY) {
          this.slideY = this.toggleY;
        }
      }
    } else {
      this.delayTick.update();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.delayTick.isFinished()) return;

    ctx.save();
    ctx.font = '30px prestart';
    ctx.fillStyle = config.colors.red1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME', 248, this.slideY);
    ctx.fillText('OVER', 248, this.slideY + 40);

    ctx.restore();
  }
}
