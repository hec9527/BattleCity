import ConstructionCursor from '../entities/construction-cursor';
import Config from '../config';
import EntityContainer from '../entities/entity-container';
import ConstructionCursorController from '../entities/construction-cursor-controller';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class ConstructionWin implements IGameWin {
  private winManager: IWindowManager;
  private entityContainer = new EntityContainer();
  private constructionCursor = new ConstructionCursor();
  private constructionCursorController = new ConstructionCursorController(this.constructionCursor);

  constructor(winManager: IWindowManager) {
    this.winManager = winManager;

    this.entityContainer.addEntity(this.constructionCursor);
  }

  public update(): void {
    this.entityContainer.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Config.colors.gray;
    ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
    ctx.fillStyle = Config.colors.black;
    ctx.fillRect(PL, PT, Config.battleField.width, Config.battleField.height);

    this.entityContainer.draw(ctx);
  }
}

export default ConstructionWin;
