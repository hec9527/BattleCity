import EVENT from '../event';
import Config from '../config';
import GameState from './game-sate';
import { getCanvas } from '../util';

import BattleWin from './battle-win';
import ConstructionWin from './construction-win';
import OverWin from './over-win';
import MenuWin from './menu-win';
import SettleWin from './settle-win';
import StageWin from './stage-win';

class WindowManager implements IWindowManager {
  protected eventManager = EVENT.EM;

  private gameWin!: IGameWin;
  private ctx: CanvasRenderingContext2D;
  private state = new GameState();

  constructor() {
    const [, ctx] = getCanvas(Config.canvas.width, Config.canvas.height, Config.canvas.id);
    this.ctx = ctx;

    // this.toConstructWin();
    this.toMenuWin();
    // this.toStageWin();
    // this.toBattleWin();
    // this.toSettleWin();
    // this.toGameOverWin();
  }

  public setStage(stage: number): void {
    this.state.setStage(stage);
  }

  public getStage(): number {
    return this.state.getStage();
  }

  public setGameMode(mode: IGameMode): void {
    this.state.setMode(mode);
  }

  public getGameMode(): IGameMode {
    return this.state.getMode();
  }

  public toBattleWin(): void {
    this.eventManager.removeAllSubscribers();
    this.gameWin = new BattleWin(this, this.state);
    console.debug(this.gameWin);
  }

  public toConstructWin(): void {
    this.eventManager.removeAllSubscribers();
    this.gameWin = new ConstructionWin(this);
  }

  public toOverWin(): void {
    this.eventManager.removeAllSubscribers();
    this.gameWin = new OverWin(this);
  }

  public toMenuWin(): void {
    this.eventManager.removeAllSubscribers();
    this.gameWin = new MenuWin(this);
  }

  public toSettleWin(): void {
    this.eventManager.removeAllSubscribers();
    this.gameWin = new SettleWin(this, this.state);
  }

  public toStageWin(): void {
    this.eventManager.removeAllSubscribers();
    this.gameWin = new StageWin(this);
  }

  public update(): void {
    this.gameWin.update();
  }

  public draw(): void {
    this.gameWin.draw(this.ctx);
  }
}

export default WindowManager;
