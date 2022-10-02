declare type IGameMode = 'single' | 'double';

declare interface IGameState {
  getMode(): IGameMode;
  setMode(mode: IGameMode): void;
  getStage(): number;
  setStage(stage: number): void;
  getGameOver(): boolean;
  setGameOver(over: boolean): void;
  getPlayers(): IPlayer[];
  nextStage(): void;
}
