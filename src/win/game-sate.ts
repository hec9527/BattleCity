import Player from '../object/player';

class GameState implements IGameState {
  private mode: IGameMode = 'single';
  private stage = 1;
  private players: IPlayer[] = [];

  public getMode() {
    return this.mode;
  }

  public setMode(mode: IGameMode): void {
    this.mode = mode;
    this.players = [new Player('P1')];
    if (mode === 'double') {
      this.players.push(new Player('P2'));
    }
  }

  public getPlayers(): IPlayer[] {
    return this.players;
  }

  public getStage(): number {
    return this.stage;
  }

  public getLoopStage(): number {
    return (this.stage % 35) + 1;
  }

  public setStage(stage: number): void {
    this.stage = stage;
  }

  public nextStage(): void {
    this.stage++;
  }
}

export default GameState;
