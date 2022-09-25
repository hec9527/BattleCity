declare type IGameMode = 'single' | 'double';

declare interface IGameState {
  getMode(): IGameMode;
  setMode(mode: IGameMode): void;
  getStage(): number;
  setStage(stage: number): void;
  nextStage(): void;
}
