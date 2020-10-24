/**
 * 奖励类
 */

import Entity from './entity';

class Reward extends Entity {
  public readonly rewardType: RewardType;

  constructor(options: RewardOption) {
    const { world, rect, img } = options;
    super(world, rect, img);
    this.rewardType = options.rewardType;
  }

  changeImg(): void {
    //
  }

  update(): void {
    //
  }
}

export default Reward;
