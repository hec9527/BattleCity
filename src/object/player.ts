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
  private static instance: Players;
  private playerList: PlayerList = [new Player(), undefined];

  private constructor(private num = 1) {
    if (this.num === 2) {
      this.playerList[1] = new Player();
      this.playerList[1].setAlly(this.playerList[0]);
      this.playerList[0].setAlly(this.playerList[1]);
    }
  }

  public static getInstance(num = 1): Players {
    if (num !== 1 && num !== 2) {
      throw new Error(`expected 1 or 2 player, recived ${num}`);
    }
    if (!Players.instance) {
      Players.instance = new Players(num);
    }
    return Players.instance;
  }

  public getPlayer(): PlayerList {
    return this.playerList;
  }

  public getPlayerNum(): number {
    return this.num;
  }
}
