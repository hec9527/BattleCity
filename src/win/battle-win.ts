import Map from '../map';
import EVENT from '../event';
import Config from '../config';
import config from '../config';
import Ticker from '../ticker';
import Curtain from '../entities/curtain';
import AllyCamp from '../entities/ally-camp';
import EnemyCamp from '../entities/enemy-camp';
import enemyForce from '../config/enemy-force';
import EntityContainer from '../entities/entity-container';
import BrickConstructor from '../entities/brick-constructor';
import BulletFactory from '../entities/bullet-factory';
import ExplosionFactory from '../entities/explosion-factory';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class BattleWin implements IGameWin, ISubScriber {
  private winManager: IWindowManager;
  private gameState: IGameState;
  private entityContainer = new EntityContainer();
  private enemyCamp = new EnemyCamp();
  private allyCamp = new AllyCamp();

  private nextWinTick: ITicker | null = null;

  constructor(winManager: IWindowManager, state: IGameState) {
    this.winManager = winManager;
    this.gameState = state;
    this.enemyCamp.setEnemies(enemyForce[state.getStage()]);
    new Curtain('open', true);
    new BulletFactory();
    new ExplosionFactory();

    state.setMode('double');
    const players = state.getPlayers();
    players.forEach(player => {
      this.allyCamp.create(player);
    });

    BrickConstructor.buildFromMapData(Map.getMap(state.getStage()));
  }

  private nextWin(): void {
    this.winManager.toSettleWin();
  }

  public update(): void {
    this.allyCamp.update();
    this.enemyCamp.update();
    this.entityContainer.update();
    this.nextWinTick?.update();
    if (this.nextWinTick?.isFinished()) {
      this.nextWin();
    }
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
    if (event.type === EVENT.TANK.ALLY_TANK_DESTROYED || event.type === EVENT.TANK.LAST_ENEMY_TANK_DESTROYED) {
      this.nextWinTick = new Ticker(config.ticker.battleOver);
    }
  }
}

export default BattleWin;
