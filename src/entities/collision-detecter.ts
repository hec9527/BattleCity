import EVENT from '../event';
import Config from '../config';
import { isEntityCollision } from '../util';

class CollisionDetecter {
  private eventManager = EVENT.EM;

  private detectBorder(initiator: IEntity): boolean {
    const [x, y, w, h] = initiator.getRect();
    let collisionType: IDirection | undefined = undefined;

    if (x < 0) {
      collisionType = 0;
    } else if (x > Config.battleField.width - w) {
      collisionType = 2;
    } else if (y < 0) {
      collisionType = 3;
    } else if (y > Config.battleField.width - h) {
      collisionType = 1;
    }
    if (collisionType !== undefined) {
      this.eventManager.fireEvent({ type: EVENT.COLLISION.BORDER, initiator, collisionType });
      return true;
    }
    return false;
  }

  private detectEntity(entities: IEntity[], initiator: IEntity) {
    [...entities].forEach(entity => {
      if (entity === initiator) return;
      // if (!entity.getCollision()) return;
      if (isEntityCollision(initiator.getRect(), entity.getRect())) {
        this.eventManager.fireEvent({ type: EVENT.COLLISION.ENTITY, initiator, entity });
      }
    });
  }

  public detectTankSlide(entities: IEntity[], tank: ITank) {
    entities.forEach(entity => {
      if (entity === tank) return;
      if (entity.getEntityType() !== 'brick') return;
      if ((entity as IBrick).getBrickType() !== 'ice') return;
      if (isEntityCollision(entity.getRect(), tank.getRect())) {
        this.eventManager.fireEvent({ type: EVENT.TANK.ALLY_TANK_SLIDE, tank });
      }
    });
  }

  public detect(entities: IEntity[], initiator: IEntity) {
    this.detectBorder(initiator);
    this.detectEntity(entities, initiator);
  }
}

export default CollisionDetecter;
