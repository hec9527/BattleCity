import Config from '@/config/const';
import Win from './win';

class WinSelect extends Win {
  protected taggleWin = 0;
  protected status: 'fadeIn' | 'fadeOut' | 'turn' = 'fadeIn';

  constructor() {
    super();
  }

  update(): void {
    if (this.status === 'fadeIn') {
      if (++this.taggleWin >= Config.canvas.height / 2) {
        this.status = 'turn';
      }
    } else if (this.status === 'turn') {
      //
    } else if (this.status === 'fadeOut') {
      //
    }
  }
  draw(): void {
    //
  }
}

export default WinSelect;
