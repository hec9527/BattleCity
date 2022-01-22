import Brick from '../config/brick';

/**
 * 关卡为循环模式，每次超过35后从1开始循环
 * @param fakeStage 当前的关卡数
 * @returns 实际的关卡数
 */
export function getRealStage(fakeStage: number): number {
  if (fakeStage < 0) {
    throw new Error('game stage should greater or equal 0');
  }

  while (fakeStage > 35) {
    fakeStage -= 35;
  }

  return fakeStage;
}

/**
 * 敌我坦克出生点可能会被砖块覆盖，重置为空白
 * @param map 地图数据
 * @returns 修复后的地图数据
 */
export function fixMapBirthPlace(map: IMapData): IMapData {
  map[0][0] = Brick.blank;
  map[0][6] = Brick.blank;
  map[0][12] = Brick.blank;
  map[12][4] = Brick.blank;
  map[12][8] = Brick.blank;
  return map;
}

/**
 * 我方boss位置可能会被砖块覆盖，重置为boss
 * @param map 地图数据
 * @returns 修复后的地图数据
 */
export function fixMapBossPlace(map: IMapData): IMapData {
  map[12][6] = Brick.boss;
  return map;
}

/**
 * 我方boss围墙倒计时结束时闪烁，刷新状态
 * @param map 地图数据
 * @param type 围墙重置的砖块类型
 * @returns 修复后的地图数据
 */
export function fixMapWallPlace(map: IMapData, type: Brick.ice | Brick.brick): IMapData {
  map[11][5] = type === Brick.brick ? Brick.brickRightBottom : Brick.ironRightBottom;
  map[11][6] = type === Brick.brick ? Brick.brickBottom : Brick.ironBottom;
  map[11][7] = type === Brick.brick ? Brick.brickLeftBottom : Brick.ironLeftBottom;
  map[12][5] = type === Brick.brick ? Brick.brickRight : Brick.ironRight;
  map[12][7] = type === Brick.brick ? Brick.brickLeft : Brick.ironLeft;
  return map;
}

/**
 * 获取砖块位置 Rect
 * @param pos 位置 x y
 * @param index 索引
 * @returns
 */
export function getBrickRect(pos: IBrickOption['pos'], index: number): IEntityRect {
  const { x, y } = pos;
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

/**
 * 获取砖块类型
 * @param index 砖块索引
 * @returns 砖块类型
 */
export function getBrickType(index: number): IBrickType {
  if ([1, 2, 3, 4, 5, 17, 18].includes(index)) {
    return 'brick';
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
