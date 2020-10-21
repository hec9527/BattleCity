/**
 * 实体类
 */
class Entity {
  constructor(options) {
    const { canvas, ctx } = getCanvas(516, 456, 'canvas');
    this.word = options.word;
    this.canvas = canvas;
    this.ctx = ctx;
    this.rect = options.rect; // 实体位置，大小
    this.img = options.img; // 实体贴图
    this.camp = options.camp || 0; // -1 敌人   1 友军  0 中立
    this.collision = options.collision || 1; // 参与碰撞检测
    this.priority = 0; // 绘制优先级 1 先绘制，在下面

    this.word.addEntity(this);
  }

  draw() {
    this.ctx.drawImage(this.img, this.rect[0] + 35, this.rect[1] + 20);
  }

  die() {
    this.word.delEntity(this);
  }

  update() {
    throw new Error('Every instance inherited from entity show have their own update method');
  }
}
