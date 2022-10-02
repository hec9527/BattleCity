import Entity from './entity';
import config from '../config';
import Ticker from '../ticker';

import { R } from '../loader';

export type IScoreValue = 1 | 2 | 3 | 4 | 5;

const { paddingLeft: PL, paddingTop: PT } = config.battleField;

export default class Score extends Entity {
  protected type: IEntityType = 'score';
  protected isCollision = false;
  protected rect: IEntityRect;
  protected zIndex = 3;

  private ticker = new Ticker(config.ticker.score);
  private value: 1 | 2 | 3 | 4 | 5;

  constructor(rect: IEntityRect, value: IScoreValue) {
    super();
    this.rect = rect;
    this.value = value;
  }

  public update(): void {
    this.ticker.update();
    if (this.ticker.isFinished()) {
      this.destroy();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.rect;
    ctx.drawImage(R.Image.bonus, (this.value - 1) * 32, 32, 32, 32, x + PL, y + PT, w, h);
  }
}
