import Player from '../object/player';

class GameState implements IGameState {
  private mode: IGameMode = 'single';
  private stage = 0;
  private player: IPlayer[] = [];

  public getMode() {
    return this.mode;
  }

  public setMode(mode: IGameMode): void {
    this.mode = mode;
    this.player = [new Player('P1')];
    if (mode === 'double') {
      this.player.push(new Player('P2'));
    }
  }

  public getStage(): number {
    return this.stage;
  }

  public setStage(stage: number): void {
    this.stage = stage;
  }

  public nextStage(): void {
    this.stage++;
  }
}

export default GameState;
