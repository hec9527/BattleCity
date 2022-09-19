import Tank from './tank';
import Game from '../object/game';
import { Resource } from '../loader';

const G = Game.getInstance();
const R = Resource.getResource();

class AllyTank extends Tank {
  protected type: IEntityType = 'allyTank';
  protected rect: IEntityRect = [0, 0, 32, 32];
  protected flashTank = false;
  protected isCollision = true;

  constructor() {
    super();
  }

  protected preDestroy(): void {}
  protected postDestroy(): void {}

  public draw(): void {
    //
  }
}

export default AllyTank;
