import Config from '@/config/const';
import { Resource } from '@/loader';
import Game from '@/object/game';
import Reward from '@/entities/reward';
import AllyTank from '@/entities/tank-ally';
import EnemyTank from '@/entities/tank-enemy';
import { getBattleFiledBackground } from '@/util/off-screen-canvas';
import Win from './win';

const G = Game.getInstance();
const R = Resource.getResource();

class WinBattle extends Win {
  private taggleWin = Config.canvas.height / 2;
  private backImage: HTMLCanvasElement;
  constructor() {
    super();

    EnemyTank.initEnemyCamp(G.stage);

    this.backImage = getBattleFiledBackground();

    this.addEntity(new AllyTank({ world: this }));
    this.addEntity(new AllyTank({ world: this, isDeputy: true }));
    // Reward.getNewReward({ world: this });
  }

  private drawEnemyFlag() {
    const num = EnemyTank.getEnemyRemainNum();
    if (num <= 0) return;
    console.log('enemy remain:', num);

    const x = Config.battleField.paddingLeft + Config.battleField.width + 15;
    const y = Config.battleField.paddingTop + 15;
    for (let i = 0; i < num; i++) {
      const _l = i % 2;
      const _t = (i / 2) | 0;
      this.ctx.bg.drawImage(R.Image.tool, 0, 16, 16, 16, x + _l * 16, y + _t * 16, 16, 16);
    }
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
    this.ctx.bg.drawImage(this.backImage, 0, 0);

    this.drawEnemyFlag();
    this.entityList.forEach(entity => entity.draw());

    if (this.taggleWin > 0) {
      this.ctx.fg.fillStyle = Config.colors.gray;
      this.ctx.fg.fillRect(0, 0, Config.canvas.width, this.taggleWin);
      this.ctx.fg.fillRect(0, Config.canvas.height - this.taggleWin, Config.canvas.width, this.taggleWin);
    }
  }
}

export default WinBattle;
