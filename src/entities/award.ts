import Tank from './tank';
import EVENT from '../event';
import config from '../config';
import Entity from './entity';
import DelayStatusToggle from '../object/delay-status-toggle';

import { R } from '../loader';
import { randomInt, isEntityCollision } from '../util';
import { isAwardDetectEvent } from '../object/guard';

const { paddingLeft: PL, paddingTop: PT } = config.battleField;

class Award extends Entity implements IAward {
  protected rect: IEntityRect;
  protected type: IEntityType = 'award';
  protected isCollision = false;
  protected zIndex = 4;

  private awardType: IAwardType;
  private statusToggle = new DelayStatusToggle(config.ticker.award, [1, 0], config.ticker.awardBlink, 10);

  constructor() {
    super();
    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY, EVENT.AWARD.DETECT]);

    this.awardType = randomInt(0, 6) as IAwardType;
    this.rect = Award.getRandomRect();
    this.eventManager.fireEvent({ type: EVENT.AWARD.CREATE });
  }

  private static getRandomRect(): IEntityRect {
    const x = randomInt(0, 24) * 16;
    const y = randomInt(0, 24) * 16;
    const rect: IEntityRect = [x, y, 32, 32];
    if (isEntityCollision(rect, [192, 384, 32, 32])) {
      return this.getRandomRect();
    }
    return rect;
  }

  private detectAwardRect(tanks: IEntity[]) {
    const res = tanks.some(entity => isEntityCollision(this.rect, entity.getRect()));
    if (res) {
      this.rect = Award.getRandomRect();
      this.detectAwardRect(tanks);
    }
  }

  public destroy(picker?: IEntity): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    if (picker) {
      this.eventManager.fireEvent<IAwardEvent>({ type: EVENT.AWARD.PICKED, award: this, picker });
    }
    this.eventManager.fireEvent<IAwardEvent>({ type: EVENT.AWARD.DESTROYED, award: this, picker });
    super.destroy();
  }

  public getAwardType(): IAwardType {
    return this.awardType;
  }

  public update(): void {
    this.statusToggle.update();
    if (this.statusToggle.isFinished()) {
      this.destroy();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.statusToggle.getStatus() === 0) return;
    ctx.drawImage(
      R.Image.bonus,
      this.awardType * 32,
      0,
      32,
      32,
      PL + this.rect[0],
      PT + this.rect[1],
      this.rect[2],
      this.rect[3],
    );
  }

  public notify(event: INotifyEvent<ICollisionEvent>): void {
    if (event.type === EVENT.COLLISION.ENTITY && event.entity === this && event.initiator instanceof Tank) {
      this.destroy(event.initiator);
    } else if (isAwardDetectEvent(event)) {
      const tanks = event.entities.filter(entity => ['allyTank', 'enemyTank'].includes(entity.getEntityType()));
      this.detectAwardRect(tanks);
    }
  }
}

export default Award;
