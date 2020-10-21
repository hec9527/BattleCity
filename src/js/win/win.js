/**
 * 游戏窗体类
 * 其它窗体继承该窗体，统一行为
 */
class Win {
  constructor() {
    const { canvas, ctx } = getCanvas(516, 456, 'canvas');
    this.canvas = canvas;
    this.ctx = ctx;
    this.lastT = new Date();
    this.tick = 0;
    this.FPS = 0;
    this.isOver = false;
    this.entity = new Set();

    document.fonts.ready.then(() => {
      this.getBackground && (this.background = this.getBackground());
      Printer.info('字体加载完成');
    });
  }
  /** 添加实体演员 */
  addEntity(entity) {
    this.entity.add(entity);
  }
  /** 删除实体演员 */
  delEntity(entity) {
    this.entity.delete(entity);
  }
  /** 更新窗体 */
  update() {
    throw new Error('Window instance show have their own update method');
  }
  /** 绘制演员 */
  draw() {
    throw new Error('Window instance show have their own draw method');
  }
  /** 循环渲染 */
  anima() {
    this.update();
    this.draw();

    // show FPS
    if (SHOW_FPS) {
      ++this.tick;
      if (new Date() - this.lastT > 1000) {
        this.FPS = this.tick;
        this.tick = 0;
        this.lastT = new Date();
      }
      this.ctx.save();
      this.ctx.fillStyle = '#abf';
      this.ctx.font = '8px prstart, Songti';
      this.ctx.fillText(`FPS:${this.FPS}`, 5, 10);
      this.ctx.restore();
    }

    window.requestAnimationFrame(() => !this.isOver && this.anima());
    // setTimeout(() => !this.isOver && this.anima(), 50);
  }
}
