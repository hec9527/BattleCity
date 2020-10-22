/**
 * @author     hec9527
 * @time       2020-01-24
 * @change     2020-01-24
 * @description
 *      Battle City
 *
 *   1. 采用闭包的方式，防止修改游戏运行参数
 */

/** 外部控制变量，是否开启帧数显示 */
let SHOW_FPS = true;

window.addEventListener('load', () => {
  for (let i = 0; i < 13; i++) GAME_CONFIG_CUSTOME_MAP.push(new Array(13).fill(0));

  (function main() {
    if (!GAME_ASSETS_IMAGE.isLoad() || !GAME_ASSETS_SOUND.isLoad())
      return setTimeout(() => main(), 10);
    new WinStart();
    fixMap(true);
    // Printer.copyright();
  })();

  setTimeout(() => {
    const { canvas, ctx } = getCanvas(516, 456, 'canvas');
    // ctx.fillStyle = '#e3e3e3';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    let img = GAME_ASSETS_IMAGE.getEnemyTankStrong();

    // const word = {
    //   entity: new Set(),
    //   addEntity: function (e) {
    //     this.entity.add(e);
    //   },
    //   delEntity: function (e) {
    //     this.entity.delete(e);
    //   },
    //   anima() {
    //     this.entity.forEach((e) => e.update() || e.draw());
    //     requestAnimationFrame(() => this.anima());
    //     console.log(this);
    //   },
    // };

    // new BrickFragment({ word, col: 1, row: 1, index: 3, pos: [40, 50] });

    // word.anima();
    // console.log(img);
    // [类型][普通/带奖励][方向][形态]   类型=3 奖励0-3
    // img = img[3][0];
    // console.log(img);
    // ctx.drawImage(img[1][0][0], 150, 150);
    // for (let i = 0; i < img.length; i++) {
    //   ctx.drawImage(img[i], 50 + 32 * (i - 0), 160);
    // }
    // // ctx.drawImage(img[0], 0, 0);
  }, 200);
});
