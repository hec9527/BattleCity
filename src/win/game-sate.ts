import config from '../config';
import Player from '../object/player';

class GameState implements IGameState {
  private mode: IGameMode = 'single';
  private gameOver = false;
  private stage = 1;
  private players: IPlayer[] = [];

  public getGameOver(): boolean {
    return this.gameOver;
  }

  public setGameOver(over: boolean): void {
    this.gameOver = over;
  }

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
    if (this.stage > config.game.maxStage) {
      this.stage = config.game.maxStage;
    }
  }
}

export default GameState;
