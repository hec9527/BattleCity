/**
 * 我方坦克类
 */

import Tank from './tank';

class AllyTank extends Tank {
  constructor(options: TankOption) {
    super(options);
  }

  changeImg(): void {
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

  public update(): void {
    //
  }
}

export default AllyTank;
