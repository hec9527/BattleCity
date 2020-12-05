import keys from '@src/config/keys';
import { getType } from '@src/util';

describe('control keys test', () => {
  const comKey = ['Up', 'Down', 'Left', 'Right', 'Double', 'Single'] as const;

  test('keys should define property P1, P2', () => {
    expect(keys.P1).toBeDefined();
    expect(keys.P2).toBeDefined();
  });

  test('P1 keys', () => {
    ([...comKey, 'Start'] as const).forEach(key => {
      expect(keys.P1[key]).toBeDefined();
      expect(getType(keys.P1[key])).toBe('String');
    });
  });

  test('P2 keys', () => {
    [...comKey].forEach(key => {
      expect(keys.P2[key]).toBeDefined();
      expect(getType(keys.P2[key])).toBe('String');
    });
  });
});
