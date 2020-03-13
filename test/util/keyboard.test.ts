import keyboard, { Keyboard } from '@/util/keyboard';
import Config from '@/config/keys';

// maybe some other controler willbe add
describe('keyboard control test', () => {
  describe('keyboard instance test', () => {
    test('keyboard should be instalceof keyboard class', () => {
      expect(keyboard).toBeInstanceOf(Keyboard);
    });

    test('keyboard should be defined', () => {
      expect(keyboard).toBeDefined();
    });
  });

  describe('keyboard.isSingleKey method test', () => {
    beforeEach(() => {
      // to emit the 'keydown' event
      document.dispatchEvent(new KeyboardEvent('keydown', { key: Config.P2.Right }));
    });

    test('keyboard.isSingleKey should be defined', () => {
      expect(keyboard.isSingleKey).toBeDefined();
    });

    test(`key ${Config.P2.Right} should be pressed once`, () => {
      expect(keyboard.isSingleKey(Config.P2.Right)).toBeTruthy();
      expect(keyboard.isSingleKey(Config.P2.Right)).toBeFalsy();
    });

    test(`key ${Config.P2.Right} should not be pressed`, () => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: Config.P2.Right }));
      expect(keyboard.isSingleKey(Config.P2.Right)).toBeFalsy();
    });
  });

  describe('keyBoard.isPressedKey method test', () => {
    test('keyBoard.isPressedKey should be defined', () => {
      expect(keyboard.isSingleKey).toBeDefined();
    });

    test(`key ${Config.P2.Right} should be pressed check many times`, () => {
      const fn = jest.fn(() => keyboard.isPressedKey(Config.P2.Right));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: Config.P2.Right }));
      for (let i = 0; i < 10; i++) {
        expect(fn()).toBeTruthy();
      }
      expect(fn.mock.calls.length).toBe(10);
      document.dispatchEvent(new KeyboardEvent('keyup', { key: Config.P2.Right }));
      expect(fn()).toBeFalsy();
    });
  });

  describe('keyBoard.isPulsKey method test', () => {
    test('keyBoard.isPulsKey should be defined', () => {
      expect(keyboard.isPulseKey).toBeDefined();
    });

    // use fake time to test setTimeout function
    describe('keyBoard.isPulsKey should return true or false periodically', () => {
      jest.useFakeTimers();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: Config.P1.Right }));

      test('keyboard.isPulsKey should return true', () => {
        expect(keyboard.isPulseKey(Config.P1.Right)).toBeTruthy();
      });

      test('keyboard.isPulsKey should return false', () => {
        jest.advanceTimersByTime(100);
        expect(keyboard.isPulseKey(Config.P1.Right)).toBeFalsy();
      });

      test('keyboard.isPulsKey should return true', () => {
        jest.advanceTimersByTime(51);
        expect(keyboard.isPulseKey(Config.P1.Right)).toBeTruthy();
      });

      test('keyboard.isPulsKey should return false', () => {
        jest.advanceTimersByTime(1);
        expect(keyboard.isPulseKey(Config.P1.Right)).toBeFalsy();
      });
    });
  });
});
