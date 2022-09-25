class BattleWin implements IGameWin {
  private winManager: IWindowManager;

  constructor(winManager: IWindowManager) {
    this.winManager = winManager;
  }

  public update(): void {}

  public draw(ctx: CanvasRenderingContext2D): void {}
}

export default BattleWin;
