/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Entity from '@/object/entity';

/**
 *  实体类
 *  全局精灵的父类，应该实现的公共属性、方法
 *    rect
 *    camp
 *    update
 *    die
 *    isCollision
 */

class EntityInstance extends Entity {
  constructor(camp?: ICamp) {
    super({ addEntity: (e: any) => {}, delEntity: (e: any) => {} } as IGameWorld, [0, 0, 32, 32], camp);
  }
  update() {}
  draw() {}
}

describe('Entity class test', () => {
  test('it should be abstract class', () => {
    let entity = new EntityInstance();
    expect(entity).toBeInstanceOf(Entity);
    expect(entity.rect).toBeDefined();
    expect(entity.camp).toBeDefined();
    expect(entity.isCollision).toBeDefined();
    expect(entity.isCollision).toBeTruthy();
    expect(entity.update).toBeDefined();
    expect(entity.die).toBeDefined();
    expect(entity.die()).toBeUndefined();
    expect(entity.camp).toBe('neutral');
    entity = new EntityInstance('ally');
    expect(entity.camp).toBe('ally');
  });
});
