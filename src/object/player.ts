type AllyTank = import('../entities/tank-ally').default;
export type PlayerList = [Player, Player] | [Player, undefined];

class Player {
  private ally: Player | null;
  private tank: AllyTank | null;
  private life: number;

  constructor() {
    this.life = 3;
    this.tank = null;
    this.ally = null;
  }

  public getLife() {
    return this.life;
  }

  public getTank() {
    return this.tank;
  }

  public setAlly(ally: Player) {
    this.ally = ally;
  }

  public setTank(tank: AllyTank | null) {
    this.tank = tank;
  }

  public addLife() {
    return ++this.life;
  }

  public stealLife() {
    if (this.life <= 0 && this.ally?.life && this.ally.life >= 2) {
      this.ally.life--;
      this.life++;
      return true;
    }
    return false;
  }

  public newLife() {
    if (this.life > 1) {
      this.life--;
      return true;
    }
    return false;
  }
}

export default class Players {
  private playerList: PlayerList = [new Player(), undefined];

  public constructor(private num: 1 | 2 = 1) {
    if (this.num === 2) {
      this.playerList[1] = new Player();
      this.playerList[1].setAlly(this.playerList[0]);
      this.playerList[0].setAlly(this.playerList[1]);
    }
  }

  public getPlayer(): PlayerList {
    return this.playerList;
  }

  public getPlayerNum(): number {
    return this.num;
  }
}
