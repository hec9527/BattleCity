/**
 * # 砖块碎片
 * ```
 * 砖块受到子弹攻击之后会变成碎片
 * 碎片具有单独的rect和碰撞检测
 *
 * 土块碎片存在残缺的情况, 用status来标识每个16*16的砖块的状态，
 * 一级子弹每次打到8px
 * 为0则标识被打掉，全部status为0，则该碎片消失
 *
 * **** 只有一级子弹才能将砖块打残，2级子弹直接打掉 ******
 * **** 只有土碎片才能被打残缺，铁碎片直接消掉一小块 *****
 *
 * | 1 | 1 |
 * ---------
 * | 1 | 1 |
 *```
 */
class BrickFragment extends Brick {
  constructor(props) {
    super(props);
    this.rect = [...props.pos, 16, 16];
    this.status = new Array(4).fill(props.index);
    // this.img = GAME_ASSETS_IMAGE.getBrick()[props.index];

    this.init();
  }

  init() {
    if ([1, 2, 3, 4, 5, 17, 18].includes(this.index)) {
      this.index = 1;
    } else if ([6, 7, 8, 9, 10, 19, 20].includes(this.index)) {
      this.index = 6;
    }
    const { canvas, ctx } = getCanvas(16, 16);
    ctx.drawImage(GAME_ASSETS_IMAGE.getBrick()[this.index], 0, 0);
    this.img = canvas;
    this.c = ctx;
  }

  reduce() {
    this.status.forEach((s, i) => {
      if (s === 0) {
        let x = [1, 3].includes(i) ? 8 : 0;
        let y = [2, 3].includes(i) ? 8 : 0;
        this.c.clearRect(x, y, 8, 8);
      }
    });
  }

  die({ level, dir }, callback) {
    switch (this.index) {
      /** 铁块，需要4级以上的子弹才能打碎 */
      case 6: {
        // 此处不用`super.die()` 是因为父级Brick的 die 方法在此处没有意义
        level >= 4 && Entity.prototype.die.call(this);
        callback();
        break;
      }
      /** 土块，任何等级的子弹都能打碎 */
      case 1: {
        if (level >= 2) {
          Entity.prototype.die.call(this);
          return;
        }
        switch (dir) {
          case 0: {
            if (this.status[2] === 0 && this.status[3] === 0) {
              this.status[0] = this.status[1] = 0;
            } else {
              this.status[2] = this.status[3] = 0;
            }
            break;
          }
          case 1: {
            if (this.status[0] === 0 && this.status[2] === 0) {
              this.status[1] = this.status[3] = 0;
            } else {
              this.status[0] = this.status[2] = 0;
            }
            break;
          }
          case 2: {
            if (this.status[0] === 0 && this.status[1] === 0) {
              this.status[2] = this.status[3] = 0;
            } else {
              this.status[0] = this.status[1] = 0;
            }
            break;
          }
          case 3: {
            if (this.status[1] === 0 && this.status[3] === 0) {
              this.status[0] = this.status[2] = 0;
            } else {
              this.status[1] = this.status[3] = 0;
            }
          }
        }

        if (this.status.reduce((pre, cur) => pre + cur, 0) === 0) {
          Entity.prototype.die.call(this);
        } else {
          this.reduce();
        }
        callback();
      }
    }
  }

  update() {}
}
