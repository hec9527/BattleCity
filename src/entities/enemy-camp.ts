import config from '../config';
import EVENT from '../event';
import EnemyTank from './enemy-tank';
import BirthAnimation from './birth-animation';
import EnemyController from './enemy-controller';
import EnemyControllerContainer from './enemy-controller-container';

import { R } from '../loader';
import { isTankEvent } from '../object/guard';
import { randomInt } from '../util';

const { paddingLeft, paddingTop } = config.battleField;
const PT = paddingTop + 20;
const PL = paddingLeft + config.battleField.width + 15;
const birthPlace = [
  [0, 0],
  [6, 0],
  [12, 0],
];

export default class EnemyCamp implements ISubScriber {
  private eventManager = EVENT.EM;
  private enemies = '';
  private enemyCount = 0;
  private enemyAlive = 0;
  private birthIndex = 1;
  private createTick = config.entity.createEnemyInterval;
  private controllerContainer = new EnemyControllerContainer();
  private pause = false;

  constructor() {
    this.eventManager.addSubscriber(this, [EVENT.TANK.ENEMY_TANK_DESTROYED, EVENT.GAME.PAUSE]);
  }

  public update(): void {
    this.controllerContainer.update();
    this.createTick++;
    if (
      this.pause ||
      this.enemyCount >= this.enemies.length ||
      this.enemyAlive >= config.entity.maxEnemyAlive ||
      this.createTick <= config.entity.createEnemyInterval
    ) {
      return;
    }
    this.createEnemy();
  }

  public setEnemies(enemies: string): void {
    this.enemies = enemies;
  }

  private createEnemy(): void {
    const [x, y] = birthPlace[this.birthIndex % 3];
    const type = this.enemies[this.enemyCount];

    this.createTick = 0;
    this.enemyAlive++;
    this.enemyCount++;
    this.birthIndex++;

    const rect = [x * 32, y * 32, 32, 32] as IEntityRect;
    new BirthAnimation(rect, () => {
      const tank = new EnemyTank(rect, Number(type) as IEnemyType);
      const award = randomInt(0, 10) > 7 ? Math.floor(Math.sqrt(randomInt(1, 16))) - 1 : 0;
      const armor =
        (Number(type) as IEnemyType) === 3 && Math.random() > 0.5 ? Math.floor(Math.sqrt(randomInt(1, 9))) : 0;

      tank.setAward(award);
      tank.setArmor(armor);
      this.controllerContainer.addController(new EnemyController(tank));
    });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const enemyRemain = this.enemies.length - this.enemyCount;
    for (let i = 0; i < enemyRemain; i++) {
      const _l = i % 2;
      const _t = (i / 2) | 0;
      ctx.drawImage(R.Image.tool, 0, 16, 16, 16, PL + _l * 16, PT + _t * 16, 16, 16);
    }
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (event.type === EVENT.GAME.PAUSE) {
      this.pause = !this.pause;
    } else if (isTankEvent(event) && event.type === EVENT.TANK.ENEMY_TANK_DESTROYED) {
      this.enemyAlive--;

      if (this.enemyAlive === 0 && this.enemyCount >= this.enemies.length) {
        this.eventManager.fireEvent({ type: EVENT.TANK.LAST_ENEMY_TANK_DESTROYED });
      }

      const tank = event.tank;
      const controllers = this.controllerContainer.getAllController();
      for (let i = 0; i < controllers.length; i++) {
        if (controllers[i].getTank() === tank) {
          this.controllerContainer.removeController(controllers[i]);
          break;
        }
      }
    }
  }
}
