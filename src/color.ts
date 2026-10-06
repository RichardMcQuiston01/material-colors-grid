/**
 * Parses a hex color (`#rgb` or `#rrggbb`, with or without the leading `#`)
 * into 0–255 channels. Rejects malformed values — a partial string like
 * `#ffff` would otherwise `parseInt` to bogus channels and silently skew
 * ordering and contrast — by throwing a `TypeError`.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const match = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex);
  if (!match) {
    throw new TypeError(`Expected a 3- or 6-digit hex color, got "${hex}"`);
  }
  let value = match[1];
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 0xff,
    g: (int >> 8) & 0xff,
    b: int & 0xff,
  };
}
