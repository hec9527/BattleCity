/// <reference path='src/typings/event.d.ts'/>
/// <reference path='src/typings/utile.d.ts'/>
/// <reference path='src/typings/entity.d.ts'/>
/// <reference path='src/typings/win.d.ts'/>
/// <reference path='src/typings/game.d.ts'/>
/// <reference path='src/typings/simulator.d.ts'/>
/// <reference path='src/typings/player.d.ts'/>
/// <reference path='src/typings/control.d.ts'/>
/// <reference path='src/typings/env.d.ts'/>

declare module '*.png';

declare interface Window {
  webkitAudioContext: typeof window.AudioContext;
}

declare type AnyFunction = (...args: any[]) => any;

declare type AnyObject = {
  [K in symbol | string | number]: any;
};

declare interface ITicker {
  update(): void;
  isFinished(): boolean;
}

declare interface ITask {
  execute?(): void;
  update?(): void;
  isFinished?(): boolean;
}

declare type IMapData = TupleArray<TupleArray<number, 13>, 13>;

declare interface Window {
  /** 是否允许敌方坦克获取奖励 */
  allowEnemyPick: boolean;

  /** 是否横屏 */
  isLandScape: boolean;
}
