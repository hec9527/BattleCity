/**
 * 奖励类
 */

import Entity from './entity';

class Reward extends Entity {
  private static instance: Reward | undefined = undefined;

  public readonly rewardType: RewardType;

  private constructor(options: RewardOption) {
    const { world, rect } = options;
    super(world, rect);
    this.rewardType = options.rewardType;
  }

  // 单例模式
  static getNewReward() {
    //
  }

  update(): void {
    //
  }

  draw() {}
}

export default Reward;
