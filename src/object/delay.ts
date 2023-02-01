export class Delay implements ITicker {
  private tick = 0;
  private count = 0;
  private finish = false;

  constructor(count = 0) {
    this.count = count;
  }

  public update(): void {
    this.tick++;
    if (this.tick > this.count) {
      this.finish = true;
    }
  }

  public isFinished(): boolean {
    return this.finish;
  }
}
