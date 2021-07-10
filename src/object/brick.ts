/**
 * 砖块类
 * 泥土 1  2  3  4  5  17 18
 * 铁块 6  7  8  9  10 19 20
 * 草  11
 * 冰  12
 * 河  13  14
 * boss 15 16
 */

import Entity from './entity';

function getBrickRect(pos: IBrickOption['pos'], index: number): IEntityRect {
  let { x, y } = pos;
  let w = 32;
  let h = 32;
  if ([2, 4, 7, 9, 17, 18, 19, 20].includes(index)) {
    h = 16;
  }
  if ([3, 5, 8, 10, 17, 18, 19, 20].includes(index)) {
    w = 16;
  }
  return [x, y, w, h];
}

function getBrickType(index: number): IBrickType {
  if ([1, 2, 3, 4, 5, 17, 18].includes(index)) {
    return 'soil';
  }
  if ([6, 7, 8, 9, 10, 19, 20].includes(index)) {
    return 'iron';
  }
  if (index === 11) {
    return 'grass';
  }
  if (index === 12) {
    return 'ice';
  }
  if ([13, 14].indexOf(index)) {
    return 'river';
  }
  if ([15, 16].indexOf(index)) {
    return 'boss';
  }
  return 'blank';
}

class Brick extends Entity {
  public type: IEntityType;
  private brickType: IBrickType;

  constructor({ world, index, pos }: IBrickOption) {
    super(world, getBrickRect(pos, index));
    this.type = 'brick';

    this.brickType = getBrickType(index);
  }

  update(): void {}

  die(bullet: IBullet): void {
    bullet.level;
  }

  draw(): void {
    //
  }
}

export default Brick;
