import Config from '@/config/const';
import { getCanvas } from './index';
import { Resource } from '@/loader';
import Game from '@/object/game';

const G = Game.getInstance();
const R = Resource.getResource();
const textMarginleft = (Config.canvas.width / 2 - 60) | 0;
const paddingleft = Config.battleField.paddingLeft + Config.battleField.width + 15;

/** 欢迎背景 */
export function getWinStartBackground(): HTMLCanvasElement {
  const [canvas, ctx] = getCanvas(Config.canvas.width, Config.canvas.height);
  ctx.fillStyle = Config.colors.black;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(R.Image.UI, 0, 0, 376, 136, 68, 80, 376, 136);

  // 底部信息
  ctx.font = '16px prestart';
  ctx.fillStyle = Config.colors.red;
  ctx.fillText('HEC9527', textMarginleft + 20, 365);
  ctx.fillStyle = Config.colors.white_100;
  ctx.fillText('© 1995 2021', textMarginleft - 20, 400);
  ctx.fillText('ALL RIGHTS RESERVED', textMarginleft - 70, 425);
  // 选项
  ctx.fillText('1 PLAYER', textMarginleft, 260);
  ctx.fillText('2 PLAYERS', textMarginleft, 295);
  ctx.fillText('CONSTRUCTION', textMarginleft, 330);
  // 顶部信息
  ctx.font = '14px prestart';
  ctx.fillText('1P-', 50, 40);
  ctx.fillText('HI-', 200, 40);
  ctx.fillText('2P-', 350, 40);
  ctx.textAlign = 'right';
  ctx.fillText('00', 175, 40);
  ctx.fillText('20000', 325, 40);
  ctx.fillText('00', 475, 40);
  return canvas;
}

/** 构建场地 */
export function getConstructionBackground(): ICanvasCompose {
  const [canvas, ctx] = getCanvas(Config.canvas.width, Config.canvas.height);
  ctx.fillStyle = Config.colors.gray;
  ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
  ctx.fillStyle = Config.colors.black;
  ctx.fillRect(
    Config.battleField.paddingLeft,
    Config.battleField.paddingTop,
    Config.battleField.width,
    Config.battleField.height,
  );
  return [canvas, ctx];
}

/** 战场背景 */
export function getBattleFiledBackground(): HTMLCanvasElement {
  const [canvas, ctx] = getConstructionBackground();
  ctx.font = '16px prestart';
  ctx.fillText('1P', paddingleft, Config.battleField.height - 140);
  ctx.drawImage(R.Image.tool, 16, 16, 16, 16, paddingleft, Config.battleField.height - 135, 16, 16);
  if (G.mode === 'double') {
    ctx.fillText('2P', paddingleft, Config.battleField.height - 85);
    ctx.drawImage(R.Image.tool, 16, 16, 16, 16, paddingleft, Config.battleField.height - 80, 16, 16);
  }
  ctx.drawImage(R.Image.tool, 32 * 4, 0, 32, 32, paddingleft, Config.battleField.height - 45, 32, 32);

  return canvas;
}
