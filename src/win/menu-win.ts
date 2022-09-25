import EVENT from '../event';
import { Config } from '../config';
import { R } from '../loader';
import MenuCursor from '../entities/menu-cursor';

class MenuWin implements IGameWin, ISubScriber {
  private eventManager = EVENT.EM;
  private winManager: IWindowManager;
  private status: 'slide' | 'select' = 'slide';
  private scrollY = Config.canvas.height;
  private speed = 5;
  private MenuCursor = new MenuCursor();

  constructor(winManager: IWindowManager) {
    this.winManager = winManager;
    this.eventManager.addSubscriber(this, [EVENT.KEYBOARD.PRESS]);
  }

  private updateScrollY(): void {
    this.scrollY -= this.speed;
    this.MenuCursor.setScrollY(this.scrollY);
    if (this.scrollY <= 0) {
      this.scrollY = 0;
      this.status = 'select';
      this.MenuCursor.setScrollY(0);
    }
  }

  private nextWin(): void {
    this.eventManager.removeAllSubscribers();
    const index = this.MenuCursor.getMenuIndex();
    switch (index) {
      case 0:
        this.winManager.setGameMode('single');
        this.winManager.toStageWin();
        break;
      case 1:
        this.winManager.setGameMode('double');
        this.winManager.toStageWin();
        break;
      case 2:
        this.winManager.toConstructWin();
        break;
      default:
        break;
    }
  }

  public update(): void {
    if (this.status === 'slide') {
      this.updateScrollY();
    }
    this.MenuCursor.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.font = '16px prestart';
    ctx.fillStyle = Config.colors.black;
    ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    ctx.fillStyle = Config.colors.white_100;
    ctx.drawImage(R.Image.UI, 0, 0, 376, 136, 68, this.scrollY + 80, 376, 136);
    ctx.fillText('© 2022 PRESENT', 146, this.scrollY + 400);
    ctx.fillText('ALL RIGHTS RESERVED', 106, this.scrollY + 425);
    this.MenuCursor.draw(ctx);
    ctx.fillStyle = 'red';
    ctx.fillText('HEC9257', 202, this.scrollY + 375);
    ctx.restore();
  }

  public notify(event: IControllerEvent): void {
    if (this.status === 'slide' && Object.values(EVENT.CONTROL.P1).includes(event.key)) {
      this.status = 'select';
      this.scrollY = 0;
      this.MenuCursor.setScrollY(0);
      return;
    }

    if (event.key === EVENT.CONTROL.P1.A || event.key === EVENT.CONTROL.P1.B || event.key === EVENT.CONTROL.P1.START) {
      this.nextWin();
    }
  }
}

export default MenuWin;
