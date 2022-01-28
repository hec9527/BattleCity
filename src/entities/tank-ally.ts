/**
 * 我方坦克类
 */

import Config from '../config/const';
import keys from '../config/keys';
import { Resource } from '../loader';
import AllyController from '../util/ally-controller';
import Tank from './tank';
import Game from '../object/game';

const G = Game.getInstance();
const R = Resource.getResource();
const K = AllyController.getInstance();

const directionKeys = ['up', 'right', 'down', 'left'] as const;

class AllyTank extends Tank {
  private isDeputy: boolean;
  private keys: typeof keys.P1 | typeof keys.P2;
  public type: IEntityType = 'allyTank';
  public isCollision = true;

  constructor({ isDeputy = false }: ITankAllyOption) {
    super({ rect: [...Config.entity.allyTank.birthPos[isDeputy ? 1 : 0]], direction: 0, camp: 'ally' });

    this.speed = Config.entity.allyTank.speed;
    this.keys = isDeputy ? keys.P2 : keys.P1;
    this.isDeputy = isDeputy;

    // TODO fix
    this.addProtector(10000000);
    // this.addProtector(Config.ticker.protecterShort);

    G.getPlayer()[isDeputy ? 1 : 0]?.setTank(this);
  }

  protected addLife(): void {
    G.getPlayer()[this.isDeputy ? 1 : 0]?.addLife();
  }

  protected killAllOppositeCampTank(): void {
    import('./tank-enemy').then(res => {
      const EnemyTank = res.default;
      EnemyTank.killAllEnemy();
    });
  }

  protected stopAllOppositeCampTank(): void {
    import('./tank-enemy').then(res => {
      const EnemyTank = res.default;
      EnemyTank.getEnemyAliveTank().forEach(e => e.setStopStatus(true));
    });
  }

  public die(explode = false): void {
    if (this.lifeCircle === 'survival' && !this.isProtected) {
      super.die(explode, () => {
        G.getPlayer()[this.isDeputy ? 1 : 0]?.setTank(null);
      });
    }
  }

  public update(entityList: readonly IEntity[]): void {
    if (this.lifeCircle !== 'survival' || this.isStopped) return;

    directionKeys.forEach((dir, index) => {
      if (K.isPressKey(this.keys[dir])) {
        if (this.direction !== index) {
          this.changeDirection(index as IDirection);
        } else {
          this.move(entityList);
        }
      }
    });

    if (K.isTapKey(this.keys['single']) || K.isPulseKey(this.keys['double'])) {
      this.shoot();
    }
  }

  public draw(): void {
    // 绘制自身
    if (this.lifeCircle === 'survival') {
      const [x, y, w, h] = this.rect;

      this.ctx.main.drawImage(
        R.Image.myTank,
        (Math.min(3, this.level - 1) + (this.isDeputy ? 4 : 0)) * 32,
        this.direction * 64 + this.wheelStatus * 32,
        32,
        32,
        Config.battleField.paddingLeft + x,
        Config.battleField.paddingTop + y,
        w,
        h,
      );
    }
    super.draw();
  }
}

export default AllyTank;
