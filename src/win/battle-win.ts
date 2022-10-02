import EVENT from '../event';
import Config from '../config';
import config from '../config';
import Ticker from '../ticker';
import MapManager from '../map';
import Curtain from '../entities/curtain';
import AllyCamp from '../entities/ally-camp';
import EnemyCamp from '../entities/enemy-camp';
import enemyForce from '../config/enemy-force';
import EntityContainer from '../entities/entity-container';
import BrickConstructor from '../entities/brick-constructor';
import BulletFactory from '../entities/bullet-factory';
import ExplosionFactory from '../entities/explosion-factory';
import ScoreFactory from '../entities/score-factory';
import AwardFactory from '../entities/award-factory';
import MineTicker from '../entities/mine-ticker';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class BattleWin implements IGameWin, ISubScriber {
  private eventManager = EVENT.EM;
  private winManager: IWindowManager;
  private gameState: IGameState;
  private entityContainer = new EntityContainer();
  private mineTick = new MineTicker();
  private enemyCamp = new EnemyCamp();
  private allyCamp: AllyCamp;

  private nextWinTick: ITicker | null = null;

  constructor(winManager: IWindowManager, state: IGameState) {
    state.setMode('double');

    this.winManager = winManager;
    this.gameState = state;
    this.enemyCamp.setEnemies(enemyForce[state.getStage()]);
    this.allyCamp = new AllyCamp(state.getPlayers(), state.getStage());

    new AwardFactory();
    new BulletFactory();
    new Curtain('open', true);
    new ScoreFactory();
    new ExplosionFactory();

    BrickConstructor.buildFromMapData(MapManager.getMap(state.getStage()));
    BrickConstructor.buildBrickWall();
    BrickConstructor.buildBase();

    this.eventManager.addSubscriber(this, [
      EVENT.TANK.LAST_ENEMY_TANK_DESTROYED,
      EVENT.BASE.DESTROY,
      EVENT.AWARD.ALLY_PICK_BOMB,
      EVENT.AWARD.ENEMY_PICK_BOMB,
    ]);
  }

  private nextWin(): void {
    this.winManager.toSettleWin();
  }

  public update(): void {
    this.mineTick.update();
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
    this.allyCamp.draw(ctx);
  }

  public destroyByEntityType(type: IEntityType) {
    this.entityContainer.getAllEntity().forEach(entity => {
      if (entity.getEntityType() === type) {
        (entity as ITank).explosion();
      }
    });
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    switch (event.type) {
      case EVENT.BASE.DESTROY:
      case EVENT.TANK.LAST_ENEMY_TANK_DESTROYED:
        this.nextWinTick = new Ticker(config.ticker.battleOver);
        break;
      case EVENT.AWARD.ALLY_PICK_BOMB:
        this.destroyByEntityType('enemyTank');
        break;
      case EVENT.AWARD.ENEMY_PICK_BOMB:
        this.destroyByEntityType('allyTank');
        break;
    }
  }
}

export default BattleWin;
