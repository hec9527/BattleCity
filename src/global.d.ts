// declare type canvasSourceImg = HTMLCanvasElement | CanvasImageSource;

/**
 * 接口只描述类的公共部分
 */

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
  dir?: Direction;
}

declare interface TankOption extends MoveAbleEntityOption {
  life?: number;
  level?: number;
}
