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
    moveStatus: 10,
    moveStatusFast: 5,
    moveStatusSlow: 20,
    // moveStatus
    /** 出身动画时间 */
    brith: 100,
    brithStatus: 5,
    /** 保护罩 10s 600帧 */
    protecter: 600,
    protecterShort: 300,
    protecterStatus: 3,
    /** 奖励持续时间 */
    reward: 600,
    rewardStatus: 15,
    /** 转向间隔 */
    changeDirection: 5,
    /** 爆炸持续时间 */
    explode: 30,
    explodeStatus: 5,
    /** 子弹爆炸时间 */
    explodeBullet: 10,
    /** 子弹爆炸时间 */
    explodeStatusbullet: 3,
  },
  colors: {
    black: '#000',
    gray: '#d3d3d3',
    red: '#b82619',
    white_100: '#f5f5f5',
  },
  entity: {
    allyTank: {
      speed: 2, // 正常值
    },
    enemyTank: {
      // 实例参数
      speed: 2,
      speedSlow: 1.5,
      speedFast: 2.7,
      // 类参数
      combatAblitiyBase: 30, // 战斗值，越高越容易生成高级坦克
      combatUnit: 5, // 作战单位， 同时在场个数
    },
    bullet: {
      speed: 3, // 子弹速度
    },
  },
};

export default Config;
