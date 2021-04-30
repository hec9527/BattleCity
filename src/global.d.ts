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

declare type IMapData = TupleArray<TupleArray<number, 13>, 13>;

declare type IExplodeStatus = IDirection;
declare type IBrithStatus = IDirection;
declare type IExplodeStatus = IMoveStatus;
declare type IProtecterStatus = IMoveStatus;
declare type IEnemyType = IDirection;
declare type IRewardStatus = IMoveStatus;

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

declare type ICanvasCompose = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

declare interface IAnyFunction {
  (...args: any[]): any;
}

declare interface ITicker {
  public update: () => void;
  public isAlive: () => boolean;
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
  public readonly level: number;
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

declare interface IBulletOption extends IEntityMoveAbleOption {
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

/** window  */
declare interface IGameWorld extends ICanvasCompose {
  addEntity: (entity: IEntity) => void;
  delEntity: (entity: IEntity) => void;
  addTicker: (ticker: ITicker) => void;
  delTicker: (ticker: ITicker) => void;
  /** 下一帧之前的回调 */
  beforeNextFrame: (callback: () => void) => void;
}
