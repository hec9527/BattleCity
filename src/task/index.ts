export default class TaskManager {
  private taskList = new Set();

  public addTask(task: ITask): void {
    this.taskList.add(task);
  }

  public removeTask(task: ITask): void {
    this.taskList.delete(task);
  }

  public update(): void {
    if (this.taskList.size > 0) {
      //
    }
  }
}
