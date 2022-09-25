import { fixMapBirthPlace, fixMapBossPlace, getRealStage } from '../util/map-tool';
import MapData from '../config/maps';
type IPlayer = import('./player').default;

export class Game {
  private static instance: Game;
  /** 游戏是否结束 */
  private gameOver = false;
  /** 当前关卡 */
  private stage = 1;
  /** 游戏模式，单人 / 双人 */
  private mode: IGameMode = 'single';
  /** 自定义地图 */
  private customMap: IMapData | undefined = undefined;
  /** 玩家 */
  private players: IPlayer[] = [];
  /** 游戏地图 */
  private readonly map: IMapData[] = MapData;
  /** 游戏场景窗口 */
  private win?: IGameWorld;

  private constructor() {
    // this.players[0] = new Player();
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public setStage(stage: number): number {
    if (stage < 0) throw new Error('stage must greater than 0');
    return (this.stage = stage);
  }

  public nextStage(): number {
    return ++this.stage;
  }

  public getStage(): number {
    return this.stage;
  }

  public setMode(mode: IGameMode): void {
    this.mode = mode;
    import('./player').then(({ default: Player }) => {
      this.players[0] = new Player();
      if (this.mode === 'double') {
        this.players.push(new Player(true));
        this.players[0].setAlly(this.players[1]);
        this.players[1].setAlly(this.players[0]);
      }
    });
  }

  public getMode(): IGameMode {
    return this.mode;
  }

  public getPlayer(): IPlayer[] {
    return this.players;
  }

  public getMapData(): IMapData {
    let map: IMapData;
    if (this.customMap) {
      map = this.customMap;
      this.customMap = undefined;
    } else {
      map = this.map[getRealStage(this.stage - 1)];
    }
    return map;
  }

  public getGameOver(): boolean {
    return this.gameOver;
  }

  public setGameOver(): Game {
    this.gameOver = true;
    return this;
  }

  public setCustomMap(map: IMapData): Game {
    this.customMap = fixMapBossPlace(fixMapBirthPlace(map));
    return this;
  }

  public setGameWin(win: IGameWorld): Game {
    this.win = win;
    return this;
  }

  public getGameWin(): IGameWorld {
    if (!this.win) throw new Error('未初始化或未绑定窗口到游戏全局');
    return this.win;
  }

  public init(): void {
    this.stage = 1;
    this.mode = 'single';
    this.gameOver = false;
    this.customMap = undefined;
    this.players = [];
  }
}

export default Game;
