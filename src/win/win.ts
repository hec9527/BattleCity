/**
 * 窗体类
 */

import Entity from '@/object/entity';
import EnemeyTank from '@/object/tank-enemy';
import { TickerList, Ticker } from '@/util/ticker';
import Source from '@/loader/index';
import { getCanvas } from '@/util';
import { GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT } from '@/config/const';

class Win {
  private entity: Set<Entity> = new Set<Entity>();
  private tickerList: TickerList = new TickerList();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private source: Source;

  constructor(source: Source) {
    const { canvas, ctx } = getCanvas(GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT, 'game');
    this.canvas = canvas;
    this.ctx = ctx;
    this.source = source;
    this.addEntity(new EnemeyTank({ world: this }));
    this.anima();
  }

  public addEntity(entity: Entity) {
    this.entity.add(entity);
  }

  public delEntity(entity: Entity) {
    this.entity.delete(entity);
  }

  public anima() {
    requestAnimationFrame(() => this.anima());
    this.update();
    this.draw();
  }

  private update() {
    this.entity.forEach(entity => entity.update(Array.from(this.entity)));
  }

  private draw() {
    this.ctx.drawImage(this.source.IMAGES.Cache.myTank, 32, 32, 32, 32, 64, 64, 32, 32);
  }

  /** 关闭当前win, 跳转到其它win */
  private next(win: Win) {
    // new Win();
  }
}

export default Win;
