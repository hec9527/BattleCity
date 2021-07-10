/**
 * 窗体类
 */

import { TickerList } from '@/util/ticker';
import { getCanvas } from '@/util';
import Config from '@/config/const';

let lastTick = 0;

abstract class Win implements IGameWorld {
  protected entityList = new Set<IEntity>();
  protected tickerList: TickerList = new TickerList();
  private callbackList = new Set<() => void>();
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor() {
    const { canvas, ctx } = getCanvas(Config.canvas.width, Config.canvas.height, Config.canvas.canvasId);
    this.canvas = canvas;
    this.ctx = ctx;
    // TODO fix

    (window as any).entity = this.entityList;

    // 异步执行，派生类可能还需要继续初始化属性
    setTimeout(this.animation.bind(this), 0);
  }

  public addEntity(entity: IEntity): void {
    this.entityList.add(entity);
  }

  public delEntity(entity: IEntity): void {
    this.entityList.delete(entity);
  }

  public addTicker(ticker: ITicker): void {
    this.tickerList.addTick(ticker);
  }

  public delTicker(ticker: ITicker): void {
    this.tickerList.delTick(ticker);
  }

  public beforeNextFrame(callback: () => void): void {
    this.callbackList.add(callback);
  }

  protected animation(currentTick: number): void {
    document.title = (1000 / (currentTick - lastTick)).toFixed(2);
    lastTick = currentTick;

    requestAnimationFrame(this.animation.bind(this));
    this.tickerList.updateAllTick();
    this.update();
    this.draw();
    this.callbackList.forEach(cb => cb());
    this.callbackList.clear();
  }

  protected next(): void {
    this.animation = () => {};
  }

  abstract update(): void;

  abstract draw(): void;
}

export default Win;
