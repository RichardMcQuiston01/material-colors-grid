/** Parses a hex color (`#rgb` or `#rrggbb`) into 0–255 channels. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let value = hex.replace(/^#/, '');
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
