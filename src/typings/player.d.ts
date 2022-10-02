declare interface IPlayer {
  getLife(): number;
  getTank(): ITank | null;
  getScore(): number;
  addLife(): void;
  addScore(score: number): void;
  getRoleType(): 'P1' | 'P2';
  setKillRecord(type: IEnemyType): void;
  getKillRecord(): IKillRecord;
  resetKillRecord(): void;
}
