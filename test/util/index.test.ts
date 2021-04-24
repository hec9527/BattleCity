/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 测试+DOM，window对象
 */

import { $, getType, getCanvas, getDistance, getBulletPos, getLocationPath, isOppositeDirection } from '@/util/index';

describe('Util test', () => {
  describe('getCanvas function test', () => {
    test('canvas, ctx should defined', () => {
      const { canvas, ctx } = getCanvas(200, 100);
      expect(canvas).toBeDefined();
      expect(ctx).toBeDefined();
    });

    test('getCanvas from DOM', () => {
      const { canvas, ctx } = getCanvas(200, 100, 'canvas');
      expect(canvas).toBeDefined();
      expect(ctx).toBeDefined();
      expect(canvas.width).toBe(200);
      expect(canvas.height).toBe(100);
    });
  });

  describe('my query fcuntion "$" test', () => {
    test('$ by id should return HTMLElement', () => {
      expect($('#h1')).toBeDefined;
      expect(($('#h1') as HTMLElement).id).toBe('h1');
      expect($('.span')).toHaveLength(1);
      expect($('<div>')).toEqual(document.createElement('div'));
      expect(($('div') as NodeList).length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('isOppositeDirection function test', () => {
    test('isOppositeDirection should return true', () => {
      expect(isOppositeDirection(0, 2)).toBe(true);
      expect(isOppositeDirection(2, 0)).toBe(true);
    });

    test('isOppositeDirection should return false', () => {
      expect(isOppositeDirection(1, 2)).toBe(false);
      expect(isOppositeDirection(1, 1)).toBe(false);
    });
  });

  describe('ticker function test', () => {
    test('ticker with custom tick', () => {
      const tick = Ticker(10);
      const mockFn = jest.fn();
      for (let i = 0; i < 10; i++) {
        tick(mockFn);
      }
      expect(mockFn.mock.calls.length).toBe(1);
      for (let i = 0; i < 10; i++) {
        tick(mockFn);
      }
      expect(mockFn.mock.calls.length).toBe(2);
      for (let i = 0; i < 100; i++) {
        tick(mockFn);
      }
      expect(mockFn.mock.calls.length).toBe(12);
    });

    test('ticker, callback should dispatch every perTick', () => {
      const callBackPerTick = jest.fn();
      const callBackAtPeriod = jest.fn();
      const tick = Ticker(50, callBackPerTick, 5);
      for (let i = 0; i < 100; i++) {
        tick(callBackAtPeriod);
      }
      expect(callBackPerTick.mock.calls.length).toBe(20);
      expect(callBackAtPeriod.mock.calls.length).toBe(2);
    });
  });

  describe('getBulletPos function test', () => {
    expect(getBulletPos(0, 0, 0)).toEqual([12, 0, 8, 8]);
    expect(getBulletPos(1, 0, 0)).toEqual([24, 12, 8, 8]);
    expect(getBulletPos(2, 0, 0)).toEqual([12, 24, 8, 8]);
    expect(getBulletPos(3, 0, 0)).toEqual([0, 12, 8, 8]);
  });

  test('getType function test', () => {
    expect(getType(NaN)).toBe('NaN');
    expect(getType([])).toBe('Array');
    expect(getType(1)).toBe('Number');
    expect(getType('')).toBe('String');
    expect(getType({})).toBe('Object');
    expect(getType(true)).toBe('Boolean');
    expect(getType(() => {})).toBe('Function');
    expect(getType(Symbol('s'))).toBe('Symbol');
    expect(getType(undefined)).toBe('Undefined');
  });

  test('getLocationPath should return string', () => {
    expect(getLocationPath()).toBe('https://baidu.com/');
  });

  test('getDistance should return number', () => {
    expect(getDistance([0, 0, 32, 32], [3, 4, 32, 32])).toBe(5);
    expect(getDistance([3, 4, 32, 32], [0, 0, 32, 32])).toBe(5);
    expect(getDistance([3, 4, 32, 32], [3, 4, 32, 32])).toBe(0);
  });
});
