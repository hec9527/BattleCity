/* eslint-disable @typescript-eslint/no-unused-vars */
import EVENT from '../event';

abstract class Entity implements IEntity, ISubScriber {
  protected abstract readonly type: IEntityType;
  protected abstract isCollision: boolean;
  protected abstract rect: IEntityRect;
  protected readonly eventManager = EVENT.EM;
  protected zIndex = 1;
  protected camp: ICamp = 'neutral';
  protected direction: IDirection = 0;
  protected isDestroyed = false;

  constructor() {
    this.eventManager.fireEvent({ type: EVENT.ENTITY.CREATED, entity: this });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected destroy(...args: any[]): void {
    this.isDestroyed = true;
    this.eventManager.fireEvent({ type: EVENT.ENTITY.DESTROYED, entity: this });
    this.eventManager.removeSubscriber(this);
  }

  // below methods should be overwrite be subclass
  protected preDestroy(): void {}
  protected postDestroy(): void {}
  protected postMove(): void {}

  public notify(event: INotifyEvent<Record<string, unknown>>): void {}

  public abstract update(): void;
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  public getCenter(): IPoint {
    const [x, y, w, h] = this.rect;
    return [x + w / 2, y + h / 2];
  }

  public getDirection(): IDirection {
    return this.direction;
  }

  public setDirection(direction: IDirection): void {
    this.direction = direction;
  }

  public setRect(rect: IEntityRect): void {
    this.rect = rect;
  }

  public getRect(): IEntityRect {
    return this.rect;
  }

  public getCamp(): ICamp {
    return this.camp;
  }

  public getEntityType(): IEntityType {
    return this.type;
  }

  public getCollision() {
    return this.isCollision || !this.isDestroyed;
  }

  public getZIndex() {
    return this.zIndex;
  }
}

export default Entity;
