import { R } from '../loader';
import EVENT from '../event';
import Config from '../config';
import EntityMoveable from './entity-moveable';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class Bullet extends EntityMoveable implements IBullet {
  protected readonly isCollision = true;
  protected rect: IEntityRect;
  protected type: IEntityType = 'bullet';
  private tank: IEntity;
  private bulletType: IBulletType = 'normal';

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

  public getType(): IBulletType {
    return this.bulletType;
  }

  public setType(type: IBulletType): void {
    this.bulletType = type;
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
