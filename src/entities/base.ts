import EVENT from '../event';
import Entity from './entity';
import config from '../config';
import { R } from '../loader';
import { isCollisionEvent } from '../guard';

const { paddingLeft: PL, paddingTop: PT } = config.battleField;

export default class Base extends Entity {
  protected isCollision = true;
  protected type: IEntityType = 'base';
  protected rect: IEntityRect = [192, 384, 32, 32];

  constructor() {
    super();

    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY]);
  }

  public hit(): void {
    if (!this.isDestroyed) {
      this.eventManager.fireEvent({ type: EVENT.BASE.DESTROY, base: this });
      this.isDestroyed = true;
      R.Audio.play('bomb');
    }
  }

  public update(): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.rect;
    ctx.drawImage(R.Image.brick, (this.isDestroyed ? 16 : 15) * 32, 0, 32, 32, x + PL, y + PT, w, h);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isCollisionEvent(event) && event.type === EVENT.COLLISION.ENTITY) {
      if (event.entity === this && event.initiator.getEntityType() === 'bullet') {
        this.hit();
      }
    }
  }
}
