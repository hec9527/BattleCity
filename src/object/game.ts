/**
 * 游戏对象，保存游戏运行时变化的数据
 *  单例模式
 */

import Players from './player';
import { fixMapBirthPlace, fixMapBossPlace, getRealStage } from '../util/map-tool';

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
  private players!: Players;
  /** 游戏地图 */
  private readonly map: IMapData[] = [];

  private constructor() {}

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public initPlayers(num: 1 | 2): Game {
    this.mode = num === 1 ? 'single' : 'double';
    this.players = new Players(num);
    return this;
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

  public getMode(): IGameMode {
    return this.mode;
  }

  public getPlayer(): Players {
    return this.players;
  }

  public getMapData(): IMapData {
    let map: IMapData;
    if (this.customMap) {
      map = this.customMap;
      this.customMap = undefined;
    } else {
      map = this.map[getRealStage(this.stage)];
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

  public init(): void {
    this.stage = 1;
    this.mode = 'single';
    this.gameOver = false;
    this.customMap = undefined;
  }
}

export default Game;
