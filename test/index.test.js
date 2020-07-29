import { Tool, Print } from '../src/js/index.js';

describe('Tool工具类测试', () => {
  test('Tool.getPwd() should return "http://localhost/"', () => {
    expect(Tool.getPwd()).toBe('http://localhost/');
  });
});

describe('Print工具类测试', () => {
  const print = new Print();
  test('print.debug() should return undefined', () => {
    expect(print.debug('test msg')).toBe(undefined);
  });
  test('print.info() should return undefined', () => {
    expect(print.info('test msg')).toBe(undefined);
  });
  test('print.warn() should return undefined', () => {
    expect(print.warn('test msg')).toBe(undefined);
  });
  test('print.error() should return undefined', () => {
    expect(print.error('test msg')).toBe(undefined);
  });
  test('print.copyright() should return undefined', () => {
    expect(print.copyright()).toBe(undefined);
  });
});
