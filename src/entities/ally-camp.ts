import config from '../config';
import EVENT from '../event';
import Ticker from '../object/ticker';
import AllyTank, { birthPlace } from './ally-tank';
import AllyController from './ally-controller';
import BirthAnimation from './birth-animation';
import { isTankEvent } from '../object/guard';
import { R } from '../loader';

const PT = 245;
const PL = 470;

export default class AllyCamp implements ISubScriber {
  private eventManager = EVENT.EM;
  private createTask: ITicker[] = [];
  private players: IPlayer[] = [];
  private defeat = false;
  private palsy = false;
  private stage: number;

  constructor(players: IPlayer[], stage: number) {
    this.stage = stage;
    this.players = players;
    this.players.forEach(player => {
      this.create(player);
      player.resetKillRecord();
    });

    this.eventManager.addSubscriber(this, [
      EVENT.TANK.ALLY_TANK_DESTROYED,
      EVENT.BASE.DESTROY,
      EVENT.MINE.ALLY_OVER,
      EVENT.AWARD.ENEMY_PICK_MINE,
    ]);
  }

  public create(player: IPlayer) {
    const role = player.getRoleType();
    const rect = birthPlace[role];
    const playerTank = player.getTank();
    if (!playerTank && player.getLife() === 0) {
      return;
    }

    if (!playerTank && player.getLife() > 0) {
      player.reduceLife();
    }

    new BirthAnimation(rect, () => {
      const tank = new AllyTank(player);

      if (playerTank) {
        tank.inheritFromTank(playerTank);
      }

      player.setTank(tank);

      if (!this.defeat) {
        const controller = new AllyController(tank);
        controller.setPalsy(this.palsy);
      }
    });
  }

  public update(): void {
    this.createTask.forEach(task => task.update());
    // this.createTask[0]?.update();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = config.colors.black;
    ctx.font = '16px prestart';
    ctx.textBaseline = 'alphabetic';
    this.players.forEach((player, index) => {
      const top = PT + 50 * index;

      ctx.fillText(`${index + 1}P`, PL, top);
      ctx.drawImage(R.Image.tool, 16, 16, 16, 16, PL, top + 4, 16, 16);
      ctx.fillText(player.getLife().toString(), PL + 16, top + 18);
    });
    ctx.drawImage(R.Image.tool, 128, 0, 32, 32, 470, 345, 32, 32);
    ctx.textAlign = 'center';
    ctx.fillText(this.stage.toString(), 495, 385);
    ctx.restore();
  }

  public notify(event: INotifyEvent<Record<string, unknown>>): void {
    if (isTankEvent(event) && event.type === EVENT.TANK.ALLY_TANK_DESTROYED) {
      const player = (event.tank as IAllyTank).getPlayer();
      player.setTank(null);

      if (this.players.filter(player => player.getTank() || player.getLife() > 0).length > 0) {
        this.createTask.push(
          new Ticker(config.entity.createAllyInterval, () => {
            this.create(player);
          }),
        );
      } else {
        this.defeat = true;
        this.eventManager.fireEvent({ type: EVENT.GAME.DEFEAT });
        return;
      }
    } else if (event.type === EVENT.BASE.DESTROY) {
      this.defeat = true;
    } else if (event.type === EVENT.MINE.ALLY_OVER) {
      this.palsy = false;
    } else if (event.type === EVENT.AWARD.ENEMY_PICK_MINE) {
      this.palsy = true;
    }
  }
}
