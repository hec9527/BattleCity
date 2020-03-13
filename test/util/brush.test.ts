import { getCanvas } from '@/util';
import { brush } from '@/util/brush';

describe('brush test', () => {
  test('brush should have property bg, main, misc', () => {
    expect(brush.bg).toBeDefined();
    expect(brush.main).toBeDefined();
    expect(brush.misc).toBeDefined();
  });

  test('brush should have two methods clear and draw', () => {
    const { canvas } = getCanvas(516, 456);
    (['bg', 'main', 'misc'] as const).forEach(type => {
      expect(brush[type].clear).toBeDefined();
      expect(brush[type].clear(true)).toBeUndefined();
      expect(brush[type].clear(0, 0, canvas.width, canvas.height)).toBeUndefined();
      expect(brush[type].draw).toBeDefined();
      expect(brush[type].draw(canvas, 0, 0, 32, 32, 0, 0, 32, 32)).toBeUndefined();
    });
  });
});
