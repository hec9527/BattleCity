// declare type canvasSourceImg = HTMLCanvasElement | CanvasImageSource;

/**
 * 接口只描述类的公共部分
 */

declare type EntityRect = [number, number, number, number];

declare interface GameWorld {
  addEntity(entity: Entity): void;
  delEntity(entity: Entity): void;
  anima(): void;
}
