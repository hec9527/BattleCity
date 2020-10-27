/**
 * 碰撞检测： 边界、坦克、奖励、砖块
 * 我方坦克贴图[level][dir][status]
 * 敌方坦克贴图[普通/奖励][方向][形态]
 */
class Tank extends Entity {
  constructor(props) {
    super(props);
    this.dir = 0; // 0上   1右   2下    3左
    this.speed = props.speed || 1; // 移动速度
    this.bullet = new Set();
    this.bulletNum = 1; // 默认坦克子弹数量为1
    this.level = props.level || 0; // 坦克等级
    this.life = 1; // 生命
    this.status = 0; // 状态
    this.tickStatus = 0; // 状态计时
    this.tickShoot = 0; // 射击间隔
    this.isProtected = false; // 保护罩
  }

  changeImg() {
    return (this.img = this.imgList[this.level][this.dir][this.status]);
  }

  changeDir(dir) {
    let [x, y, w, h] = this.rect;

    this.dir = this instanceof TankAlly ? dir : (Math.random() * 4) | 0;

    // 上下
    if (this.dir % 2) {
      y = Math.round(y / 16) * 16;
    } else {
      x = Math.round(x / 16) * 16;
    }

    this.rect = [x, y, w, h];

    this.changeImg();
  }

  getReward(type) {
    const reward = ['铁锹', '五角星', '坦克', '安全帽', '炸弹', '定时器'];
    Printer.info(`玩家${this.isDeputy ? '二' : '一'}：获取道具-${reward[type]}`);
    switch (type) {
      case 0: {
        // TODO 添加 Wall 围墙类
        break;
      }
      case 1: {
        this.upgrade && this.upgrade();
        break;
      }
      case 2: {
        GAME_ASSETS_SOUND.play('life');
        GAME_ARGS_CONFIG.PLAYERS[this.isDeputy ? 1 : 0].life++;
        this.word.getBackground && this.word.getBackground();
        break;
      }
      case 3: {
        this.addProtecter && this.addProtecter();
        break;
      }
      case 4: {
        GAME_ASSETS_SOUND.play('bomb');
        this.word.entity.forEach((entity) => {
          if (entity instanceof TankEnemy) {
            entity.die(true);
          }
        });
        break;
      }
      case 5: {
        // TODO 定时器
        break;
      }
      default: {
        Printer.error(`未知奖励类型：${type}`);
      }
    }
  }

  move(entityLis) {
    let rect = move(this.rect, this.dir, this.speed);

    ++this.tickStatus;
    if (this.tickStatus > 5) {
      this.tickStatus = 0;
      this.status = this.status === 0 ? 1 : 0;
      this.changeImg();
    }

    // 边界
    if (!isCollisionBorder(rect)) {
      entityLis.forEach((entity) => {
        if (entity === this) return;

        // 我方坦克 获得 奖励
        if (entity instanceof Reward && this.camp === 1) {
          if (isCollisionEntity(rect, entity.rect)) {
            this.getReward(entity.type);
            entity.die();
          }
          // 坦克-坦克 碰撞检测
        } else if (entity instanceof Tank) {
          if (isCollisionEntity(rect, entity.rect)) {
            let distanceCurrent = getDistance(this.rect, entity.rect);
            let distanceAfterMove = getDistance(rect, entity.rect);
            if (distanceAfterMove < distanceCurrent) {
              rect = [...this.rect];
              this instanceof TankEnemy && this.changeDir();
            }
          }
          // 坦克-砖块 碰撞检测
        } else if (entity instanceof Brick) {
          if (entity.collision === 1 && isCollisionEntity(rect, entity.rect)) {
            rect = [...this.rect];
            this instanceof TankEnemy && this.changeDir();
          }
        }
      });
      this.rect = [...rect];
    } else if (this instanceof TankEnemy) {
      this.changeDir();
    }
  }

  shoot() {
    if (this.tickShoot <= 0 && this.bullet.size < this.bulletNum) {
      const [x, y] = this.rect;
      const dirs = {
        0: [x + 12, y],
        1: [x + 24, y + 12],
        2: [x + 12, y + 24],
        3: [x, y + 12],
      };
      const rect = [...dirs[this.dir], 8, 8];
      this.bullet.add(
        new Bullet({ dir: this.dir, camp: this.camp, rect, word: this.word, tank: this })
      );
      this.tickShoot = this.camp === 1 ? 15 : 30;
      this instanceof TankAlly && GAME_ASSETS_SOUND.play('attack');
    }
  }

  die() {
    super.die();
    new Explode({ word: this.word, pos: [this.rect[0] + 16, this.rect[1] + 16] });
    // GAME_ASSETS_SOUND.play('bomb');
  }
}
