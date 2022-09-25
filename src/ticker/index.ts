export default class Ticker implements ITicker {
  private finished = false;
  protected tick = 0;
  protected tickOut: number;
  protected callback?: AnyFunction;

  constructor(tickOut: number, callback?: AnyFunction) {
    this.tickOut = tickOut;
    this.callback = callback;
  }

  public update(): void {
    if (this.finished) return;

    if (++this.tick >= this.tickOut) {
      this.callback?.();
      this.finished = true;
    }
  }

  public isFinished(): boolean {
    return this.finished;
  }
}

export class BlinkTicker extends Ticker {
  public override update(): void {
    if (++this.tick >= this.tickOut) {
      this.callback?.();
      this.tick = 0;
    }
  }
}
