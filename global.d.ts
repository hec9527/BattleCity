/// <reference path='src/typings/event.d.ts'/>
/// <reference path='src/typings/utile.d.ts'/>
/// <reference path='src/typings/entity.d.ts'/>
/// <reference path='src/typings/win.d.ts'/>
/// <reference path='src/typings/game.d.ts'/>
/// <reference path='src/typings/player.d.ts'/>
/// <reference path='src/typings/control.d.ts'/>

declare module '*.png';

declare type AnyFunction = (...args: any[]) => any;

declare type AnyObject = {
  [K in symbol | string | number]: any;
};

declare interface ITicker {
  update(): void;
  isFinished(): boolean;
}

declare interface ITask {
  update?(): void;
  execute?(): void;
}

declare type IMapData = TupleArray<TupleArray<number, 13>, 13>;
