/**
 * 相关常量
 * @author hec9527
 */

export const Config = {
  resource: {
    audios: ['attack', 'attackOver', 'bomb', 'count', 'eat', 'life', 'misc', 'move', 'over', 'pause', 'start'],
    images: ['bonus', 'brick', 'enemyTank', 'explode', 'getScore', 'getScoreDouble', 'myTank', 'tool', 'UI'],
  },
  canvas: {
    width: 516,
    height: 456,
    canvasId: 'game',
  },
  battleField: {
    width: 416,
    height: 416,
    paddingTop: 20,
    paddingLeft: 35,
  },
  ticker: {
    /** 射击间隔时间 */
    shoot: 20,
    /** 改变移动状态 */
    moveStatus: 8,
    moveStatusFast: 5,
    moveStatusSlow: 12,
    /** 出身动画时间 */
    brith: 100,
    /** 保护罩 */
    protecter: 300,
    /** 奖励持续时间 */
    reward: 200,
    /** 转向间隔 */
    changeDirection: 5,
    /** 爆炸持续时间 */
    explode: 30,
  },
};

export default Config;
