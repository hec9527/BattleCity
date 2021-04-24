/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 测试+DOM，window对象
 */

import {
  $,
  getType,
  getCanvas,
  getDistance,
  getBulletPos,
  isOppositeDirection,
  isEntityCollision,
  randomInt,
  dispense,
  isEnemyTank,
  isAllyTank,
  isReward,
  isBrick,
  isBullet,
} from '../../src/util/index';
import Reward from '@/object/reward';
import Bullet from '@/object/bullet';
import Brick from '@/object/brick';
import EnemyTank from '@/object/tank-enemy';
import WinStart from '@/win/win-start';
import AllyTank from '@/object/tank-ally';

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

  test('getDistance should return number', () => {
    expect(getDistance([0, 0, 32, 32], [3, 4, 32, 32])).toBe(5);
    expect(getDistance([3, 4, 32, 32], [0, 0, 32, 32])).toBe(5);
    expect(getDistance([3, 4, 32, 32], [3, 4, 32, 32])).toBe(0);
  });

  describe('isEntityCollision test', () => {
    for (let i = 1; i < 63; i++) {
      for (let j = 1; j < 64; j++) {
        expect(isEntityCollision([i, j, 32, 32], [32, 32, 32, 32])).toBeTruthy();
      }
    }
    for (let i = 0; i < 64; i++) {
      expect(isEntityCollision([i, 0, 32, 32], [32, 32, 32, 32])).toBeFalsy();
      expect(isEntityCollision([0, 32, 32, 32], [32, 32, 32, 32])).toBeFalsy();
    }
  });

  describe('randonInt should cover left and right', () => {
    for (let i = 0; i < 100; i++) {
      const res = randomInt(1, 10);
      expect(res).toBeLessThanOrEqual(10);
      expect(res).toBeGreaterThanOrEqual(1);
    }
  });

  describe('dispense should splite a number into a list, and sum list equals number', () => {
    describe('dispense should have a default splite length', () => {
      const res = dispense(100);

      test('dispense should return a Array', () => {
        expect(res).toHaveLength(20);
      });

      test('dispense should return a arrary and sum as 100', () => {
        expect(res.reduce((p, c) => p + c, 0)).toBe(100);
      });
    });
  });

  describe('dispense should tobe set a length argument', () => {
    const res = dispense(100, 10);
    test('dispense should return a Array', () => {
      expect(res).toHaveLength(10);
    });

    test('dispense should return a arrary and sum as 100', () => {
      expect(res.reduce((p, c) => p + c, 0)).toBe(100);
    });
  });

  describe('assert function should return boolean', () => {
    const world = new WinStart();
    EnemyTank.initEnemyCamp(1);
    const enemyTank = EnemyTank.initEnemyTank({ world });
    const allyTank = new AllyTank({ world });
    const brick = new Brick({ world, rect: [0, 64, 32, 32] });
    const reward = Reward.getNewReward({ world });
    const bullet = new Bullet({ world, rect: [8, 8, 8, 8], camp: 'ally', level: 1, direction: 3, beforeDie: () => {} });

    test('isEnemyTank assert EnemyTank is true, else false', () => {
      expect(enemyTank).toBeTruthy();
      expect(isEnemyTank(enemyTank!)).toBeTruthy();
      expect(isEnemyTank(allyTank)).toBeFalsy();
      expect(isEnemyTank(brick)).toBeFalsy();
      expect(isEnemyTank(reward)).toBeFalsy();
      expect(isEnemyTank(bullet)).toBeFalsy();
    });

    test('isAllTank asset Allytank is true, else false', () => {
      expect(allyTank).toBeTruthy();
      expect(isAllyTank(allyTank)).toBeTruthy();
      expect(isAllyTank(enemyTank!)).toBeFalsy();
      expect(isAllyTank(brick)).toBeFalsy();
      expect(isAllyTank(reward)).toBeFalsy();
      expect(isAllyTank(bullet)).toBeFalsy();
    });

    test('isBrick asset Brick is true, else false', () => {
      expect(brick).toBeTruthy();
      expect(isBrick(brick)).toBeTruthy();
      expect(isBrick(allyTank)).toBeFalsy();
      expect(isBrick(enemyTank!)).toBeFalsy();
      expect(isBrick(reward)).toBeFalsy();
      expect(isBrick(bullet)).toBeFalsy();
    });

    test('isBullet asset Bullet is true, else false', () => {
      expect(bullet).toBeTruthy();
      expect(isBullet(bullet)).toBeTruthy();
      expect(isBullet(brick)).toBeFalsy();
      expect(isBullet(allyTank)).toBeFalsy();
      expect(isBullet(enemyTank!)).toBeFalsy();
      expect(isBullet(reward)).toBeFalsy();
    });

    test('isReward asset Reward is true, else false', () => {
      expect(reward).toBeTruthy();
      expect(isReward(reward)).toBeTruthy();
      expect(isReward(bullet)).toBeFalsy();
      expect(isReward(brick)).toBeFalsy();
      expect(isReward(allyTank)).toBeFalsy();
      expect(isReward(enemyTank!)).toBeFalsy();
    });
  });
});
