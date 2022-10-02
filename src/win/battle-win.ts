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
import PauseFactory from '../entities/pause-factory';
import GameOverFactory from '../entities/game-over-factory';
import { R } from '../loader';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class BattleWin implements IGameWin, ISubScriber {
  private eventManager = EVENT.EM;
  private winManager: IWindowManager;
  private gameState: IGameState;
  private entityContainer = new EntityContainer();
  private pauseFactory = new PauseFactory();
  private mineTick = new MineTicker();
  private enemyCamp = new EnemyCamp();
  private allyCamp: AllyCamp;
  private defeat = false;

  private nextWinTick: ITicker | null = null;

  constructor(winManager: IWindowManager, state: IGameState) {
    R.Audio.play('start');

    // TODO mock
    state.setMode('single');
    state.setStage(4);

    this.winManager = winManager;
    this.gameState = state;
    this.enemyCamp.setEnemies(enemyForce[state.getStage()]);
    this.allyCamp = new AllyCamp(state.getPlayers(), state.getStage());

    new AwardFactory();
    new BulletFactory();
    new Curtain('open', true);
    new ScoreFactory();
    new GameOverFactory();
    new ExplosionFactory();

    BrickConstructor.buildFromMapData(MapManager.getMap(state.getStage()));
    BrickConstructor.buildBrickWall();
    BrickConstructor.buildBase();

    this.eventManager.addSubscriber(this, [
      EVENT.TANK.LAST_ENEMY_TANK_DESTROYED,
      EVENT.GAME.DEFEAT,
      EVENT.BASE.DESTROY,
      EVENT.AWARD.ALLY_PICK_BOMB,
      EVENT.AWARD.ENEMY_PICK_BOMB,
    ]);
  }

  private nextWin(): void {
    this.gameState.setGameOver(this.defeat);
    this.winManager.toSettleWin();
  }

  public update(): void {
    this.pauseFactory.update();
    if (this.pauseFactory.getPause()) return;

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
    this.pauseFactory.draw(ctx);
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
      case EVENT.GAME.DEFEAT:
      case EVENT.TANK.LAST_ENEMY_TANK_DESTROYED:
        if (!this.nextWin) {
          this.defeat = event.type !== EVENT.TANK.LAST_ENEMY_TANK_DESTROYED;
          this.nextWinTick = new Ticker(config.ticker.battleOver);
        }
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
