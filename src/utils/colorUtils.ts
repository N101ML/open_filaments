export function isValidHex(hex: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

export function normalizeHex(hex: string): string {
  const h = hex.toLowerCase();
  if (h.length === 4) {
    // #rgb → #rrggbb
    return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return h;
}

export function getContrastColor(hex: string): '#000000' | '#ffffff' {
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return L > 0.179 ? '#000000' : '#ffffff';
}
