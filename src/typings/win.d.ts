interface IGameWin {
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface IWindowManager extends IGameWin {
  toMenuWin(): void;
  toConstructWin(): void;
  toStageWin(): void;
  toBattleWin(): void;
  toOverWin(): void;
  toSettleWin(): void;
  setGameMode(mode: IGameMode): void;
  getGameMode(): IGameMode;
  setStage(stage: number): void;
  getStage(): number;
}
