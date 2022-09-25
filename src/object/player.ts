import AllyTank from '../entities/ally-tank';
import EVENT from '../event';

export type ControlType = keyof typeof EVENT.CONTROL;

export default class Player implements IPlayer {
  private life = 3;
  private score = 0;
  private tank: ITank | null = null;
  private control: ControlType;

  constructor(key: ControlType) {
    this.control = key;
  }

  public getControl(): ControlType {
    return this.control;
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
