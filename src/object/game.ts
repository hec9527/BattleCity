/**
 * 游戏参数
 *  单例模式
 */

export class Game {
  private static instance: Game;
  /** 当前关卡 */
  public stage: number;
  /** 最小关卡 */
  public minStage = 1;
  /** 最大关卡 */
  public maxStage = 256;
  /** 游戏模式，单人 / 双人 */
  public mode: IGameMode;
  /** 自定义地图 */
  public isCustomed: boolean;

  private constructor() {
    this.stage = 1;
    this.mode = 'single';
    this.isCustomed = false;
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public init(): void {
    Game.instance = new Game();
  }
}

export default Game;
