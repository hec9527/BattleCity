class StatusToggle<T extends any = number> {
  private status: T[] = [];
  private toggleDuration: number;
  private loop: number;

  private finished = false;
  private loopTick = 0;
  private toggleTick = 0;
  private currentIndex = 0;

  constructor(status: T[], toggleDuration = 1, loop = Infinity) {
    this.status = status;
    this.toggleDuration = toggleDuration;
    this.loop = loop;
  }

  public refresh(): void {
    this.finished = false;
    this.loopTick = 0;
    this.toggleTick = 0;
    this.currentIndex = 0;
  }

  public update(): void {
    if (this.finished) return;
    this.toggleTick++;
    if (this.toggleTick >= this.toggleDuration) {
      this.toggleTick = 0;
      this.currentIndex++;
      if (this.currentIndex >= this.status.length - 1) {
        if (this.loop === Infinity) {
          if (this.currentIndex > this.status.length - 1) {
            this.currentIndex = 0;
          }
        } else if (this.loopTick < this.loop - 1) {
          this.loopTick++;
          if (this.currentIndex > this.status.length - 1) {
            this.currentIndex = 0;
          }
        } else {
          this.currentIndex = this.status.length - 1;
          this.finished = true;
        }
      }
    }
  }

  public getStatus(): T {
    return this.status[this.currentIndex];
  }

  public isFinished(): boolean {
    return this.finished;
  }

  public setFinished(finish: boolean): void {
    this.finished = finish;
  }
}

export default StatusToggle;
