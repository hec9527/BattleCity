import StatusToggle from './status-toggle';

export default class DelayStatusToggle<T extends number = number> {
  private delay: number;
  private delayTick = 0;
  private statusToggle: StatusToggle;

  constructor(delay: number, status: T[], toggleDuration = 1, loop = Infinity) {
    this.delay = delay;
    this.statusToggle = new StatusToggle(status, toggleDuration, loop);
  }

  public update(): void {
    if (this.delayTick < this.delay) {
      this.delayTick++;
    } else {
      this.statusToggle.update();
    }
  }

  public refresh(): void {
    this.delayTick = 0;
    this.statusToggle.refresh();
  }

  public getStatus(): number {
    return this.statusToggle.getStatus();
  }

  public setFinished(finished: boolean): void {
    if (finished) {
      this.delayTick = this.delay;
      this.statusToggle.setFinished(finished);
    } else {
      this.refresh();
    }
  }

  public isFinished(): boolean {
    return this.delayTick >= this.delay && this.statusToggle.isFinished();
  }
}
