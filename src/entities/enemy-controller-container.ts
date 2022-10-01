export default class EnemyControllerContainer {
  private controllers: IEnemyController[] = [];

  public getAllController(): IEnemyController[] {
    return this.controllers;
  }

  public addController(controller: IEnemyController): void {
    this.controllers.push(controller);
  }

  public removeController(controller: IEnemyController): void {
    for (let i = 0; i < this.controllers.length; i++) {
      if (this.controllers[i] === controller) {
        this.controllers.splice(i, 1);
      }
    }
  }

  public update(): void {
    this.controllers.forEach(controller => controller.update());
  }
}
