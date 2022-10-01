import Map from '../map';
import EVENT from '../event';
import Config from '../config';
import Curtain from '../entities/curtain';
import EnemyCamp from '../entities/enemy-camp';
import enemyForce from '../config/enemy-force';
import EntityContainer from '../entities/entity-container';
import BrickConstructor from '../entities/brick-constructor';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class BattleWin implements IGameWin, ISubScriber {
  private winManager: IWindowManager;
  private gameState: IGameState;
  private entityContainer = new EntityContainer();
  private enemyCamp = new EnemyCamp();

  constructor(winManager: IWindowManager, state: IGameState) {
    this.winManager = winManager;
    this.gameState = state;
    this.enemyCamp.setEnemies(enemyForce[state.getStage()]);
    new Curtain('open', true);
    BrickConstructor.buildFromMapData(Map.getMap(state.getStage()));
  }

  private nextWin(): void {
    this.winManager.toSettleWin();
  }

  public update(): void {
    this.enemyCamp.update();
    this.entityContainer.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Config.colors.gray;
    ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    ctx.fillStyle = Config.colors.black;
    ctx.fillRect(PL, PT, Config.battleField.width, Config.battleField.height);
    this.entityContainer.draw(ctx);
    this.enemyCamp.draw(ctx);
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    //
  }
}

export default BattleWin;
