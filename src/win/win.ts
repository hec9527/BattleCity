/**
 * 窗体类
 */

import { TickerList } from '@/util/ticker';
import { getCanvas } from '@/util';
import Config from '@/config/const';

abstract class Win implements IGameWorld {
  protected entity = new Set<IEntity>();
  protected tickerList: TickerList = new TickerList();
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor() {
    const { canvas, ctx } = getCanvas(Config.canvas.width, Config.canvas.height, Config.canvas.canvasId);
    this.canvas = canvas;
    this.ctx = ctx;

    // 异步执行，派生类可能还需要继续初始化属性
    setTimeout(() => this.animation(), 0);
  }

  public addEntity(entity: IEntity): void {
    this.entity.add(entity);
  }

  public delEntity(entity: IEntity): void {
    this.entity.delete(entity);
  }

  protected animation(): void {
    requestAnimationFrame(() => this.animation());
    this.tickerList.updateAllTick();
    this.update();
    this.draw();
  }

  protected next(): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.animation = () => {};
  }

  abstract update(): void;

  abstract draw(): void;
}

export default Win;
