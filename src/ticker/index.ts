export default class Ticker implements ITicker {
  protected tick = 0;
  protected tickOut: number;
  protected callback: AnyFunction;

  constructor(tickOut: number, callback: AnyFunction) {
    this.tickOut = tickOut;
    this.callback = callback;
  }

  public update(): void {
    if (++this.tick >= this.tickOut) {
      this.callback();
    }
  }
}

export class BlinkTicker extends Ticker {
  public override update(): void {
    if (++this.tick >= this.tickOut) {
      this.callback();
      this.tick = 0;
    }
  }
}
