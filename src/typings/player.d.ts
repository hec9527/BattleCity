declare interface IPlayer {
  getLife(): number;
  addLife(): void;
  reduceLife(): void;
  getTank(): IAllyTank | null;
  setTank(tank: IAllyTank): void;
  getScore(): number;
  addScore(score: number): void;
  getRoleType(): 'P1' | 'P2';
  setKillRecord(type: IEnemyType): void;
  getKillRecord(): IKillRecord;
  resetKillRecord(): void;
}
