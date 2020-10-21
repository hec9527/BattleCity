const GAME_CONFIG_KEYS = {
  p1: {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
    a: 'g', // single g
    b: 'h', // double h
    start: 'b', // start
  },
  p2: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    a: 'k', // single
    b: 'l', // double
  },
};

const GAME_ARGS_CONFIG = {
  RANK: 1, // 当前关卡
  MAPEDIT: false, // 自定义地图
  PLAYERNUM: 1, // 玩家数量
  HISTORY: [], // 历史最高
  PLAYERS: [{ life: 3, tank: null }],
};

const TANK_ALLY_OPTION = {
  speed: 2,
  isDeputy: false,
};
