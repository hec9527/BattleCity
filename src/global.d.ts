/* eslint-disable @typescript-eslint/no-explicit-any */

// 图片、音频等资源
declare module '*.png';
declare module '*.jpg';
declare module '*.mp3';

/** 实体阵营 */
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

/**
 * 奖励类型
 * - 0 铁锹
 * - 1 五角星
 * - 2 坦克
 * - 3 防护
 * - 4 炸弹
 * - 5 地雷
 */
declare type RewardType = 0 | 1 | 2 | 3 | 4 | 5;

/** 笔刷类型, 不同的笔刷操作不同的图层 */
declare type BrushType = 'bg' | 'misc' | 'main';

declare type ICtx = {
  clear(clearAll: boolean);
  clear(x: number, y: number, w: number, h: number): void;
  clear(x?: number | boolean, y?: number, w?: number, h?: number): void;
  draw(
    img: CanvasImageSource,
    sx: number,
    wy: number,
    sw: number,
    sh: number,
    x: number,
    y: number,
    w: number,
    h: number
  ): void;
};

declare type ICtx = {
  [T in BrushType]: CanvasRenderingContext2D;
};

declare interface AnyFunction {
  (...args: any[]): any;
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
  rect: EntityRect;
  tank: any;
  world: GameWorld;
  camp: Camp;
  level: number;
}
