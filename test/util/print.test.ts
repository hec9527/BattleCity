import { getType } from '@/util/';
import print from '@/util/print';

describe('print class test', () => {
  const methods = ['debug', 'info', 'warn', 'error', 'log'] as const;
  let caches = {} as { [K in typeof methods[number]]: any };
  beforeEach(() => {
    methods.forEach(key => {
      caches[key] = global.console[key];
      global.console[key] = jest.fn();
    });
  });

  test(`print.property should be defined`, () => {
    (['debug', 'info', 'warn', 'error', 'copyright'] as const).forEach(method => {
      expect(print[method]).toBeDefined();
      expect(getType(print.debug)).toBe('Function');
      expect(print[method](method !== 'copyright' ? 'hello' : '')).toBeUndefined();
    });
  });
});
