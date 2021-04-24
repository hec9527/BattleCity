import { getBattleFiledBackground, getConstructionBackground, getWinStartBackground } from '@/util/off-screen-canvas';
import Resource from '@/loader/index';

// Resource().then(() => {});
describe('these function should return canvas html', () => {
  test('getBattleFiledBackground', () => {
    expect(getBattleFiledBackground()).toBeTruthy();
    expect(typeof getBattleFiledBackground()).toBe('HTMLCanvasElement');
  });
});
