#!/usr/bin/env node
// WCAG 2.x contrast ratio between two hex colours.
// Usage: node contrast.mjs "#ffffff" "#5aa9ff"

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const [fg, bg] = process.argv.slice(2);
if (fg && bg) {
  const r = contrast(fg, bg);
  const mark = (ok) => (ok ? "✓" : "✗");
  console.log(`${r.toFixed(2)}:1  ${mark(r >= 4.5)} AA normal text  ${mark(r >= 3)} AA large text / UI  ${mark(r >= 7)} AAA`);
}
