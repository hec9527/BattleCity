import EVENT from '../event';
import Config from '../config';
import { isEntityCollision } from '../util';

class CollisionDetecter {
  private entities: IEntity[];
  private eventManager = EVENT.EM;

  constructor(entities: IEntity[]) {
    this.entities = entities;
  }

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

  private detectEntity(initiator: IEntity) {
    this.entities.forEach(entity => {
      if (entity === initiator) return;
      if (!entity.getCollision()) return;
      if (isEntityCollision(initiator.getRect(), entity.getRect())) {
        this.eventManager.fireEvent({ type: EVENT.COLLISION.ENTITY, initiator, entity });
      }
    });
  }

  public detect(initiator: IEntity) {
    if (this.detectBorder(initiator)) {
      return;
    }
    this.detectEntity(initiator);
  }
}

export default CollisionDetecter;
