import Config from '@/config/const';
import Win from './win';

class WinSettle extends Win {
  constructor() {
    super();
  }

  draw(): void {
    //
  }

  update(): void {
    this.ctx.fillStyle = '#abf';
    this.ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
  }
}

export default WinSettle;
