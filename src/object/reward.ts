/**
 * 奖励类
 * 奖励类因为全局只有一个所以需要设计成单例模式
 */

import Config from '@/config/const';
import { Resource } from '@/loader';
import { isEntityCollision, randomInt } from '@/util';
import { Ticker } from '@/util/ticker';
import Entity from './entity';

const R = Resource.getResource();
const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

class Reward extends Entity implements IReward {
  private static instance: Reward | undefined = undefined;
  private status: IRewardStatus;
  public type: IEntityType;
  public readonly rewardType: IRewardType;

  // ticker
  private statusTicker?: ITicker;
  private survivalTicker?: ITicker;

  private constructor({ world }: IRewardOption) {
    const rect = getRewardRect();
    super(world, rect);
    this.rewardType = randomInt(0, 5) as IRewardType;
    this.type = 'reward';
    this.status = 0;

    // 奖励存在时间
    this.statusTicker = new Ticker(Config.ticker.rewardStatus, () => (this.status = this.status ? 0 : 1), true);
    this.survivalTicker = new Ticker(Config.ticker.reward, () => this.die());
    this.world.addTicker(this.survivalTicker);
    this.world.addTicker(this.statusTicker);
    console.log(this);
  }

  public static getNewReward(option: IRewardOption): Reward {
    this.instance?.die();
    return (this.instance = new Reward(option));
  }

  die(): void {
    if (this.survivalTicker) {
      this.world.delTicker(this.statusTicker!);
      this.world.delTicker(this.survivalTicker);
      this.statusTicker = undefined;
      this.survivalTicker = undefined;
    }
    Reward.instance = undefined;
    super.die();
  }

  update(): void {}

  draw(): void {
    if (this.status === 0) return;
    // 保证 reward 不会被其它实体掩盖，在这一帧最后绘制
    this.world.beforeNextFrame(() => {
      this.ctx.drawImage(
        R.Image.bonus,
        this.rewardType * 32,
        0,
        32,
        32,
        PL + this.rect[0],
        PT + this.rect[1],
        this.rect[2],
        this.rect[3]
      );
    });
  }
}

export default Reward;

function getRewardRect(): IEntityRect {
  const x = randomInt(0, 24) * 16;
  const y = randomInt(0, 24) * 16;
  const rect: IEntityRect = [x, y, 32, 32];
  if (isEntityCollision(rect, [192, 384, 32, 32])) {
    return getRewardRect();
  }
  return rect;
}
