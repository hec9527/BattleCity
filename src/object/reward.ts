/**
 * 奖励类
 * 奖励类因为全局只有一个所以需要设计成单例模式
 */

import Entity from './entity';

class Reward extends Entity {
  private static instance: Reward | undefined = undefined;

  public readonly rewardType: IRewardType;

  private constructor(options: any) {
    const { world, rect } = options;
    super(world, rect);
    this.rewardType = options.rewardType;
  }

  static getNewReward() {
    //
  }

  update(): void {
    //
  }

  draw() {}
}

export default Reward;
