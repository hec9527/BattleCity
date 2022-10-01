import { data, template } from './data';

type IPlace = { [K in number]: number[] };

const birthPlace: IPlace = {
  0: [0, 6, 12],
  12: [4, 8],
};

const brickWall = [
  [11, 5],
  [11, 6],
  [11, 7],
  [12, 5],
  [12, 6],
  [12, 7],
] as [number, number][];

class MapManager {
  private mapData = data;
  private customMap: IMapData | null = null;

  private static clearBrickWall(map: IMapData): void {
    // map[11][5] = 18;
    // map[11][6] = 4;
    // map[11][7] = 17;
    // map[12][5] = 3;
    // map[12][6] = 15;
    // map[12][7] = 5;
    brickWall.forEach(([row, col]) => (map[row][col] = 0));
  }

  private static clearBirthPlace(map: IMapData): void {
    for (const row in birthPlace) {
      for (const cow of birthPlace[row]) {
        map[row][cow] = 0;
      }
    }
  }

  static fixMapData(map: IMapData): IMapData {
    this.clearBrickWall(map);
    this.clearBirthPlace(map);
    return map;
  }

  public setCustomMap(map: IMapData): void {
    this.customMap = map;
    const s = map.map(m => m.join(',')).join('], [');
    console.log(`[[${s}]]`);
    console.log(this.customMap);
  }

  public getTemplateMap(): IMapData {
    return template;
  }

  public getCustomMap(): IMapData | null {
    return this.customMap;
  }

  public getMap(stage: number): IMapData {
    let map: IMapData;
    if (this.customMap) {
      map = this.customMap;
      this.customMap = null;
    } else {
      const _stage = stage % 35 || 35;
      map = this.mapData[_stage - 1] || template;
    }
    return MapManager.fixMapData(map);
  }
}

const mapManager = new MapManager();

export default mapManager;
