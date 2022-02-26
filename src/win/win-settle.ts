import Config from '../config/const';
import Win from './win';

class WinSettle extends Win {
  constructor() {
    super();
  }

  draw(): void {
    //
  }

  update(): void {
    this.ctx.bg.fillStyle = '#abf';
    this.ctx.bg.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
  }
}

export default WinSettle;
