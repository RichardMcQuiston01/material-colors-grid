import { describe, expect, test } from 'vitest';
import { watermarkRect } from './watermark';
import type { WatermarkConfig } from './types';

const config = (
  position: WatermarkConfig['position'],
  scale = 0.2,
): WatermarkConfig => ({ dataUrl: 'x', position, scale, opacity: 1 });

describe('watermarkRect', () => {
  test('scales width by canvas width and preserves aspect ratio', () => {
    // canvas 1000x800, image 200x100 (2:1), scale 0.2 -> width 200, height 100
    const rect = watermarkRect(200, 100, 1000, 800, config('top-left'), 20);

    expect(rect.width).toBe(200);
    expect(rect.height).toBe(100);
  });

  test('places the image in each corner with padding', () => {
    const args = [200, 100, 1000, 800] as const;
    const pad = 20;

    expect(watermarkRect(...args, config('top-left'), pad)).toMatchObject({
      x: 20,
      y: 20,
    });
    expect(watermarkRect(...args, config('top-right'), pad)).toMatchObject({
      x: 780,
      y: 20,
    });
    expect(watermarkRect(...args, config('bottom-left'), pad)).toMatchObject({
      x: 20,
      y: 680,
    });
    expect(watermarkRect(...args, config('bottom-right'), pad)).toMatchObject({
      x: 780,
      y: 680,
    });
  });
});
