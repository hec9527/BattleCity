/**
 * 子弹类
 */
class Bullet extends Entity {
  constructor(props) {
    super(props);
    this.dir = props.dir;
    this.rect = props.rect;
    this.camp = props.camp;
    this.tank = props.tank;
    this.speed = props.speed || 4;
    this.img = GAME_ASSETS_IMAGE.getBullet()[this.dir];
    this.level = props.level || 1;
  }

  update(EntityList) {
    const rect = move(this.rect, this.dir, this.speed);

    /** 子弹边界检测 */
    if (isCollisionBorder(rect)) return this.die(true);

    /** 子弹的碰撞检测 */
    EntityList.forEach((entity) => {
      if (entity === this) return;

      /** 子弹与子弹 */
      if (entity instanceof Bullet) {
        if (isCollisionEntity(rect, entity.rect)) {
          entity.die();
          this.die();
        }
      } else if (entity instanceof Tank && this.camp !== entity.camp) {
        /** 子弹与坦克的碰撞 */
        if (isCollisionEntity(rect, entity.rect)) {
          entity.die();
          this.die(!entity.isProtected);
        }
      } else if (entity instanceof Brick) {
        /** 子弹与砖块的碰撞, 砖块碎片也属于砖块，处理逻辑一样 */
        if (isCollisionEntity(rect, entity.rect)) {
          entity.die(this, () => this && this.die(true));
        }
      }
    });
    this.rect = [...rect];
  }

  getExplosePos() {
    const [x, y, w, h] = this.rect;
    const dirs = {
      0: [x + w / 2, y],
      1: [x + w, y + h / 2],
      2: [x + w / 2, y + h],
      3: [x, y + h / 2],
    };
    return dirs[this.dir];
  }

  die(flag = false) {
    this.tank.bullet.delete(this);
    super.die();
    flag && new Explode({ pos: this.getExplosePos(), word: this.word });
  }
}
