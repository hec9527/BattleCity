import EVENT from '../event';
import { R } from '../loader';

export type RoleType = keyof typeof EVENT.CONTROL;
export default class Player implements IPlayer {
  private life = 3;
  private score = 0;
  private tank: IAllyTank | null = null;
  private roleType: RoleType;
  private awardLife = 0;
  private killRecord = {} as IKillRecord;

  constructor(key: RoleType = 'P1') {
    this.roleType = key;
    this.resetKillRecord();
  }

  public resetKillRecord(): void {
    this.killRecord = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    };
  }

  public setKillRecord(type: IEnemyType): void {
    this.killRecord[type] = this.killRecord[type] + 1;
    this.addScore((type + 1) * 100);
  }

  public getKillRecord(): IKillRecord {
    return this.killRecord;
  }

  public getRoleType(): RoleType {
    return this.roleType;
  }

  public addScore(score: number): void {
    this.score += score;
    const awardTimes = Math.floor(this.score / 20000);
    if (awardTimes > this.awardLife) {
      this.addLife();
      this.awardLife++;
    }
    console.log(this.score);
  }

  public getScore(): number {
    return this.score;
  }

  public getTank(): IAllyTank | null {
    return this.tank;
  }

  public setTank(tank: IAllyTank | null): void {
    this.tank = tank;
  }

  public getLife(): number {
    return this.life;
  }

  public reduceLife(): void {
    this.life--;
  }

  public addLife(): void {
    this.life++;
    R.Audio.play('life');
  }
}
