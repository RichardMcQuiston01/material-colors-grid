import { describe, expect, test } from 'vitest';
import { cssSizeToPx } from './units';

describe('cssSizeToPx', () => {
  test('converts rem to px using a 16px base', () => {
    expect(cssSizeToPx('1rem')).toBe(16);
    expect(cssSizeToPx('0.85rem')).toBeCloseTo(13.6);
    expect(cssSizeToPx('0.25rem')).toBe(4);
  });

  test('passes through px values', () => {
    expect(cssSizeToPx('12px')).toBe(12);
  });

  test('treats a bare number as px', () => {
    expect(cssSizeToPx('20')).toBe(20);
  });

  test('honors a custom rem base', () => {
    expect(cssSizeToPx('2rem', 10)).toBe(20);
  });

  test('returns 0 for unparseable input', () => {
    expect(cssSizeToPx('abc')).toBe(0);
  });
});
