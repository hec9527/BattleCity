declare type ICamp = 'ally' | 'enemy' | 'neutral';

declare type IDirection = 0 | 1 | 2 | 3; // 上  右  下 左

declare type IPriority = 0 | 1 | 2 | 3;

declare type IPoint = [number, number];

declare type IEntityRect = [number, number, number, number];

declare type IEntityType =
  | 'brick'
  | 'enemyTank'
  | 'allyTank'
  | 'award'
  | 'bullet'
  | 'cursor'
  | 'curtain'
  | 'base'
  | 'score'
  | 'spriteAnimation'
  | 'explosionAnimation'
  | 'gameOverFlag';

declare type IBrickType = 'brick' | 'iron' | 'ice' | 'grass' | 'river' | 'blank' | 'brickWall';

declare type IEnemyType = 0 | 1 | 2 | 3;

declare type IKillRecord = { [K in IEnemyType]: number };

/**
 * 奖励类型
 * - 0 铁锹
 * - 1 五角星
 * - 2 坦克
 * - 3 防护
 * - 4 炸弹
 * - 5 地雷
 * - 6 手枪 */
declare type IAwardType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

declare interface IEntity {
  getCamp(): ICamp;
  getRect(): IEntityRect;
  getCenter(): IPoint;
  getZIndex(): number;
  getDestroyed(): boolean;
  getCollision(): boolean;
  getDirection(): IDirection;
  getEntityType(): IEntityType;
  setRect(rect: IEntityRect): void;
  setDirection(direction: IDirection): void;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

declare interface IEntityMoveable extends IEntity {
  setStop(stop: boolean): void;
  getLastRect(): IEntityRect;
  getNextFrameRect(): IEntityRect;
  getLastDirection(): IDirection;
}

declare interface ITank extends IEntityMoveable {
  shoot(): void;
  explosion(): void;
  getLevel(): number;
  getExploded(): boolean;
  isProtected(): boolean;
}

declare interface IEnemyTank extends ITank {
  getEnemyType(): IEnemyType;
  setArmor(armor: number): void;
  setAward(award: number): void;
}

declare interface IAllyTank extends ITank {
  inheritFromTank(tank: IAllyTank): void;
  setShooting(shoot: boolean): void;
  getPlayer(): IPlayer;
  setPlayer(player: IPlayer): void;
}

declare interface IBullet extends IEntityMoveable {
  getTank(): ITank;
  getLevel(): number;
}

declare interface IAward extends IEntity {
  getAwardType(): IAwardType;
  destroy(picker?: IEntity): void;
}

declare interface IBrick extends IEntity {
  getBrickIndex(): number;
  getBrickType(): IBrickType;
}
