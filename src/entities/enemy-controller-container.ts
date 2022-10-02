import EVENT from '../event';

export default class EnemyControllerContainer implements ISubScriber {
  private palsy = false;
  private eventManager = EVENT.EM;
  private controllers: IEnemyController[] = [];

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.MINE.ENEMY_OVER, EVENT.AWARD.ALLY_PICK_MINE]);
  }

  private setPalsy(palsy: boolean): void {
    this.palsy = palsy;
    this.controllers.forEach(controller => {
      controller.setPalsy(palsy);
      controller.getTank().setStop(palsy);
    });
  }

  public getAllController(): IEnemyController[] {
    return this.controllers;
  }

  public addController(controller: IEnemyController): void {
    this.controllers.push(controller);
    this.setPalsy(this.palsy);
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

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (event.type === EVENT.AWARD.ALLY_PICK_MINE) {
      this.setPalsy(true);
    } else if (event.type === EVENT.MINE.ENEMY_OVER) {
      this.setPalsy(false);
    }
  }
}
