/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.png';

declare type TupleArray<T extends any, len extends number> = [T, ...T[]] & { length: len };

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

/** 游戏模式  单人/双人 */
declare type IGameMode = 'single' | 'double';

declare type IEntityRect = [number, number, number, number];

declare type ITankLifeCircle = 'birth' | 'survival' | 'death';

declare type IBulletLifeCircle = 'survival' | 'death';

declare type IEntityType = 'brick' | 'enemyTank' | 'allyTank' | 'reward' | 'bullet' | 'entity';

declare type IBrickType = 'soil' | 'iron' | 'ice' | 'grass' | 'river' | 'boss' | 'blank';

declare type IMapData = TupleArray<TupleArray<number, 13>, 13>;

declare type IExplodeStatusStep = 1 | -1;
declare type IExplodeStatus = IDirection;
declare type IBrithStatus = IDirection;
declare type IProtectorStatus = IMoveStatus;
declare type IEnemyType = IDirection;
declare type IRewardStatus = IMoveStatus;
declare type ICtxType = 'fg' | 'bg' | 'main';

declare type IWindowCanvas = {
  [K in ICtxType]: HTMLCanvasElement;
};

declare type IWindowCtx = {
  [K in ICtxType]: CanvasRenderingContext2D;
};

/**
 * 奖励类型
 * - 0 铁锹
 * - 1 五角星
 * - 2 坦克
 * - 3 防护
 * - 4 炸弹
 * - 5 地雷
 * - 6 手枪 */
declare type IRewardType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

declare type ICanvasCompose = [HTMLCanvasElement, CanvasRenderingContext2D];

declare interface IAnyFunction {
  (...args: any[]): any;
}

declare interface ITicker {
  update: () => void;
  isAlive: () => boolean;
}

/** 实体 */
declare interface IEntity {
  rect: IEntityRect;
  camp: ICamp;
  type: IEntityType;
  isCollision: boolean;
  update: (list: readonly IEntity[]) => void;
  draw: () => void;
  die: (...args: any[]) => void;
}

declare interface IBullet extends IEntity {
  readonly level: number;
  move: (...args: any[]) => void;
}

declare interface IEntityOption {
  world: IGameWorld;
  rect: IEntityRect;
  camp: ICamp;
}

declare interface IEntityMoveAbleOption extends IEntityOption {
  direction?: IDirection;
  speed?: number;
}

declare interface ITankOption extends IEntityMoveAbleOption {
  direction: IDirection;
  life?: number;
  level?: number;
  bulletNum?: number;
}

declare interface ITankEnemyOption {
  world: IGameWorld;
  enemyType: IEnemyType;
}

declare interface ITankAllyOption {
  world: IGameWorld;
  isDeputy?: boolean;
}

declare interface IBulletOption extends Omit<IEntityMoveAbleOption, 'speed'> {
  direction: IDirection;
  level?: number;
  beforeDie: (bullet: IBullet) => void;
}

declare interface IReward extends IEntity {
  readonly rewardType: IRewardType;
}

declare interface IRewardOption {
  world: IGameWorld;
}

declare interface IBrickOption {
  world: IGameWorld;
  index: number;
  pos: { x: number; y: number };
}

/** window  */
declare interface IGameWorld {
  canvas: IWindowCanvas;
  ctx: IWindowCtx;

  addEntity: (entity: IEntity) => void;
  delEntity: (entity: IEntity) => void;
  addTicker: (ticker: ITicker) => void;
  delTicker: (ticker: ITicker) => void;
  /** 下一帧之前的回调 */
  beforeNextFrame: (callback: () => void) => void;
}
