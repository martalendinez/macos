// src/components/windows/Music/components/Visualizer.jsx
// Frequency bars from the real audio (Web Audio analyser); gentle fake motion if it's unavailable.
import { useEffect, useRef } from "react";

export default function Visualizer({ getAnalyser, playing, color = "#1ed760", bars = 32, className = "", height = 48 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let raf;
    let t = 0;
    const draw = () => {
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const analyser = playing ? getAnalyser?.() : null;
      let data = null;
      if (analyser) {
        data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
      }
      t += 0.06;
      const bw = w / bars;
      for (let i = 0; i < bars; i++) {
        const v = data ? data[Math.floor((i / bars) * data.length * 0.75)] / 255 : playing ? 0.25 + 0.2 * Math.sin(t + i * 0.5) * Math.sin(t * 0.7 + i) : 0.04;
        const bh = Math.max(2, v * h);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.55 + v * 0.45;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(i * bw + 1, h - bh, bw - 2, bh, 2) : ctx.rect(i * bw + 1, h - bh, bw - 2, bh);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [getAnalyser, playing, color, bars]);
  return <canvas ref={ref} className={`w-full ${className}`} style={{ height }} aria-hidden="true" />;
}
