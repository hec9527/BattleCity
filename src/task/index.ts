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
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.taskList.length === 0) return;
      if (this.taskList[0].update) {
        this.taskList[0].update();
        return;
      }
      if (this.taskList[0].execute) {
        this.taskList[0].execute();
      }
    }
  }
}
