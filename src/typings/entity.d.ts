/** 实体阵营 */
declare type ICamp = 'ally' | 'enemy' | 'neutral';

declare type IDirection = 0 | 1 | 2 | 3; // 上  右  下 左

declare type IMoveStatus = 0 | 1;

declare type IEntityRect = [number, number, number, number];

declare type IBulletLifeCircle = 'survival' | 'death';

declare type ITankLifeCircle = 'birth' | 'survival' | 'death' | 'wait';

declare type IEntityType = 'brick' | 'enemyTank' | 'allyTank' | 'reward' | 'bullet';

declare type IBrickType = 'brick' | 'iron' | 'ice' | 'grass' | 'river' | 'boss' | 'blank';

declare type IExplodeStatusStep = 1 | -1;

declare type IExplodeStatus = IDirection;

declare type IBirthStatus = IDirection;

declare type IEnemyType = IDirection;

declare type IRewardStatus = IMoveStatus;

declare type IProtectorStatus = IMoveStatus;

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

declare interface IEntity {
  rect: IEntityRect;
  readonly camp: ICamp;
  readonly type: IEntityType;
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
  rect: IEntityRect;
  camp: ICamp;
}

declare interface IEntityMoveAbleOption extends IEntityOption {
  direction?: IDirection;
  speed?: number;
}

declare interface IEnemyTankOption {
  enemyType: IEnemyType;
}

declare interface IBulletOption extends Omit<IEntityMoveAbleOption, 'speed'> {
  direction: IDirection;
  level?: number;
  beforeDie: (bullet: IBullet) => void;
}

declare interface IReward extends IEntity {
  readonly rewardType: IRewardType;
}

declare interface IBrickOption {
  index: number;
  pos: { x: number; y: number };
}
