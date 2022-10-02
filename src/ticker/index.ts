export default class Ticker implements ITicker {
  private finished = false;
  private tick = 0;
  private tickOut: number;
  private callback?: AnyFunction;

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
