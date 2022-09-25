/* eslint-disable prefer-const */
import Config from '../config';
import EVENT from '../event';

abstract class Entity implements IEntity, ISubScriber {
  protected abstract readonly type: IEntityType;
  // 是否参与碰撞检测
  protected abstract isCollision: boolean;
  protected readonly eventManager = EVENT.EM;
  protected readonly zIndex = 0;
  protected abstract rect: IEntityRect;
  protected camp: ICamp = 'neutral';
  protected direction: IDirection = 0;
  protected isDestroyed = false;
  protected palsy = false; // timing stop
  protected stop = true; // move stop
  protected speed = 0;
  protected moveFrequency = 1;

  private pause = false;
  private lastDirection: IDirection = 0;
  private moveTick = 0;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.GAME.PAUSE, EVENT.COLLISION.BORDER]);
    this.eventManager.fireEvent({ type: EVENT.ENTITY.CREATED, entity: this });
  }

  protected destroy(): void {
    this.isDestroyed = true;
    this.eventManager.fireEvent({ type: EVENT.ENTITY.DESTROYED, entity: this });
    this.eventManager.removeSubscriber(this);
  }

  // below methods should be overwrite be subclass
  protected preDestroy(): void {}
  protected postDestroy(): void {}
  protected postMove(): void {}
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  private turnDirection(): void {
    this.lastDirection = this.direction;
    let [x, y, w, h] = this.rect;
    if (this.direction % 2) {
      y = Math.round(y / 16) * 16;
    } else {
      x = Math.round(x / 16) * 16;
    }
    this.rect = [x, y, w, h];
  }

  private move(): void {
    if (this.speed === 0 || ++this.moveTick < this.moveFrequency) return;
    this.moveTick = 0;
    this.rect = this.getNextFrameRect();
    this.postMove();
    this.eventManager.fireEvent({ type: EVENT.ENTITY.MOVE, entity: this });
  }

  private resolveCollisionBorder(): void {
    let [x, y, w, h] = this.rect;
    const { width, height } = Config.battleField;

    if (x + w > width) {
      x = width - w;
    } else if (x < 0) {
      x = 0;
    }

    if (y + h > height) {
      y = height - h;
    } else if (y < 0) {
      y = 0;
    }
    this.rect = [x, y, w, h];
  }

  public update(): void {
    if (this.isDestroyed || this.stop || this.pause) {
      return;
    }

    if (this.lastDirection === this.direction) {
      this.move();
    } else {
      this.turnDirection();
      this.moveTick = this.moveFrequency - 1;
    }
  }

  public setStop(stop: boolean): void {
    this.stop = stop;
  }

  public getStop(): boolean {
    return this.stop;
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

  public getNextFrameRect(): IEntityRect {
    let [x, y, w, h] = this.rect;
    const directions = {
      0: () => (y -= this.speed),
      1: () => (x += this.speed),
      2: () => (y += this.speed),
      3: () => (x -= this.speed),
    };
    directions[this.direction]();
    return [x, y, w, h];
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

  public notify(event: INotifyEvent): void {
    if (event.type === EVENT.GAME.PAUSE) {
      this.pause = !this.pause;
    } else if (event.type === EVENT.COLLISION.BORDER && event.initiator === this) {
      this.resolveCollisionBorder();
    }
  }
}

export default Entity;
