import config from '../config';
import ScorePoint from '../entities/score-point';
import TaskManager from '../task';
import { Delay } from '../delay';
import { R } from '../loader';

class SettleWin implements IGameWin {
  private winManager: IWindowManager;
  private state: IGameState;
  private tasks = new TaskManager();
  private scorePoint1: ScorePoint;
  private scorePoint2: ScorePoint;
  private scorePoint3: ScorePoint;
  private scorePoint4: ScorePoint;
  private showTotal = false;

  constructor(winManager: IWindowManager, state: IGameState) {
    const self = this;

    // ========= mock =========
    // state.setMode('double');
    const [P1, P2] = state.getPlayers();

    // for (let i = 0; i < 3; i++) {
    //   P1.setKillRecord(0);
    //   P2.setKillRecord(0);
    // }
    // for (let i = 0; i < 5; i++) {
    //   P1.setKillRecord(1);
    // }
    // for (let i = 0; i < 8; i++) {
    //   P2.setKillRecord(2);
    // }
    // for (let i = 0; i < 4; i++) {
    //   P1.setKillRecord(3);
    // }

    this.winManager = winManager;
    this.state = state;

    this.scorePoint1 = new ScorePoint(0, 184, P1, P2);
    this.scorePoint2 = new ScorePoint(1, 224, P1, P2);
    this.scorePoint3 = new ScorePoint(2, 264, P1, P2);
    this.scorePoint4 = new ScorePoint(3, 304, P1, P2);

    this.tasks.addTask(new Delay(30));

    [this.scorePoint1, this.scorePoint2, this.scorePoint3, this.scorePoint4].forEach(point => {
      this.tasks.addTask({
        update() {
          point.setShow(true);
          point.update();
          point.isFinished() && self.tasks.removeTask(this);
        },
      });
      this.tasks.addTask(new Delay(15));
    });

    this.tasks.addTask({
      execute() {
        self.showTotal = true;
      },
    });

    this.tasks.addTask(new Delay(15));

    this.tasks.addTask({
      execute() {
        if (self.state.getMode() === 'single') return;
        if (P1.getTotalKill() > P2.getTotalKill()) {
          R.Audio.play('misc');
          P1.addScore(1000);
        } else if (P1.getTotalKill() < P2.getTotalKill()) {
          R.Audio.play('misc');
          P2.addScore(1000);
        }
      },
    });

    this.tasks.addTask(new Delay(30));

    if (!this.state.getGameOver()) {
      this.tasks.addTask({
        execute() {
          R.Audio.play('start');
        },
      });
    }
    this.tasks.addTask(new Delay(90));
    this.tasks.addTask({ execute: () => this.nextWindow() });
  }

  private nextWindow(): void {
    if (this.state.getGameOver()) {
      // this.winManager.toGameOverWin();
      // TODO 完成gameOverWin后替换
      this.winManager.toMenuWin();
    } else {
      this.state.nextStage();
      this.winManager.toBattleWin();
    }
  }

  public update(): void {
    this.tasks.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = config.colors.black;
    ctx.fillRect(0, 0, config.canvas.width, config.canvas.height);

    // top hi-score
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = '16px prestart';
    ctx.fillStyle = config.colors.brick_red;
    ctx.fillText('HI-SCORE', 100, 37);
    ctx.textAlign = 'right';
    ctx.fillStyle = config.colors.yellow;
    ctx.fillText('20000', 374, 37);

    // score
    ctx.textAlign = 'right';
    ctx.fillText(this.state.getPlayers()[0].getScore().toString(), 174, 148);
    if (this.state.getMode() === 'double') {
      ctx.fillText(this.state.getPlayers()[1].getScore().toString(), 423, 148);
    }

    // stage
    ctx.fillStyle = config.colors.white;
    ctx.textAlign = 'left';
    ctx.fillText('STAGE', 189, 78);
    ctx.textAlign = 'right';
    ctx.fillText(this.state.getStage().toString(), 325, 78);

    // players
    ctx.fillStyle = config.colors.brick_red;
    ctx.textAlign = 'left';
    ctx.fillText('1-PLAYER', 44, 116);
    if (this.state.getMode() === 'double') {
      ctx.fillText('2-PLATER', 360, 116);
    }

    // bottom line
    ctx.strokeStyle = config.colors.white;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(173, 347);
    ctx.lineTo(341, 347);
    ctx.stroke();

    // kill score
    this.scorePoint1.draw(ctx);
    this.scorePoint2.draw(ctx);
    this.scorePoint3.draw(ctx);
    this.scorePoint4.draw(ctx);

    // total flag
    ctx.fillStyle = config.colors.white;
    ctx.fillText('TOTAL', 83, 365);
    ctx.textAlign = 'right';
    if (this.showTotal) {
      ctx.fillText(this.state.getPlayers()[0].getTotalKill().toString(), 220, 365);
    }

    if (this.state.getMode() === 'double') {
      ctx.textAlign = 'left';
      ctx.fillText('TOTAL', 358, 365);
      if (this.showTotal) {
        ctx.fillText(this.state.getPlayers()[1].getTotalKill().toString(), 300, 365);
      }
    }

    ctx.restore();
  }
}

export default SettleWin;
