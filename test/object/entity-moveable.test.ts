/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * 可移动的实体
 *  需要的属性
 *     direction
 *     speed
 *  需要的方法
 *     move
 *     getNextRect
 *     isCollisionBorder
 *     isCollisionEntity
 */

import MoveAble from '@/object/entity-moveable';
import Config from '@/config/const';

const Size = Config.battleField.width;

class MoveAbleInstance extends MoveAble {
  constructor(camp: ICamp = 'neutral', speed?: number, direction?: IDirection, rect?: IEntityRect) {
    super({
      world: { addEntity: (e: any) => {}, delEntity: (e: any) => {} } as IGameWorld,
      rect: rect || [0, 0, 32, 32],
      camp,
      speed,
      direction,
    });
  }

  move() {}
  draw() {}
  update() {}

  public isCollisionEntityNext(rect: IEntityRect) {
    return super.isCollisionEntityNextFrame(rect);
  }
  public isCollisionBorderNextFrame() {
    return super.isCollisionBorderNextFrame();
  }
}

describe('Entity moveable test', () => {
  let moveAble = new MoveAbleInstance('ally', 0, 0, [32, 32, 32, 32]);
  test('moveAble shoule defined', () => {
    expect(moveAble).toBeDefined();
  });

  // 可能会比较浪费性能
  test('moveAble is not collision border or other entity', () => {
    for (let i = 1; i <= 32; i++) {
      // 实体碰撞测试 没碰撞的极限情况
      expect(moveAble.isCollisionEntityNext([i, 0, 32, 32])).toBeFalsy();
      expect(moveAble.isCollisionEntityNext([0, i, 32, 32])).toBeFalsy();
      expect(moveAble.isCollisionEntityNext([i, 64, 32, 32])).toBeFalsy();
      expect(moveAble.isCollisionEntityNext([64, i, 32, 32])).toBeFalsy();
      // 检测所有碰撞情况
      for (let j = 1; j < 64; j++) {
        expect(moveAble.isCollisionEntityNext([i, j, 32, 32])).toBeTruthy();
        expect(moveAble.isCollisionEntityNext([j, i, 32, 32])).toBeTruthy();
      }
      // // 刚刚触碰
      // expect(moveAble.isCollisionEntityNextFrame([i, 1, 32, 32])).toBeTruthy();
      // expect(moveAble.isCollisionEntityNextFrame([1, i, 32, 32])).toBeTruthy();
      // expect(moveAble.isCollisionEntityNextFrame([i, 63, 32, 32])).toBeTruthy();
      // expect(moveAble.isCollisionEntityNextFrame([63, i, 32, 32])).toBeTruthy();
    }
  });

  test('moveAble move out border next frame', () => {
    // 上下左右 移出画布
    moveAble = new MoveAbleInstance('enemy', 1, 0);
    expect(moveAble.isCollisionBorderNextFrame()).toBeTruthy();
    moveAble = new MoveAbleInstance('neutral', Size - 31, 1);
    expect(moveAble.isCollisionBorderNextFrame()).toBeTruthy();
    moveAble = new MoveAbleInstance('ally', Size - 31, 2);
    expect(moveAble.isCollisionBorderNextFrame()).toBeTruthy();
    moveAble = new MoveAbleInstance('enemy', 1, 3);
    expect(moveAble.isCollisionBorderNextFrame()).toBeTruthy();
  });
});
