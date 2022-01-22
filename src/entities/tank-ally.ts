/**
 * 我方坦克类
 */

import Config from '../config/const';
import keys from '../config/keys';
import { Resource } from '../loader';
import Keyboard from '../util/keyboard';
import Tank from './tank';
import Game from './game';

const G = Game.getInstance();
const K = Keyboard.getInstance();
const R = Resource.getResource();
const BIRTH_POS: IEntityRect[] = [
  [128, 384, 32, 32],
  [192, 384, 32, 32],
];
const directionKeys = ['Up', 'Right', 'Down', 'Left'] as const;

class AllyTank extends Tank {
  private isDeputy: boolean;
  private keys: typeof keys.P1 | typeof keys.P2;

  constructor({ world, isDeputy = false }: ITankAllyOption) {
    super({ world, rect: BIRTH_POS[isDeputy ? 1 : 0], direction: 0, camp: 'ally' });

    this.speed = Config.entity.allyTank.speed;
    this.keys = isDeputy ? keys.P2 : keys.P1;
    this.isDeputy = isDeputy;
    this.type = 'allyTank';
    // TODO fix
    this.addProtector(10000000);
    // this.addProtector(Config.ticker.protecterShort);

    G.players.getPlayer()[isDeputy ? 1 : 0]?.setTank(this);
  }

  protected addLife(): void {
    G.players.getPlayer()[this.isDeputy ? 1 : 0]?.addLife();
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
        G.players.getPlayer()[this.isDeputy ? 1 : 0]?.setTank(null);
      });
    }
  }

  public update(entityList: readonly IEntity[]): void {
    if (this.lifeCircle !== 'survival' || this.isStoped) return;

    directionKeys.forEach((k, index) => {
      if (K.isPressedKey(this.keys[k])) {
        if (this.direction !== index) {
          this.changeDirection(index as IDirection);
        } else {
          this.move(entityList);
        }
      }
    });

    if (K.isPulseKey(this.keys['Single']) || K.isPulseKey(this.keys['Double'])) {
      this.shoot();
    }
  }

  public draw(): void {
    // 绘制自身
    if (this.lifeCircle === 'survival') {
      const [x, y, w, h] = this.rect;

      this.ctx.drawImage(
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
