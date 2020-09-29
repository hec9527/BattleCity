// declare type canvasSourceImg = HTMLCanvasElement | CanvasImageSource;

declare type EntityRect = [number, number, number, number];

declare interface GameWorld {
  //

  [x: string]: any;
}

/** 接口描述了类的公共部分，而不是公共和私有两部分 */
declare interface EntityElement {
  // canvas: HTMLCanvasElement;
  // ctx: CanvasRenderingContext2D;
  // word: GameWorld;
  // img: CanvasImageSource;
  rect: EntityRect;
  camp: number;

  die(): void;
  update(list: EntityElement[]): void;
  draw(): void;
}

declare interface EntityMoveAbleElement extends EntityElement {
  getNextRect(): EntityRect;
  changeDir(dir: number): void;
  move(entityList: EntityElement[]): void;
  isCollisionBorder(nextTickRect: EntityRect): void;
  isCollisionEntity(nextTickRect: EntityRect, rect: EntityRect): void;
}

declare interface EntityMoveAbleOption {
  world: GameWorld;
  rect: EntityRect;
  img: CanvasImageSource;
  dir?: number;
  camp?: number;
  speed?: number;
}

declare interface TankElement extends EntityMoveAbleElement {
  shoot(): void;
  changeImg(): void;
}

declare interface TankOption extends EntityMoveAbleOption {
  life?: number;
  level?: number;
  status?: number;
  isProtected?: boolean;
}

declare interface TankAllyElement extends TankElement {
  //
}

declare interface TankAllyOption extends TankOption {
  //
}

declare interface BulletElement extends EntityMoveAbleElement {
  //
}

declare interface BulletOption extends EntityMoveAbleOption {
  tank: TankElement;
  dir: number;
  camp: number;
}

declare interface TankEnemyElement extends TankElement {
  //
}

declare interface TankEnemyOption extends TankOption {
  //
}

declare interface RewardElement extends EntityElement {
  //
}

declare interface RewardOption {
  world: GameWorld;
}

declare interface BrickElement extends EntityElement {
  //
}

declare interface BrickOption {
  //
}
