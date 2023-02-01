export default class TaskManager {
  private taskList: ITask[] = [];

  public addTask(task: ITask): void {
    this.taskList.push(task);
  }

  public removeTask(task: ITask): void {
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i] === task) {
        this.taskList.splice(i, 1);
        break;
      }
    }
  }

  public update(): void {
    if (this.taskList.length === 0) return;

    if (this.taskList[0].update) {
      this.taskList[0].update();
      if (this.taskList[0].isFinished?.()) {
        this.taskList.shift();
      }
      return;
    }

    if (this.taskList[0].execute) {
      this.taskList[0].execute();
      this.taskList.shift();
      return;
    }
  }
}
