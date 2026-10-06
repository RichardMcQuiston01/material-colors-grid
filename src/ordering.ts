import { hexToRgb } from './color';
import type { Color } from './types';

/**
 * Perceived luminance of a hex color on a 0–255 scale using the Rec. 709
 * coefficients. `#000000` → 0, `#ffffff` → 255. A malformed hex (which can
 * reach here from imported/legacy data) is treated as darkest (0) rather than
 * throwing, so one bad swatch never breaks ordering.
 */
export function luminance(hex: string): number {
  let rgb: { r: number; g: number; b: number };
  try {
    rgb = hexToRgb(hex);
  } catch {
    return 0;
  }
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

/** Returns a new array of colors ordered dark → light by luminance. */
export function sortColorsDarkToLight(colors: Color[]): Color[] {
  return [...colors].sort((a, b) => luminance(a.hex) - luminance(b.hex));
}
