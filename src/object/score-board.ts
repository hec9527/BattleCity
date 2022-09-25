import { EnemyType } from '../config/enum';

type IKillInfo = {
  [K in EnemyType]: number;
} & { killCount: number };

class ScoreBoard {
  private score = 0;
  private killInfo!: IKillInfo;

  constructor() {
    this.resetKillInfo();
  }

  private resetKillInfo() {
    this.killInfo = {
      killCount: 0,
      [EnemyType.normal]: 0,
      [EnemyType.enhance]: 0,
      [EnemyType.fast]: 0,
      [EnemyType.armor]: 0,
    };
  }

  private getScore(): number {
    return this.score;
  }

  private setScore(score: number): void {
    this.score = score;
  }

  public scoring(tank: IEnemyTank): void {
    this.killInfo[tank.get] += 1;
  }
}
