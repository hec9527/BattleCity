/**
 * 我方坦克类
 */

import Tank from './tank';

interface IAllyTankOption {
  world: GameWorld;
  isDeputy: boolean;
}

const BIRTH_POS = [
  [128, 0, 32, 32],
  [192, 0, 32, 32],
] as EntityRect[];

class AllyTank extends Tank {
  constructor(options: IAllyTankOption) {
    super({ world: options.world, rect: BIRTH_POS[options.isDeputy ? 1 : 0], direction: 0 });
  }

  move() {
    //
  }

  protected getReward(): void {
    //
  }

  protected addLife(): void {
    //
  }

  protected upGrade(): void {
    //
  }

  public update(): void {}
}

export default AllyTank;
