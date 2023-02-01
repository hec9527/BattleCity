import EVENT from '../event';
import Entity from './entity';
import config from '../config';
import Ticker from '../object/ticker';
import StatusToggle from '../object/status-toggle';

import { R } from '../loader';

type IExplosionType = keyof typeof config.explosion;

const { paddingLeft: PL, paddingTop: PT } = config.battleField;

export default class Explosion extends Entity {
  protected type: IEntityType = 'explosionAnimation';
  protected rect: IEntityRect;
  protected isCollision = false;
  protected zIndex = 4;

  private frameStatus: StatusToggle;
  private explosionTick: ITicker;
  private target: IEntity;

  constructor(target: IEntity, type: IExplosionType = 'base') {
    super();
    let [x, y] = target.getRect();
    if (type === 'base') {
      x -= 16;
      y -= 16;
    } else {
      x -= 28;
      y -= 28;
    }

    this.target = target;
    this.rect = [x, y, 64, 64];
    this.frameStatus = new StatusToggle(config.explosion[type], config.ticker.explodeStatus);
    this.explosionTick = new Ticker(type === 'base' ? config.ticker.explodeBase : config.ticker.explodeBullet);
  }

  protected destroy(): void {
    if (this.target.getEntityType() === 'enemyTank') {
      this.eventManager.fireEvent({ type: EVENT.EXPLOSION.ENEMY_YANK_EXPLOSION, target: this.target });
    }

    super.destroy();
  }

  public update(): void {
    this.frameStatus.update();
    this.explosionTick.update();
    if (this.explosionTick.isFinished()) {
      this.destroy();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.rect;
    ctx.drawImage(R.Image.explode, this.frameStatus.getStatus() * 64, 0, 64, 64, x + PL, y + PT, w, h);
  }
}
