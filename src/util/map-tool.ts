import Brick, { brickType, ironType, riverType } from '../config/brick';

/**
 * 获取砖块类型
 * @param index 砖块索引
 * @returns 砖块类型
 */
export function getBrickType(index: number): IBrickType {
  if (brickType.includes(index)) {
    return 'brick';
  }
  if (ironType.includes(index)) {
    return 'iron';
  }
  if (index === Brick.grass) {
    /** 草 */
    return 'grass';
  }
  if (index === Brick.ice) {
    /** 冰 */
    return 'ice';
  }
  if (riverType.includes(index)) {
    return 'river';
  }
  return 'blank';
}
