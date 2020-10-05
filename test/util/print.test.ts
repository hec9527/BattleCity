import { getType } from '@src/util/';
import print from '@src/util/print';

describe('print class test', () => {
  (['debug', 'info', 'warn', 'error', 'copyright'] as const).forEach(method => {
    test(`print.${method} should be defined`, () => {
      expect(print[method]).toBeDefined();
      expect(getType(print.debug)).toBe('Function');
      expect(print[method](method !== 'copyright' ? 'hello' : '')).toBeUndefined();
    });
  });
});
