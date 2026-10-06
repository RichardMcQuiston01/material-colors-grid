import { describe, expect, test } from 'vitest';
import { sortColorsDarkToLight } from './ordering';
import type { Color } from './types';

const color = (name: string, hex: string): Color => ({ id: name, name, hex });

describe('sortColorsDarkToLight', () => {
  test('orders colors from dark to light by luminance', () => {
    const colors = [
      color('White', '#ffffff'),
      color('Black', '#000000'),
      color('Mid', '#808080'),
    ];

    const sorted = sortColorsDarkToLight(colors);

    expect(sorted.map((c) => c.name)).toEqual(['Black', 'Mid', 'White']);
  });

  test('does not mutate the input array', () => {
    const colors = [color('White', '#ffffff'), color('Black', '#000000')];

    sortColorsDarkToLight(colors);

    expect(colors.map((c) => c.name)).toEqual(['White', 'Black']);
  });
});
