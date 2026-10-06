import { describe, expect, test } from 'vitest';
import {
  contrastRatio,
  readableTextColor,
  resolveAutoTextColor,
} from './contrast';

describe('contrastRatio', () => {
  test('black vs white is the maximum 21:1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  test('identical colors are 1:1', () => {
    expect(contrastRatio('#abc123', '#abc123')).toBeCloseTo(1);
  });

  test('is symmetric', () => {
    expect(contrastRatio('#123456', '#f0f0f0')).toBeCloseTo(
      contrastRatio('#f0f0f0', '#123456'),
    );
  });
});

describe('readableTextColor', () => {
  test('picks black on a light background', () => {
    expect(readableTextColor('#f7f7f7')).toBe('#000000');
  });

  test('picks white on a dark background', () => {
    expect(readableTextColor('#1b5e20')).toBe('#ffffff');
  });
});

describe('resolveAutoTextColor', () => {
  const bg = '#f7f7f7';

  test('keeps the swatch color when it contrasts with the background', () => {
    expect(resolveAutoTextColor('#af0000', bg)).toBe('#af0000');
    expect(resolveAutoTextColor('#00008f', bg)).toBe('#00008f');
  });

  test('falls back to a readable color when swatch matches the background', () => {
    expect(resolveAutoTextColor('#ffffff', bg)).toBe('#000000');
  });

  test('falls back for low-contrast swatches (light grey, yellow)', () => {
    expect(resolveAutoTextColor('#cccccc', bg)).toBe('#000000');
    expect(resolveAutoTextColor('#ffff00', bg)).toBe('#000000');
  });

  test('uses white text against a dark card background', () => {
    expect(resolveAutoTextColor('#222222', '#1b5e20')).toBe('#ffffff');
  });
});
