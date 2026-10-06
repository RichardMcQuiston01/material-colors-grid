/**
 * Converts a CSS length to canvas pixels. Supports `rem` (relative to
 * `remBase`), `px`, and bare numbers; returns 0 when unparseable.
 */
export function cssSizeToPx(size: string, remBase = 16): number {
  const match = size.trim().match(/^(-?\d*\.?\d+)(rem|px)?$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  return match[2] === 'rem' ? value * remBase : value;
}
