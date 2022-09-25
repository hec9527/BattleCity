import Tank from './tank';
import { R } from '../loader';

class AllyTank extends Tank implements IAllyTank {
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect = [0, 0, 32, 32];
  protected flashTank = false;
  protected isCollision = true;

  private player: IPlayer | null = null;

  constructor() {
    super();
  }

  protected preDestroy(): void {}
  protected postDestroy(): void {}

  public setPlayer(player: IPlayer): void {
    this.player = player;
  }

  public getPlayer(): IPlayer {
    return this.player!;
  }

  public draw(): void {
    //
  }
}

export default AllyTank;
