/**
 * 奖励类
 * 奖励类因为全局只有一个所以需要设计成单例模式
 */

import Config from '../config/const';
import { Resource } from '../loader';
import { randomInt, getRewardRect } from '../util';
import { Ticker } from '../util/ticker';
import Entity from './entity';

const R = Resource.getResource();
const PL = Config.battleField.paddingLeft;
const PT = Config.battleField.paddingTop;

class Reward extends Entity implements IReward {
  private static instance: Reward | undefined = undefined;

  private status: IRewardStatus;
  public type: IEntityType;
  public readonly rewardType: IRewardType;
  public readonly isCollision = true;

  // ticker
  private statusTicker?: ITicker;
  private survivalTicker?: ITicker;

  private constructor() {
    const rect = getRewardRect();
    super(rect);
    // TODO 测试奖励生成以及获取
    // this.rewardType = randomInt(0, 6) as IRewardType;
    this.rect = [0, 0, 32, 32];
    this.rewardType = 4 as IRewardType;
    this.type = 'reward';
    this.status = 0;

    // 奖励存在时间
    this.statusTicker = new Ticker(Config.ticker.rewardStatus, () => (this.status = this.status ? 0 : 1), true);
    this.survivalTicker = new Ticker(Config.ticker.reward, () => this.die());
    this.world.addTicker(this.survivalTicker);
    this.world.addTicker(this.statusTicker);
    console.log(this);
  }

  public static getNewReward(): Reward {
    if (Reward.instance) {
      Reward.instance.die();
    }
    Reward.instance = new Reward();
    return Reward.instance;
  }

  die(): void {
    if (this.survivalTicker?.isAlive) {
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
    this.ctx.fg.drawImage(
      R.Image.bonus,
      this.rewardType * 32,
      0,
      32,
      32,
      PL + this.rect[0],
      PT + this.rect[1],
      this.rect[2],
      this.rect[3],
    );
  }
}

export default Reward;
