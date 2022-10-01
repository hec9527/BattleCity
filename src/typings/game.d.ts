declare type IGameMode = 'single' | 'double';

declare interface IGameState {
  getMode(): IGameMode;
  setMode(mode: IGameMode): void;
  getStage(): number;
  getPlayers(): IPlayer[];
  setStage(stage: number): void;
  nextStage(): void;
}
