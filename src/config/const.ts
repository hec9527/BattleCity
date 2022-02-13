/**
 * 相关常量
 * @author hec9527
 */

export const Config = {
  game: {
    /** 最小关卡 */
    minStage: 0,
    /** 最大关卡 */
    maxStage: 256,
  },
  resource: {
    audios: ['attack', 'attackOver', 'bomb', 'count', 'eat', 'life', 'misc', 'move', 'over', 'pause', 'start'] as const,
    images: ['bonus', 'brick', 'enemyTank', 'explode', 'getScore', 'getScoreDouble', 'myTank', 'tool', 'UI'] as const,
  },
  canvas: {
    width: 516,
    height: 456,
    canvasId: 'game',
    foregroundId: 'foreground',
    backgroundId: 'background',
  },
  battleField: {
    width: 416,
    height: 416,
    paddingTop: 20,
    paddingLeft: 35,
  },
  ticker: {
    /** 射击间隔时间 */
    shoot: 15,
    /** 改变移动状态 */
    moveStatus: 6,
    moveStatusFast: 3,
    moveStatusSlow: 20,
    // moveStatus
    /** 出身动画时间 */
    birth: 100,
    birthStatus: 5,
    /** 保护罩 10s 600帧 */
    protector: 600,
    protectorShort: 300,
    protectorStatus: 3,
    /** 奖励持续时间 */
    reward: 600,
    rewardStatus: 15,
    /** 转向间隔 */
    changeDirection: 5,
    /** 爆炸持续时间 */
    explode: 30,
    explodeStatus: 5,
    /** 子弹爆炸时间 */
    explodeBullet: 8,
    /** 子弹爆炸时间 */
    bulletExplodeStatus: 3,
    /** 定身时间 */
    stopStatus: 100,
  },
  colors: {
    black: '#000',
    gray: '#d3d3d3',
    red: '#b82619',
    white_100: '#f5f5f5',
  },
  entity: {
    allyTank: {
      birthPos: [[128, 384, 32, 32] as const, [256, 384, 32, 32] as const],
      speed: 2, // 正常值
      birthWait: 20,
    },
    enemyTank: {
      birthPos: [[0, 0, 32, 32] as const, [192, 0, 32, 32] as const, [384, 0, 32, 32] as const],
      // 实例参数
      speed: 1.8,
      speedSlow: 1.2,
      speedFast: 2.5,
      // 类参数
      combatAbilityBase: 30, // 战斗值，越高越容易生成高级坦克
      combatUnit: 5, // 作战单位， 同时在场个数
      birthWait: 30,
    },
    bullet: {
      speed: 3, // 子弹速度
      speedFast: 4.5, // 升级后的子弹
    },
  },
};

export default Config;
