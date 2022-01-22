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
  map[0][0] = Brick.block;
  map[0][6] = Brick.block;
  map[0][12] = Brick.block;
  map[12][4] = Brick.block;
  map[12][8] = Brick.block;
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
