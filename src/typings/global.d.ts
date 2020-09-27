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
  update(): void;
  draw(): void;
}

declare interface EntityMoveAbleElement extends EntityElement {
  move(): void;
  isCollisionBorder(nextTickRect: EntityRect): void;
  isCollisionEntity(nextTickRect: EntityRect, rect: EntityRect): void;
}

declare interface EntityMoveAbleOption {
  world: GameWorld;
  rect: EntityRect;
  img: CanvasImageSource;
  camp?: number;
  speed?: number;
}

declare interface TankElement {
  changeImg(): void;
  changeDir(dir: number): void;
}

declare interface TankOption extends EntityMoveAbleOption {
  dir?: number;

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
