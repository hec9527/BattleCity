/**
 * 游戏地图数据
 * @author  hec9527
 */

import Print from '../util/print';
import maps from './map-data';

export default class Maps {
  private static instance: Maps;
  private readonly maps: IMapData[] = [[] as unknown as IMapData, ...maps];
  private isCustomRound = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): Maps {
    if (!Maps.instance) {
      Maps.instance = new Maps();
    }
    return Maps.instance;
  }

  /**
   * 获取真实的回合数
   * - 回合数为0  --> 自定义地图
   * - 回合数<=35  --> 对应关卡
   * - 回合数>35  --> 取模
   *   -  35 --> 35
   *   -  36 --> 1
   *   -  70 --> 35
   * @param fakeRound
   */
  private getRealRound(fakeRound: number): number | never {
    const mod = fakeRound % 35;
    if (fakeRound < 0) {
      throw new Error('game round should greater or equal 0');
    }
    if (fakeRound === 0 && !this.isCustomRound) {
      throw new Error('no custom map found, edit it first!');
    }
    if (fakeRound <= 35) {
      return fakeRound;
    }
    return mod === 0 ? 35 : mod;
  }

  /**
   * ### 获取关卡数据
   * 如果给出的 round 大于总关卡数，则取余数
   * @param round 关卡数
   */
  public getMapData(round: number): IMapData | false {
    if (this.isCustomRound) {
      this.isCustomRound = false;
      return this.maps[0];
    }
    try {
      const realRound = this.getRealRound(round);
      return fixMapDataAll(this.maps[realRound]);
    } catch (error) {
      Print.error(error);
    }
    return false;
  }

  /**
   * 设置自定义地图
   * @param mapData mapData
   */
  public setCustomMap(mapData: IMapData): void | never {
    if (mapData.length !== 13) {
      throw new Error('each custom map row should have length 13');
    }
    for (let row = 0; row < 13; row++) {
      if (mapData[row].length !== 13) {
        throw new Error('each custom map col should have length 13');
      }
    }
    this.isCustomRound = true;
    this.maps[0] = mapData;
  }
}

/** 修复所有地图 */
export function fixMapDataAll(mapData: IMapData): IMapData {
  fixMapDataBirthPlace(mapData);
  fixMapDataBoss(mapData);
  fixMapDataWall(mapData);

  return mapData;
}

/** boss标志 */
export function fixMapDataBoss(mapData: IMapData): IMapData {
  mapData[12][6] = 15; // Boss 标志
  return mapData;
}

/** boss围墙重置 */
export function fixMapDataWall(mapData: IMapData, brick: 'iron' | 'brick' = 'brick'): IMapData {
  mapData[11][5] = brick === 'brick' ? 18 : 20;
  mapData[11][6] = brick === 'brick' ? 4 : 9;
  mapData[11][7] = brick === 'brick' ? 17 : 19;
  mapData[12][5] = brick === 'brick' ? 3 : 8;
  mapData[12][7] = brick === 'brick' ? 5 : 10;
  return mapData;
}

/** 出身地重置 */
export function fixMapDataBirthPlace(mapData: IMapData): IMapData {
  mapData[0][0] = 0;
  mapData[0][6] = 0;
  mapData[0][12] = 0;
  mapData[12][4] = 0;
  mapData[12][8] = 0;
  return mapData;
}
