import Brick from './brick';
import {
  fullBrick,
  missLeftBottomBrick,
  missLeftTopBrick,
  missRightBottomBrick,
  missRightTopBrick,
} from '../config/brick';

const fragmentPosition = [
  { x: 0, y: 0 },
  { x: 16, y: 0 },
  { x: 0, y: 16 },
  { x: 16, y: 16 },
];

export default class BrickConstructor {
  public static newBrick(brickIndex: number, rect: IEntityRect) {
    if (!fullBrick.includes(brickIndex)) {
      this.broken(brickIndex, rect);
    } else {
      const brick = new Brick(brickIndex);
      brick.setRect(rect);
    }
  }

  private static broken(brickIndex: number, rect: IEntityRect) {
    fragmentPosition.forEach((fragment, index) => {
      // prettier-ignore
      if (
        (index === 0 && missLeftTopBrick.includes(brickIndex)) ||
        (index === 1 && missRightTopBrick.includes(brickIndex)) ||
        (index === 2 && missLeftBottomBrick.includes(brickIndex)) ||
        (index === 3 && missRightBottomBrick.includes(brickIndex))
      ) {
        return;
      }
      const [x, y] = rect;

      import('./brick-fragment').then(({ default: BrickFragment }) => {
        const brickFragment = new BrickFragment(brickIndex);
        brickFragment.setRect([fragment.x + x, fragment.y + y, 16, 16]);
      });
    });
  }

  public static buildFromMapData(map: IMapData): void {
    for (const row in map) {
      for (const col in map[row]) {
        const brickIndex = map[row][col];
        if (brickIndex !== 0) {
          BrickConstructor.newBrick(brickIndex, [Number(col) * 32, Number(row) * 32, 32, 32]);
        }
      }
    }
  }
}
