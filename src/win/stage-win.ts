import { Config } from '../config';
import TaskManager from '../task';
import EVENT from '../event';
import Ticker from '../ticker';

const { UP, DOWN, A, B, START } = EVENT.CONTROL.P1;

class StageWin implements IGameWin, ISubScriber {
  private eventManager = EVENT.EM;
  private winManager: IWindowManager;
  private stage = 1;
  private minStage = 1;
  private maxStage = 50;
  private curtainH = 0;
  private speed = 15;
  private status: 'closing' | 'select' = 'closing';
  private taskManager = new TaskManager();
  private stageChangeTick: ITicker | null = null;

  constructor(winManager: IWindowManager) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.winManager = winManager;

    this.taskManager.addTask({
      update: function () {
        if (self.curtainH < Config.canvas.height / 2) {
          self.curtainH += self.speed;
        } else {
          self.status = 'select';
          self.taskManager.removeTask(this);
        }
      },
    });

    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS]);
  }

  private nextWin(): void {
    this.winManager.setStage(this.stage);
    this.winManager.toBattleWin();
  }

  private nextStage(): void {
    this.stageChangeTick = new Ticker(Config.ticker.stageChange);
    if (++this.stage > this.maxStage) {
      this.stage = this.maxStage;
    }
  }

  private preStage(): void {
    this.stageChangeTick = new Ticker(Config.ticker.stageChange);
    if (--this.stage < this.minStage) {
      this.stage = this.minStage;
    }
  }

  public update(): void {
    this.taskManager.update();
    this.stageChangeTick?.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.status === 'closing') {
      ctx.fillStyle = Config.colors.black;
      ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
      ctx.fillStyle = Config.colors.gray;
      ctx.fillRect(0, 0, Config.canvas.width, this.curtainH);
      ctx.fillRect(0, Config.canvas.height - this.curtainH, Config.canvas.width, this.curtainH);
    } else {
      ctx.fillStyle = Config.colors.gray;
      ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
      ctx.fillStyle = Config.colors.black;
      ctx.font = '16px prestart';
      ctx.fillText(`STAGE  ${this.stage}`, 190, 228);
    }
  }

  notify(event: IControllerEvent): void {
    if (this.status === 'closing') return;
    if (this.stageChangeTick && !this.stageChangeTick.isFinished()) return;

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
