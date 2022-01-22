type AllyTank = import('../entities/tank-ally').default;
type EnemyTank = import('../entities/tank-enemy').default;

export default class Player {
  private ally: Player | null;
  private tank: AllyTank | null;
  private life: number;
  /** 当前分数 */
  private score = 0;
  /** 上次获取奖励的分数 */
  private lastScore = 0;

  constructor(private deputy: boolean = false) {
    this.life = 3;
    this.tank = null;
    this.ally = null;
  }

  // public addScore(tank: EnemyTank): void {
  //   tank.score
  // }

  public getLife(): number {
    return this.life;
  }

  public getTank(): AllyTank | null {
    return this.tank;
  }

  public setAlly(ally: Player): Player {
    this.ally = ally;
    return this;
  }

  public setTank(tank: AllyTank | null): Player {
    this.tank = tank;
    return this;
  }

  public addLife(): Player {
    ++this.life;
    return this;
  }

  public stealLife(): boolean {
    if (this.life <= 0 && this.ally?.life && this.ally.life >= 2) {
      this.ally.life--;
      this.life++;
      return true;
    }
    return false;
  }

  public newLife(): boolean {
    if (this.life > 1) {
      this.life--;
      return true;
    }
    return false;
  }
}
