import Config from '../config';
import Entity from './entity';

type ICurtainType = 'open' | 'close';

const MAX_CURTAIN_HEIGHT = Math.ceil(Config.canvas.height / 2);
const CURTAIN_SPREAD_SPEED = 10;

export default class Curtain extends Entity {
  protected type: IEntityType = 'curtain';
  protected rect: IEntityRect = [0, 0, 0, 0];
  protected isCollision = false;
  protected zIndex = 5;

  private curtainH: number;
  private speed: number;
  private destroyAfterAnimation: boolean;

  constructor(curtainType: ICurtainType, destroy = false) {
    super();
    this.speed = curtainType === 'open' ? -CURTAIN_SPREAD_SPEED : CURTAIN_SPREAD_SPEED;
    this.curtainH = curtainType === 'open' ? MAX_CURTAIN_HEIGHT : 0;
    this.destroyAfterAnimation = destroy;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public update(): void {
    if (this.speed === 0) return;
    if (this.curtainH < 0) {
      this.curtainH = 0;
      this.speed = 0;
      this.destroyAfterAnimation && super.destroy();
    } else if (this.curtainH > MAX_CURTAIN_HEIGHT) {
      this.curtainH = MAX_CURTAIN_HEIGHT;
      this.speed = 0;
      this.destroyAfterAnimation && super.destroy();
    }
    this.curtainH += this.speed;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = Config.colors.gray;
    ctx.fillRect(0, 0, Config.canvas.width, this.curtainH);
    ctx.fillRect(0, Config.canvas.height - this.curtainH, Config.canvas.width, this.curtainH);
  }

  public notify(): void {}
}
