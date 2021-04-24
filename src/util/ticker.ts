/**
 * 计时器列表
 */
export class TickerList {
  private list: Set<Ticker> = new Set<Ticker>();

  public addTick(tick: Ticker): void {
    this.list.add(tick);
  }

  public delTick(tick: Ticker): void {
    this.list.delete(tick);
  }

  public updateAllTick(): void {
    this.list.forEach(tick => {
      tick.update();
      !tick.isAlive() && this.delTick(tick);
    });
  }

  public clearTick(): void {
    this.list.clear();
  }
}

/**
 * 计时器
 */
export class Ticker {
  private _isAlive = true;
  private tick = 0;

  constructor(
    /** 计时器经过的循环次数，非循环模式下，计时器销毁 */
    private tickout: number,
    /** 计时器经过指定次循环之后，执行的回调 */
    private callback: () => void,
    /** 是否使用循环模式，在循环模式下计时器不会被销毁，每次计时的结束都是新一轮计时的开始 */
    private cycle: boolean = false
  ) {}

  public update(): void {
    if (++this.tick >= this.tickout) {
      this.callback();
      if (this.cycle) {
        this.tick = 0;
      } else {
        this._isAlive = false;
      }
    }
  }

  public isAlive(): boolean {
    return this._isAlive;
  }
}
