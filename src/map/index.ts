/**
 * 游戏地图数据
 * @author  hec9527
 */

import maps from './mapDatas';

type mapData = Array<Array<number>>;

class Maps {
  private readonly maps: mapData[] = [[], [...maps]];
  private isCustomRound = false;

  /**
   * 获取关卡数据
   *
   * 如果给出的 round 大于总关卡数，则取余数
   * @param round 关卡数
   */
  getMapData(round: number): mapData {
    return this.fixMapData(this.maps[round]);
  }

  /**
   * 设置自定义地图
   * @param mapData mapData
   */
  setCustomRound(mapData: mapData): void {
    this.isCustomRound = true;
    this.maps[0] = mapData;
  }

  /**
   * 获取自定义地图数据
   */
  getCustomMapData(): mapData | false {
    if (!this.isCustomRound) {
      return false;
    } else {
      return this.fixMapData(this.maps[0]);
    }
  }

  /**
   * 修复地图数据
   * @param mapData
   */
  private fixMapData(mapData: mapData): mapData {
    const map = mapData.concat([]);
    map[11][5] = 18;
    map[11][6] = 4;
    map[11][7] = 17;
    map[12][5] = 3;
    map[12][6] = 15; // Boss 标志
    map[12][7] = 5;
    return map;
  }
}

export default Maps;
