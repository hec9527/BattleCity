import EVENT from '../event';
import Ticker from '../ticker';
import Config from '../config';
import Curtain from '../entities/curtain';
import EntityContainer from '../entities/entity-container';

const { UP, DOWN, A, B, START } = EVENT.CONTROL.P1;

class StageWin implements IGameWin, ISubScriber {
  private eventManager = EVENT.EM;
  private winManager: IWindowManager;
  private stage = 1;
  private minStage = 1;
  private maxStage = 50;
  private entityContainer = new EntityContainer();
  private startDelayTicker: ITicker | null = null;

  constructor(winManager: IWindowManager) {
    this.winManager = winManager;
    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS]);
    new Curtain('close', true);
  }

  private nextWin(): void {
    if (this.startDelayTicker) return;

    this.startDelayTicker = new Ticker(Config.ticker.startDelay, () => {
      this.winManager.setStage(this.stage);
      this.winManager.toBattleWin();
    });
  }

  private nextStage(): void {
    if (++this.stage > this.maxStage) {
      this.stage = this.maxStage;
    }
  }

  private preStage(): void {
    if (--this.stage < this.minStage) {
      this.stage = this.minStage;
    }
  }

  public update(): void {
    this.entityContainer.update();
    this.startDelayTicker?.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.entityContainer.getAllEntity().length > 0) {
      this.entityContainer.draw(ctx);
    } else {
      ctx.fillStyle = Config.colors.gray;
      ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
      ctx.fillStyle = Config.colors.black;
      ctx.font = '16px prestart';
      ctx.fillText(`STAGE  ${this.stage}`, 190, 228);
    }
  }

  notify(event: IControllerEvent): void {
    if (this.entityContainer.getAllEntity().length > 0) return;

    switch (event.key) {
      case UP:
        this.nextStage();
        break;
      case DOWN:
        this.preStage();
        break;
      case A:
      case B:
      case START:
        this.nextWin();
        break;
      default:
        break;
    }
  }
}

export default StageWin;
