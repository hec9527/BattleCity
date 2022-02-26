export enum Brick {
  blank = 0,
  brick = 1,
  brickTop = 2,
  brickRight = 3,
  brickBottom = 4,
  brickLeft = 5,
  iron = 6,
  ironTop = 7,
  ironRight = 8,
  ironBottom = 9,
  ironLeft = 10,
  /** 森林 */
  grass = 11,
  /** 冰 */
  ice = 12,
  /** 河流1 */
  river1 = 13,
  /** 河流2 */
  river2 = 14,
  boss = 15,
  bossBroken = 16,
  brickLeftBottom = 17,
  brickRightBottom = 18,
  ironLeftBottom = 19,
  ironRightBottom = 20,
}

/** 完整的砖块 */
export const fullBrick = [
  Brick.brick,
  Brick.iron,
  Brick.grass,
  Brick.ice,
  Brick.river1,
  Brick.river2,
  Brick.boss,
  Brick.bossBroken,
];

/** 缺失左上的砖块 */
export const missLeftTopBrick = [
  Brick.brickRight,
  Brick.brickBottom,
  Brick.ironRight,
  Brick.ironBottom,
  Brick.brickLeftBottom,
  Brick.brickRightBottom,
  Brick.ironLeftBottom,
  Brick.ironRightBottom,
];

/** 缺失右上的砖块 */
export const missRightTopBrick = [
  Brick.brickLeft,
  Brick.brickBottom,
  Brick.ironLeft,
  Brick.ironBottom,
  Brick.brickLeftBottom,
  Brick.brickRightBottom,
  Brick.ironLeftBottom,
  Brick.ironRightBottom,
];

/** 缺失左下的砖块 */
export const missLeftBottomBrick = [
  Brick.brickTop,
  Brick.brickRight,
  Brick.ironTop,
  Brick.ironRight,
  Brick.brickRightBottom,
  Brick.ironRightBottom,
];

/** 缺失右下的砖块 */
export const missRightBottomBrick = [
  Brick.brickTop,
  Brick.brickLeft,
  Brick.ironTop,
  Brick.brickLeft,
  Brick.brickLeftBottom,
  Brick.ironLeftBottom,
];

export default Brick;
