import { R } from '../loader';
import Entity from './entity';
import EVENT from '../event';
import Config from '../config';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class Bullet extends Entity implements IBullet {
  protected readonly isCollision = true;
  protected rect: IEntityRect;
  protected type: IEntityType = 'bullet';
  private tank: IEntity;

  constructor(tank: IEntity) {
    super();
    this.tank = tank;
    this.rect = [1, 2, 3, 4];
  }

  public getDir(): IDirection {
    return this.direction;
  }

  public getTank(): IEntity {
    return this.tank;
  }

  public update(): void {}

  protected destroy(): void {
    this.eventManager.fireEvent({ type: EVENT.BULLET.DESTROYED, bullet: this });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isDestroyed) {
      const [x, y, w, h] = this.rect;
      ctx.drawImage(R.Image.tool, this.direction * 8, 0, 8, 8, x + PL, y + PT, w, h);
    }
  }
}

export default Bullet;
