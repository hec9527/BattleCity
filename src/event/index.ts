import { default as EM } from './event-manager';

const ENTITY = {
  MOVE: 'ENTITY_MOVE',
  CREATED: 'ENTITY_CREATED',
  DESTROYED: 'ENTITY_DESTROYED',
};

const TANK = {
  SHOOT: 'TANK_SHOOT',
  CREATE: 'TANK_CREATE',
  DESTROYED: 'TANK_DESTROYED',
  AWARD_TANK_HIT: 'AWARD_TANK_HIT',
  ALLY_TANK_DESTROYED: 'ALLY_TANK_DESTROYED',
  ENEMY_TANK_DESTROYED: 'ENEMY_TANK_DESTROYED',
  LAST_ENEMY_TANK_DESTROYED: 'LAST_ENEMY_TANK_DESTROYED',
};

const BULLET = {
  DESTROYED: 'BULLET_DESTROYED',
};

const AWARD = {
  DESTROYED: 'AWARD_DESTROYED',
};

const COLLISION = {
  BORDER: 'COLLISION_BORDER',
  ENTITY: 'COLLISION_ENTITY',
};

const KEYBOARD = {
  PRESS: 'KEY_PRESS',
  RELEASE: 'KEY_RELEASE',
};

const CONTROL = {
  P1: {
    UP: 'P1_UP',
    RIGHT: 'P1_RIGHT',
    DOWN: 'P1_DOWN',
    LEFT: 'P1_LEFT',
    A: 'P1_A',
    B: 'P1_B',
    SELECT: 'P1_SELECT',
    START: 'P1_START',
  },
  P2: {
    UP: 'P2_UP',
    RIGHT: 'P2_RIGHT',
    DOWN: 'P2_DOWN',
    LEFT: 'P2_LEFT',
    A: 'P2_A',
    B: 'P2_B',
  },
};

const GAME = {
  OVER: 'GAME_OVER',
  PAUSE: 'GAME_PAUSE',
  BATTLE_START: 'GAME_BATTLE_START',
};

export default {
  EM,
  KEYBOARD,
  AWARD,
  ENTITY,
  TANK,
  BULLET,
  COLLISION,
  CONTROL,
  GAME,
};
