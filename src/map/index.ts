/**
 * 游戏地图数据
 * @author  hec9527
 */

import Print from '@/util/print';
import maps from './mapDatas';

type mapData = Array<Array<number>>;

export class Maps {
  private readonly maps: mapData[] = [[], ...maps];
  private isCustomRound = false;

  /**
   * 获取真实的回合数
   * - 回合数为0  --> 自定义地图
   * - 回合数<35  --> 对应关卡
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
   * 获取关卡数据
   *
   * 如果给出的 round 大于总关卡数，则取余数
   * @param round 关卡数
   */
  public getMapData(round: number): mapData | false {
    try {
      const realRound = this.getRealRound(round);
      return this.fixMapData(this.maps[realRound]);
    } catch (error) {
      Print.error(error);
    }
    return false;
  }

  /**
   * 设置自定义地图
   * @param mapData mapData
   */
  public setCustomRound(mapData: mapData): void | never {
    if (mapData.length !== 13) {
      throw new Error('each custome map row should have length 13');
    }
    for (let row = 0; row < 13; row++) {
      if (mapData[row].length !== 13) {
        throw new Error('each custome map col should have length 13');
      }
    }
    this.isCustomRound = true;
    this.maps[0] = mapData;
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

export default new Maps();
