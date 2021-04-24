/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.png';

/** 实体阵营 */
declare type ICamp = 'ally' | 'enemy' | 'neutral';

/**
 * 实体方向
 * - `0 - up`
 * - `1 - right`
 * - `2 - down`
 * - `3 - left` */
declare type IDirection = 0 | 1 | 2 | 3;

declare type IMoveStatus = 0 | 1;

declare type IEntityRect = [number, number, number, number];

declare type ITankLifeCircle = 'birth' | 'survival' | 'death';

declare type IBulletLifeCircle = 'survival' | 'death';

/**
 * 奖励类型
 * - 0 铁锹
 * - 1 五角星
 * - 2 坦克
 * - 3 防护
 * - 4 炸弹
 * - 5 地雷 */
declare type IRewardType = 0 | 1 | 2 | 3 | 4 | 5;

/** 笔刷类型, 不同的笔刷操作不同的图层 */
declare type IBrushType = 'bg' | 'misc' | 'main';

declare type ICanvasCompose = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

declare interface IAnyFunction {
  (...args: any[]): any;
}

/** 实体 */
declare interface IEntity {
  isCollision: boolean;
  update: (list: readonly IEntity[]) => void;
  draw: () => void;
  die: () => void;
}

/** window  */
declare interface IGameWorld extends ICanvasCompose {
  addEntity: (entity: IEntity) => void;
  delEntity: (entity: IEntity) => void;
}
