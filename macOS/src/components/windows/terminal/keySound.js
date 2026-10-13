// src/components/windows/terminal/keySound.js
// Soft mechanical-keyboard clicks for the Terminal (opt-in: `sound on` / `sound off`).
const KEY = "portfolio.terminal.sound";
let ctx = null;

export const soundOn = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
export const setSound = (on) => {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* storage blocked */
  }
};

/** A short filtered noise burst: sounds like a key bottoming out. Enter/Space get a deeper "thock". */
export function keyClick(key) {
  if (!soundOn()) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const big = key === "Enter" || key === " ";
    const len = Math.floor(ctx.sampleRate * (big ? 0.05 : 0.03));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = (big ? 900 : 2200) + Math.random() * 400;
    f.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.value = big ? 0.35 : 0.22;
    src.connect(f).connect(g).connect(ctx.destination);
    src.start();
  } catch {
    /* audio unavailable */
  }
}
