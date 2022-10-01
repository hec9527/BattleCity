declare interface IPlayer {
  getLife(): number;
  getTank(): ITank;
  getScore(): number;
  addLife(): void;
  getRoleType(): 'P1' | 'P2';
}
