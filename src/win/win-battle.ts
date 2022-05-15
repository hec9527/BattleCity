import Config from '../config/const';
import { Resource } from '../loader';
import Game from '../object/game';
import Brick from '../entities/brick';
import EnemyTank from '../entities/enemy-tank';
import { getBattleFiledBackground } from '../util/off-screen-canvas';
import Win from './win';
import brick from '../config/brick';
import { Ticker } from '../util/ticker';
import Print from '../util/print';
import AllyTank from '../entities/ally-tank';
import Reward from '../entities/reward';

const G = Game.getInstance();
const R = Resource.getResource();
const PT = Config.battleField.paddingTop + 15;
const PL = Config.battleField.paddingLeft + Config.battleField.width + 15;

class WinBattle extends Win {
  private toggleWin = Config.canvas.height / 2;
  private toggleOver = Config.canvas.height - 20;
  private backImage: HTMLCanvasElement;
  private mapData: IMapData;
  private gameOverTextLeft: number;

  private battleOverTicker: Ticker | undefined;

  constructor() {
    super();

    Print.info(`stage:${G.getStage()}, mode:${G.getMode()}`);

    R.Audio.play('start');

    // TODO
    EnemyTank.initEnemyCamp(G.getStage());

    this.ctx.fg.font = 'bolder 20px prestart';
    this.ctx.fg.fillStyle = Config.colors.red;
    this.gameOverTextLeft = (Config.canvas.width - this.ctx.fg.measureText('GAME OVER').width) / 2;

    this.mapData = G.getMapData();
    this.backImage = getBattleFiledBackground();
    this.game.getPlayer().forEach((p, i) => {
      let tank = p.getTank();
      if (tank) {
        this.addEntity(new AllyTank(i === 1, tank));
      } else {
        tank = p.getNewTank();
      }
    });
    this.addBrickEntity();
    window.addEventListener('dblclick', () => {
      Reward.getNewReward();
    });
  }

  private addBrickEntity() {
    this.mapData.forEach((row, rIndex) => {
      row.forEach((_, cIndex) => {
        const index = this.mapData[rIndex][cIndex];
        if (index == brick.blank) return;
        new Brick({ pos: [cIndex * 32, rIndex * 32], index });
      });
    });
  }

  private drawEnemyFlag() {
    const num = EnemyTank.getEnemyRemainNum();
    if (num <= 0) return;

    for (let i = 0; i < num; i++) {
      const _l = i % 2;
      const _t = (i / 2) | 0;
      this.ctx.bg.drawImage(R.Image.tool, 0, 16, 16, 16, PL + _l * 16, PT + _t * 16, 16, 16);
    }
  }

  private drawAllyLife() {
    const [p1, p2] = G.getPlayer();
    this.ctx.bg.font = '16px prestart';
    this.ctx.bg.fillText(String(p1.getLife()), PL + 20, Config.battleField.height - 120);
    if (G.getMode() === 'double') {
      this.ctx.bg.fillText(String(p2.getLife()), PL + 20, Config.battleField.height - 65);
    }
  }

  over(type: 'victory' | 'defeated'): void {
    this.battleOverTicker = new Ticker(Config.ticker.battleOver * 5, () => {
      this.battleOverTicker && this.delTicker(this.battleOverTicker);
      this.battleOverTicker = undefined;
      // 添加一个 win-over 结算画面?
      import(type === 'defeated' ? './win-start' : './win-settle').then(({ default: Win }) => {
        super.next(true, () => new Win());
      });
    });
    this.addTicker(this.battleOverTicker);
  }

  update(): void {
    if (this.toggleWin > 0) {
      this.toggleWin -= 5;
    }

    if (G.getGameOver()) {
      if (this.toggleOver >= Config.canvas.height / 2) {
        this.toggleOver -= 2;
      }
      if (!this.battleOverTicker) {
        this.over('defeated');
      }
    }

    this.entityList.forEach(entity => entity.update(Array.from(this.entityList)));

    if (EnemyTank.getEnemyRemainNum() > 0) {
      // 尝试生成新的敌人
      EnemyTank.initEnemyTank();
    } else {
      if (EnemyTank.getEnemyAliveTank().size <= 0) {
        // this.over('victory');
      }
    }
  }

  draw(): void {
    this.ctx.main.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.fg.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
    this.ctx.bg.drawImage(this.backImage, 0, 0);

    this.drawAllyLife();
    this.drawEnemyFlag();
    this.entityList.forEach(entity => entity.draw());

    if (this.toggleWin > 0) {
      this.ctx.fg.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
      this.ctx.fg.fillStyle = Config.colors.gray;
      this.ctx.fg.fillRect(0, 0, Config.canvas.width, this.toggleWin);
      this.ctx.fg.fillRect(0, Config.canvas.height - this.toggleWin, Config.canvas.width, this.toggleWin);
    }

    if (G.getGameOver()) {
      this.ctx.fg.fillStyle = Config.colors.red;
      this.ctx.fg.fillText('GAME OVER', this.gameOverTextLeft, this.toggleOver);
    }
  }
}

export default WinBattle;
