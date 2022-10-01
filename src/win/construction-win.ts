import EVENT from '../event';
import Config from '../config';
import EntityContainer from '../entities/entity-container';
import BrickConstructor from '../entities/brick-constructor';
import ConstructionCursor from '../entities/construction-cursor';
import Map from '../map';

import { isControlEvent } from '../guard';
import { isEntityCollision } from '../util';

const { paddingLeft: PL, paddingTop: PT } = Config.battleField;

class ConstructionWin implements IGameWin, ISubScriber {
  private eventManager = EVENT.EM;
  private winManager: IWindowManager;
  private entityContainer = new EntityContainer();
  private constructionCursor = new ConstructionCursor();

  constructor(winManager: IWindowManager) {
    this.winManager = winManager;
    this.eventManager.addSubscriber(this, [EVENT.CONSTRUCT.BUILD, EVENT.KEYBOARD.PRESS]);

    // const map = Map.getCustomMap();
    const map = Map.getMap(1);
    if (map) {
      BrickConstructor.buildFromMapData(map);
    }
  }

  private serializeMapData(): void {
    const map = [] as unknown as IMapData;
    for (let i = 0; i < 13; i++) {
      map[i] = new Array(13).fill(0, 0, 13) as IMapData[number];
    }
    this.entityContainer.getAllEntity().forEach(entity => {
      if (entity.getEntityType() !== 'cursor') {
        const [x, y] = entity.getRect();
        const col = (x / 32) | 0;
        const row = (y / 32) | 0;
        const index = (entity as IBrick).getBrickIndex() || 0;
        map[row][col] = index;
      }
    });

    Map.setCustomMap(map);
  }

  private nextWin(): void {
    this.serializeMapData();
    this.winManager.toMenuWin();
  }

  private removeByCursorRect(): void {
    const cursorRect = this.constructionCursor.getRect();
    const entities = this.entityContainer.getAllEntity();
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (entity.getEntityType() === 'cursor') {
        continue;
      }
      const entityRect = entity.getRect();
      if (isEntityCollision(cursorRect, entityRect)) {
        this.entityContainer.removeEntity(entity);
      }
    }
  }

  public buildBrick(index: number) {
    this.removeByCursorRect();
    BrickConstructor.newBrick(index, this.constructionCursor.getRect());
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

  public notify(event: INotifyEvent<{ index: number }>): void {
    if (event.type === EVENT.CONSTRUCT.BUILD) {
      this.buildBrick(event.index);
    } else if (isControlEvent(event) && event.type === EVENT.KEYBOARD.PRESS) {
      if (event.key === EVENT.CONTROL.P1.START) {
        this.nextWin();
      }
    }
  }
}

export default ConstructionWin;
