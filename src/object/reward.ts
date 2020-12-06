/**
 * 奖励类
 */

import Entity from './entity';

class Reward extends Entity {
  public readonly rewardType: RewardType;

  constructor(options: RewardOption) {
    const { world, rect } = options;
    super(world, rect);
    this.rewardType = options.rewardType;
  }

  update(): void {
    //
  }

  draw() {}
}

export default Reward;
