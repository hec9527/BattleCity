/**
 * 砖块类
 */

import Entity from './entity';

class Brick extends Entity {
  public type: IEntityType;
  constructor({ world, rect }: any) {
    super(world, rect);
    this.type = 'brick';
  }

  update(): void {
    //
  }

  draw(): void {
    //
  }
}

export default Brick;
