declare enum Direction {
  top = 0,
  right,
  down,
  left,
}

declare type ICamp = 'ally' | 'enemy' | 'neutral';

declare type IDirection = 0 | 1 | 2 | 3; // 上  右  下 左

declare type IPriority = 0 | 1 | 2 | 3;

declare type IEntityRect = [number, number, number, number];

declare type IEntityType = 'brick' | 'enemyTank' | 'allyTank' | 'reward' | 'bullet';

declare type IBrickType = 'brick' | 'iron' | 'ice' | 'grass' | 'river' | 'boss' | 'blank';

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
  getCamp(): ICamp;
  getRect(): IEntityRect;
  getZIndex(): number;
  getCollision(): boolean;
  getEntityType(): IEntityType;
  update(list: readonly IEntity[]): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

declare interface ITank extends IEntity {
  shoot(): void;
}

declare interface IEnemyTank extends ITank {
  getScore(): number;
}

declare interface IBullet extends IEntity {
  getTank(): IEntity;
}

declare interface IAward extends IEntity {
  getAwardType(): IRewardType;
}
