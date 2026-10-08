// src/components/windows/Music/hooks/useCoverColor.js
// Average color of an album cover (like Spotify's tinted headers). Covers are same-origin, so canvas can read them.
import { useEffect, useState } from "react";

const cache = new Map();
const FALLBACK = [30, 140, 90];

export default function useCoverColor(src) {
  const [rgb, setRgb] = useState(() => cache.get(src) ?? FALLBACK);
  useEffect(() => {
    if (!src) return;
    if (cache.has(src)) return setRgb(cache.get(src));
    let off = false;
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 24;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 24, 24);
        const d = ctx.getImageData(0, 0, 24, 24).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          // skip near-white/near-black pixels so the color is vivid
          const max = Math.max(d[i], d[i + 1], d[i + 2]);
          const min = Math.min(d[i], d[i + 1], d[i + 2]);
          if (max < 30 || min > 235) continue;
          r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
        }
        const out = n ? [r / n, g / n, b / n].map(Math.round) : FALLBACK;
        cache.set(src, out);
        if (!off) setRgb(out);
      } catch {
        /* ignore */
      }
    };
    img.src = src;
    return () => {
      off = true;
    };
  }, [src]);
  return rgb;
}

export const rgba = ([r, g, b], a = 1) => `rgba(${r},${g},${b},${a})`;
