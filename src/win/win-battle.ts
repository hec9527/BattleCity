import Config from '@/config/const';
import Game from '@/object/game';
import Reward from '@/object/reward';
import AllyTank from '@/object/tank-ally';
import EnemyTank from '@/object/tank-enemy';
import { getBattleFiledBackground } from '@/util/off-screen-canvas';
import Win from './win';

const G = Game.getInstance();

class WinBattle extends Win {
  private taggleWin = Config.canvas.height / 2;
  private backImage: HTMLCanvasElement;
  constructor() {
    super();

    EnemyTank.initEnemyCamp(G.stage);

    this.backImage = getBattleFiledBackground();

    this.addEntity(new AllyTank({ world: this }));
    this.addEntity(new AllyTank({ world: this, isDeputy: true }));
    Reward.getNewReward({ world: this });
  }

  update(): void {
    if (this.taggleWin > 0) {
      this.taggleWin -= 10;
    }

    // 尝试生成新的敌人
    EnemyTank.initEnemyTank({ world: this });

    this.entityList.forEach(entity => entity.update(Array.from(this.entityList)));
  }

  draw(): void {
    this.ctx.drawImage(this.backImage, 0, 0);

    this.entityList.forEach(entity => entity.draw());

    if (this.taggleWin > 0) {
      this.ctx.fillStyle = Config.colors.gray;
      this.ctx.fillRect(0, 0, Config.canvas.width, this.taggleWin);
      this.ctx.fillRect(0, Config.canvas.height - this.taggleWin, Config.canvas.width, this.taggleWin);
    }
  }
}

export default WinBattle;
