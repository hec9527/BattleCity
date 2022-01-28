/**
 * 窗体类
 */

import { TickerList } from '../util/ticker';
import { getCanvas } from '../util';
import Config from '../config/const';
import Game from '../object/game';

let lastTick = 0;

abstract class Win implements IGameWorld {
  protected entityList = new Set<IEntity>();
  protected tickerList: TickerList = new TickerList();
  protected readonly game = Game.getInstance();
  private callbackList = new Set<() => void>();
  public canvas: IWindowCanvas;
  public ctx: IWindowCtx;

  constructor() {
    const cConf = Config.canvas;
    const bConf = Config.battleField;

    const [mainCanvas, mainCtx] = getCanvas(bConf.width, bConf.height, cConf.canvasId);
    const [fgCanvas, fgCtx] = getCanvas(cConf.width, cConf.height, cConf.foregroundId);
    const [bgCanvas, bgCtx] = getCanvas(cConf.width, cConf.height, cConf.backgroundId);

    this.canvas = { main: mainCanvas, bg: bgCanvas, fg: fgCanvas };

    this.ctx = { main: mainCtx, bg: bgCtx, fg: fgCtx };

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

  protected next(callback?: (...args: any[]) => any): void {
    this.animation = () => {
      this.clearAll();
      callback?.();
    };
  }

  private clearAll(): void {
    this.ctx.main.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.bg.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.fg.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
  }

  abstract update(): void;

  abstract draw(): void;
}

export default Win;
