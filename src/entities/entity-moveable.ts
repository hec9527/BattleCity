/* eslint-disable prefer-const */
import EVENT from '../event';
import Entity from './entity';
import Config from '../config';
import { isCollisionEvent } from '../object/guard';

export default abstract class EntityMoveable extends Entity implements IEntityMoveable {
  protected speed = 0;
  protected moveFrequency = 1;
  protected stop = true;
  protected pause = false;

  private lastDirection: IDirection = 0;
  private lastRect: IEntityRect;
  private moveTick = 0;

  constructor() {
    super();
    this.eventManager.addSubscriber(this, [EVENT.COLLISION.BORDER, EVENT.GAME.PAUSE]);
    this.lastRect = this.getRect();
  }

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

  public getLastDirection(): IDirection {
    return this.lastDirection;
  }

  public getLastRect(): IEntityRect {
    return this.lastRect;
  }

  protected move(): void {
    if (this.speed === 0 || ++this.moveTick < this.moveFrequency || this.pause) return;
    this.moveTick = 0;
    this.lastRect = this.rect;
    this.rect = this.getNextFrameRect();
    this.eventManager.fireEvent({ type: EVENT.ENTITY.MOVE, entity: this });
    this.postMove();
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

  public setStop(stop: boolean): void {
    this.stop = stop;
  }

  public getStop(): boolean {
    return this.stop;
  }

  public update(): void {
    if (this.isDestroyed || this.stop) {
      return;
    }

    if (this.lastDirection === this.direction) {
      this.move();
    } else {
      this.turnDirection();
      this.moveTick = this.moveFrequency - 1;
    }
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (event.type === EVENT.GAME.PAUSE) {
      this.pause = !this.pause;
    } else if (isCollisionEvent(event) && event.type === EVENT.COLLISION.BORDER && event.initiator === this) {
      this.resolveCollisionBorder();
    }
  }
}
