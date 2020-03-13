import map, { Maps } from '@/map/index';
import mapData from '@/map/mapDatas';
import { getType } from '@/util';

const mockMap = new Array(13);

for (let i = 0; i < 13; i++) {
  mockMap[i] = new Array(13).fill(0);
}

const methods = ['debug', 'info', 'warn', 'error', 'log'] as const;
beforeEach(() => {
  methods.forEach(key => {
    global.console[key] = jest.fn();
  });
});

describe('Maps class test', () => {
  test('map should be instanceof Maps', () => {
    expect(map).toBeInstanceOf(Maps);
  });

  test('map.getMapData should return false', () => {
    expect(map.getMapData(0)).toBeFalsy();
    expect(map.getMapData(-1)).toBeFalsy();
  });

  test('map.getMapData should return mapData', () => {
    const _map = map.getMapData(1);
    expect(_map).toHaveLength(13);
    for (let i = 0; i < 13; i++) {
      expect(_map && _map[i]).toHaveLength(13);
    }
  });

  // 测试异常抛出  触发异常的函数需要用函数包起来
  test('map.setCustomRound should throw error', () => {
    expect(() => map.setCustomRound([])).toThrowError();
    expect(() => map.setCustomRound(new Array(13).fill([]))).toThrowError();
  });

  test('map.getMapData[0] should return mapData after map.setCustomRound', () => {
    map.setCustomRound(mockMap);
    const _map = map.getMapData(0);
    expect(_map).toBeTruthy();
    for (let i = 0; i > 13; i++) {
      expect(_map && _map[i]).toHaveLength(13);
    }
  });

  test('map.getMapData(36) should equal map.getMapdata(1)', () => {
    expect(map.getMapData(36)).toStrictEqual(map.getMapData(1));
  });

  test('map.getMapData(70) should equal map.getMapdata(35)', () => {
    expect(map.getMapData(70)).toStrictEqual(map.getMapData(35));
  });

  test('map should fix mapData', () => {
    const _map = map.getMapData(0);
    expect(_map).toBeDefined();
    expect(_map).toBeTruthy();
    // console.log('%c地图数据', 'color:#abf', _map);

    if (_map) {
      expect(_map[11][5]).toBe(18);
      expect(_map[11][6]).toBe(4);
      expect(_map[11][7]).toBe(17);
      expect(_map[12][5]).toBe(3);
      expect(_map[12][6]).toBe(15);
      expect(_map[12][7]).toBe(5);
    }
  });
});

describe('mapData should be defined correctly', () => {
  test('mapData should be defined', () => {
    expect(mapData).toBeDefined();
  });

  test('mapData should instanceof Array', () => {
    expect(getType(mapData)).toBe('Array');
  });

  describe("mapData's element should be defined correctly", () => {
    for (let i = 0, len = mapData.length; i < len; i++) {
      const _map = mapData[i];

      test('_map should be defined', () => {
        expect(_map).toBeDefined();
      });

      test('_map should have length 13', () => {
        expect(_map).toHaveLength(13);
      });

      test("_map's row should have length 13", () => {
        for (let j = 0; j < 13; j++) {
          expect(_map[j]).toHaveLength(13);
        }
      });
    }
  });
});
