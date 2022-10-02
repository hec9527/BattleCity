import Tank from './tank';
import EVENT from '../event';
import Config from '../config';
import Ticker from '../ticker';
import Entity from './entity';

import { R } from '../loader';
import { randomInt, isEntityCollision } from '../util';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class Award extends Entity implements IAward {
  private static instance: Award | null = null;
  protected rect: IEntityRect;
  protected type: IEntityType = 'award';
  protected isCollision = true;

  private awardType: IAwardType;
  private status: 0 | 1 = 1;
  private surviveTicker: ITicker;
  private blinkTicker: ITicker | null = null;

  private constructor() {
    super();
    this.eventManager.addSubscriber(this, [EVENT.COLLISION.ENTITY]);

    this.awardType = randomInt(0, 6) as IAwardType;
    this.rect = Award.getRandomRect();
    this.type = 'award';

    this.surviveTicker = new Ticker(Config.ticker.award - Config.ticker.awardBlink, () => {
      this.blinkTicker = new Ticker(Config.ticker.awardBlinkFrequency, () => {
        this.status = this.status === 0 ? 1 : 0;
      });
      this.surviveTicker = new Ticker(Config.ticker.awardBlink, () => {
        this.destroy();
      });
    });
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

  protected destroy(picker?: IEntity): void {
    if (this.isDestroyed) return;
    if (picker) {
      this.eventManager.fireEvent<IAwardEvent>({ type: EVENT.AWARD.DESTROYED, award: this, picker });
    }
    Award.instance?.destroy();
    Award.instance = null;
    super.destroy();
  }

  public getAwardType(): IAwardType {
    return this.awardType;
  }

  public static getNewAward(): Award {
    if (Award.instance) {
      Award.instance.destroy();
    }
    Award.instance = new Award();
    return Award.instance;
  }

  public update(): void {
    this.surviveTicker.update();
    this.blinkTicker?.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.status) return;
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
    }
  }
}

export default Award;
