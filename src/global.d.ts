/* eslint-disable @typescript-eslint/no-explicit-any */

// declare type canvasSourceImg = HTMLCanvasElement | CanvasImageSource;

/** 接口只描述类的公共部分 */

/** 实例阵营 */
declare type Camp = 'ally' | 'enemy' | 'neutral';

/**
 * 实体方向
 * - `0 - 'up'`
 * - `1 - 'right'`
 * - `2 - 'down'`
 * - `3 - 'left'`
 */
declare type Direction = 0 | 1 | 2 | 3;

declare type EntityRect = [number, number, number, number];

declare type TankLifeCircle = 'birth' | 'survival' | 'death';

declare type BulletLifeCircle = 'survival' | 'death';

declare type RewardType = 0 | 1 | 2 | 3;

/** 笔刷类型, 不同的笔刷操作不同的图层 */
declare type BrushType = 'bg' | 'misc' | 'main';

declare type ICtx = {
  [T in BrushType]: CanvasRenderingContext2D;
};

declare interface AnyFunction {
  (arg?: any, ...args: any[]): any;
}

declare interface CanvasCompose {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

declare interface GameWorld {
  addEntity(entity: Entity): void;
  delEntity(entity: Entity): void;
  anima(): void;
}

declare interface EntityOption {
  world: GameWorld;
  rect: EntityRect;
  img: CanvasImageSource;
  camp?: Camp;
}

declare interface MoveAbleEntityOption extends EntityOption {
  speed?: number;
  direction?: Direction;
}

declare interface TankOption extends MoveAbleEntityOption {
  life?: number;
  level?: number;
}

declare interface RewardOption extends EntityOption {
  rewardType: RewardType;
}

declare interface BulletOption {
  world: GameWorld;
  camp: Camp;
  rect: EntityRect;
  tank: any;
  level: number;
}
