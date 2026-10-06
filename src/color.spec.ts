import { describe, expect, test } from 'vitest';
import { hexToRgb } from './color';

describe('hexToRgb', () => {
  test('parses 6-digit hex', () => {
    expect(hexToRgb('#1b5e20')).toEqual({ r: 0x1b, g: 0x5e, b: 0x20 });
  });

  test('parses 3-digit shorthand by doubling each digit', () => {
    expect(hexToRgb('#abc')).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc });
  });

  test('accepts values without a leading #', () => {
    expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('rejects a 4-digit value instead of mis-parsing it', () => {
    expect(() => hexToRgb('#ffff')).toThrow(TypeError);
  });

  test('rejects non-hex characters', () => {
    expect(() => hexToRgb('#gggggg')).toThrow(TypeError);
    expect(() => hexToRgb('rebeccapurple')).toThrow(TypeError);
  });
});
