import config from '../config';
import Ticker from '../object/ticker';
import { R } from '../loader';

export default class ScorePoint {
  private enemyType: IEnemyType = 0;
  private finished = false;
  private showPoint = false;
  private currentNum = 0;
  private killNum1: number;
  private killNum2: number | undefined;
  private maxKillNum: number;
  private top: number;
  private ticker: ITicker | undefined;

  constructor(enemyType: IEnemyType, top: number, player1: IPlayer, plater2?: IPlayer) {
    this.top = top + 8;
    this.enemyType = enemyType;
    this.killNum1 = player1.getKillRecord()[enemyType];
    this.killNum2 = plater2?.getKillRecord()[enemyType];
    this.maxKillNum = plater2 === undefined ? this.killNum1 : Math.max(this.killNum1, this.killNum2!);
  }

  public isFinished(): boolean {
    return this.finished;
  }

  public setShow(show: boolean): void {
    this.showPoint = show;
  }

  public getShow(): boolean {
    return this.showPoint;
  }

  public update(): void {
    if (this.finished) return;
    if (!this.ticker || this.ticker.isFinished()) {
      if (this.currentNum < this.maxKillNum) {
        this.currentNum++;
        R.Audio.play('count');
        this.ticker = new Ticker(10);
      } else {
        this.finished = true;
      }
    } else {
      this.ticker.update();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = config.colors.white;
    ctx.textAlign = 'right';
    ctx.font = '16px prestart';
    ctx.textBaseline = 'top';
    ctx.fillText('PTS', 172, this.top);
    ctx.drawImage(R.Image.tool, 96, 0, 16, 16, 222, this.top, 16, 16);
    ctx.drawImage(R.Image.enemyTank, this.enemyType * 64, 0, 32, 32, 245, this.top - 8, 32, 32);
    if (this.showPoint) {
      const num = Math.min(this.killNum1, this.currentNum);
      ctx.fillText(String((this.enemyType + 1) * 100 * num), 110, this.top);
      ctx.fillText(String(num), 220, this.top);
    }

    if (this.killNum2 !== undefined) {
      ctx.textAlign = 'left';
      ctx.drawImage(R.Image.tool, 114, 0, 16, 16, 280, this.top, 16, 16);
      ctx.fillText('PTS', 360, this.top);

      if (this.showPoint) {
        const num = Math.min(this.killNum2, this.currentNum);
        ctx.fillText(String(num), 300, this.top);
        ctx.fillText(String((this.enemyType + 1) * 100 * num), 422, this.top);
      }
    }
    ctx.restore();
  }
}
