import { brush } from '@src/util/brush';
import { getType } from '@src/util/index';

describe('brush test', () => {
  test('brush should have property bg, main, misc', () => {
    expect(brush.bg).toBeDefined();
    expect(brush.main).toBeDefined();
    expect(brush.misc).toBeDefined();
  });

  test("brush's canvas should have width 516, height 456", () => {
    (['bg', 'main', 'misc'] as const).forEach(type => {
      expect(brush[type].canvas.width).toBe(516);
      expect(brush[type].canvas.height).toBe(456);
      // brushs should be CanvasRenderingContext2D
      expect(getType(brush[type])).toBe('CanvasRenderingContext2D');
    });
  });

  test("brush's should have correct zIndex ", () => {
    expect(Number(brush.bg.canvas.style.zIndex)).toBeLessThan(
      Number(brush.main.canvas.style.zIndex)
    );
    expect(Number(brush.main.canvas.style.zIndex)).toBeLessThan(
      Number(brush.misc.canvas.style.zIndex)
    );
  });
});
