import Tank from './tank';
import Config from '../config';
import Ticker from '../ticker';
import { EnemyType } from '../config/enum';
import { Resource } from '../loader';

const R = Resource.getResource();

class EnemyTank extends Tank implements IEnemyTank {
  protected readonly type: IEntityType = 'enemyTank';
  protected rect: IEntityRect;
  protected flashTank = false;
  protected isCollision = true;

  private award = 0;
  private enemyType: EnemyType;

  private constructor(rect: IEntityRect, type: EnemyType) {
    super();
    this.rect = rect;
    this.enemyType = type;
  }

  public getScore() {
    switch (this.enemyType) {
      case EnemyType.normal:
        return 100;
      case EnemyType.enhance:
        return 200;
      case EnemyType.fast:
        return 300;
      case EnemyType.armor:
        return 400;
      default:
        console.warn(`unregistered enemy type: ${this.enemyType}`);
        return 400;
    }
  }

  public update(): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}

export default EnemyTank;
