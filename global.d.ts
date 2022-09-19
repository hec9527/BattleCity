/// <reference path='src/typings/event.d.ts'/>
/// <reference path='src/typings/utile.d.ts'/>
/// <reference path='src/typings/entity.d.ts'/>

declare module '*.png';

declare type AnyFunction = (...args: any[]) => any;

declare type AnyObject = {
  [K in symbol | string | number]: any;
};

declare type IGameMode = 'single' | 'double';

declare type ICtxType = 'fg' | 'bg' | 'main';

declare type IMapData = TupleArray<TupleArray<number, 13>, 13>;

declare interface ITicker {
  update(): void;
}

declare type IWindowCanvas = {
  [K in ICtxType]: HTMLCanvasElement;
};

declare type IWindowCtx = {
  [K in ICtxType]: CanvasRenderingContext2D;
};

declare type ICanvasCompose = [HTMLCanvasElement, CanvasRenderingContext2D];

declare interface IAllyController {
  lock(): void;
  unlock(): void;
  get isLocked(): boolean;
  isTapKey(key: any): boolean;
  isPulseKey(key: any, pulseTime: number): boolean;
  isPressKey(key: any): boolean;
}

/** window  */
declare interface IGameWorld {
  canvas: IWindowCanvas;
  ctx: IWindowCtx;

  addEntity: (entity: IEntity) => void;
  delEntity: (entity: IEntity) => void;
  addTicker: (ticker: ITicker) => void;
  delTicker: (ticker?: ITicker) => void;
  /** 下一帧之前的回调 */
  beforeNextFrame: (callback: () => void) => void;
}
