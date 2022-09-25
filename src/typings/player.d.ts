declare interface IPlayer {
  getLife(): number;
  getTank(): ITank;
  getScore(): number;
  addLife(): void;
  getControl(): string;
}
