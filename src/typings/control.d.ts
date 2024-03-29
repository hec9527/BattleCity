declare interface IController {
  emitControl(): void;
}

declare interface IEnemyController {
  update(): void;
  getTank(): IEnemyTank;
  setPalsy(palsy: boolean): void;
}
