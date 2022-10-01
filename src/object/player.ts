import AllyTank from '../entities/ally-tank';
import EVENT from '../event';

export type RoleType = keyof typeof EVENT.CONTROL;

export default class Player implements IPlayer {
  private life = 3;
  private score = 0;
  private tank: ITank | null = null;
  private roleType: RoleType;

  constructor(key: RoleType = 'P1') {
    this.roleType = key;
  }

  public getRoleType(): RoleType {
    return this.roleType;
  }

  public getScore(): number {
    return this.score;
  }

  public getTank(): ITank {
    if (!this.tank) {
      this.tank = new AllyTank();
    }
    return this.tank;
  }

  public getLife(): number {
    return this.life;
  }

  public addLife(): void {
    this.life++;
  }
}
