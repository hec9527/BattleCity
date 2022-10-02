const Config = {
  game: {
    /** 最小关卡 */
    minStage: 1,
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
    id: 'game',
  },
  battleField: {
    width: 416,
    height: 416,
    paddingTop: 20,
    paddingLeft: 35,
  },
  ticker: {
    startDelay: 60,
    stageChange: 2,
    cursorMove: 3,
    cursorBlink: 15,
    shootInterval: 20,
    /** 地雷 */
    mine: 600,
    /** 改变移动状态 */
    trackStatus: 15,
    trackStatusFast: 3,
    trackStatusSlow: 20,
    // moveStatus
    /** 出身动画时间 */
    birth: 70,
    birthStatus: 5,
    /** 保护罩 10s 600帧 */
    protector: 900,
    protectorStatus: 5,
    /** 奖励持续时间 */
    award: 600,
    awardBlink: 15,
    score: 15,
    /** 爆炸持续时间 */
    explodeBase: 27,
    explodeBullet: 10,
    explodeStatus: 3,
    /** 定身时间 */
    stopStatus: 600,
    /** 战斗结束停留时间 */
    battleOver: 400,
    /** 围墙建造后保持时间 */
    wallBuildKeep: 600,
    /** 围墙建造后闪烁时间 */
    wallBlink: 300,
    /** 围墙建造后闪烁间隔 */
    wallBlinkStatus: 30,
  },
  speed: {
    slowest: 1.1,
    slower: 1.3,
    slow: 1.5,
    normal: 1.8,
    fast: 2,
    faster: 2.2,
    fastest: 2.5,
  },
  colors: {
    black: '#000',
    gray: '#d3d3d3',
    red: '#b82619',
    white_100: '#f5f5f5',
  },
  explosion: {
    bullet: [0, 1, 2, 1],
    base: [0, 1, 2, 3, 4, 2],
  },
  entity: {
    createAllyInterval: 50,
    createEnemyInterval: 80,
    maxEnemyAlive: 5,
  },
  wall: [
    [11, 5],
    [11, 6],
    [11, 7],
    [12, 5],
    [12, 7],
  ] as [number, number][],
  base: [12 * 32, 6 * 32],
};

export default { ...Config };
