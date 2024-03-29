import EVENT from '../event';
import CollisionDetecter from './collision-detecter';

class EntityContainer implements ISubScriber {
  private entities: IEntity[] = [];
  private eventManager: IEventManager = EVENT.EM;
  private collisionDetecter: CollisionDetecter;

  constructor() {
    this.eventManager.addSubscriber(this, [
      EVENT.ENTITY.CREATED,
      EVENT.ENTITY.DESTROYED,
      EVENT.ENTITY.MOVE,
      EVENT.AWARD.CREATE,
      EVENT.TANK.ALLY_TANK_STOP,
    ]);
    this.collisionDetecter = new CollisionDetecter();
  }

  private sortEntityByZIndex(): void {
    this.entities.sort((a, b) => {
      if (a.getZIndex() > b.getZIndex()) {
        return 1;
      }
      if (a.getZIndex() < b.getZIndex()) {
        return -1;
      }
      return 0;
    });
  }

  public update(): void {
    [...this.entities].forEach(entity => entity.update());
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    [...this.entities].forEach(entity => entity.draw(ctx));
  }

  public addEntity(entity: IEntity) {
    this.entities.push(entity);
    this.sortEntityByZIndex();
  }

  public removeEntity(entity: IEntity) {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i] === entity) {
        this.entities.splice(i, 1);
        return;
      }
    }
  }

  public clearEntity() {
    this.entities = [];
  }

  public getAllEntity(): IEntity[] {
    return [...this.entities];
  }

  public notify(event: INotifyEvent): void {
    switch (event.type) {
      case EVENT.ENTITY.CREATED:
        this.addEntity((event as IEntityEvent).entity);
        break;
      case EVENT.ENTITY.DESTROYED:
        this.removeEntity((event as IEntityEvent).entity);
        break;
      case EVENT.ENTITY.MOVE:
        this.collisionDetecter.detect(this.getAllEntity(), (event as IEntityEvent).entity);
        break;
      case EVENT.AWARD.CREATE:
        this.eventManager.fireEvent<IAwardDetectEvent>({ type: EVENT.AWARD.DETECT, entities: this.getAllEntity() });
        break;
      case EVENT.TANK.ALLY_TANK_STOP:
        this.collisionDetecter.detectTankSlide(this.getAllEntity(), (event as ITankEvent).tank);
        break;
      default:
        console.warn(`useless event subScriber: ${event.type}`);
        break;
    }
  }
}

export default EntityContainer;
