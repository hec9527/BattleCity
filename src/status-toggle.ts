class StatusToggle<T extends any = number> {
  private status: T[] = [];
  private toggleDuration: number;
  private loop: boolean;

  private currentIndex = 0;
  private finished = false;
  private toggleTick = 0;

  constructor(status: T[], toggleDuration = 1, loop = false) {
    this.status = status;
    this.toggleDuration = toggleDuration;
    this.loop = loop;
  }

  public refresh(): void {
    this.toggleTick = 0;
    this.currentIndex = 0;
  }

  public update(): void {
    if (this.finished) return;
    this.toggleTick++;
    if (this.toggleTick >= this.toggleDuration) {
      this.toggleTick = 0;
      this.currentIndex++;
      if (this.currentIndex >= this.status.length) {
        if (this.loop) {
          this.currentIndex = 0;
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
}

export default StatusToggle;
