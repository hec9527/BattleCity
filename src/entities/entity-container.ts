import EVENT from '../event';
import CollisionDetecter from './collision-detecter';

class EntityContainer implements ISubScriber {
  private entities: Set<IEntity> = new Set();
  private eventManager: IEventManager = EVENT.EM;
  private collisionDetecter: CollisionDetecter;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.ENTITY.CREATED, EVENT.ENTITY.DESTROYED, EVENT.ENTITY.MOVE]);
    this.collisionDetecter = new CollisionDetecter(this.entities);
  }

  public addEntity(entity: IEntity) {
    this.entities.add(entity);
  }

  public removeEntity(entity: IEntity) {
    this.entities.delete(entity);
  }

  public clearEntity() {
    this.entities.clear();
  }

  public notify(event: INotifyEvent<Record<'entity', IEntity>>): void {
    switch (event.type) {
      case EVENT.ENTITY.CREATED:
        this.addEntity(event.entity);
        break;
      case EVENT.ENTITY.DESTROYED:
        this.removeEntity(event.entity);
        break;
      case EVENT.ENTITY.MOVE:
        this.collisionDetecter.detect(event.entity);
        break;
      default:
        console.warn(`useless event subScriber: ${event.type}`);
        break;
    }
  }
}

export default EntityContainer;
