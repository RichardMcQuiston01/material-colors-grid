import { hexToRgb } from './color';

/**
 * Minimum WCAG contrast ratio for "Auto" card text to keep using the swatch
 * color; below this it falls back to a readable color. 3:1 keeps the colored
 * text aesthetic for most swatches while catching illegible ones (white, pale
 * greys, yellow on a near-white card).
 */
export const MIN_CARD_TEXT_CONTRAST = 3;

/** WCAG relative luminance (0–1) of a hex color, with sRGB linearization. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two hex colors (1–21, order-independent). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Black or white — whichever contrasts better with the given background. */
export function readableTextColor(background: string): string {
  return contrastRatio(background, '#000000') >=
    contrastRatio(background, '#ffffff')
    ? '#000000'
    : '#ffffff';
}

/**
 * Resolves the text color for "Auto" card font mode: the swatch's own color
 * when it contrasts adequately with the card background, otherwise a readable
 * fallback so the text never disappears.
 */
export function resolveAutoTextColor(
  swatchHex: string,
  background: string,
  minContrast: number = MIN_CARD_TEXT_CONTRAST,
): string {
  return contrastRatio(swatchHex, background) >= minContrast
    ? swatchHex
    : readableTextColor(background);
}
