// src/components/windows/terminal/games/kit.jsx
// Shared arcade toolkit: HUD + overlays, key handling, animation loop, high scores, canvas helpers.
import { createContext, useContext, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useLocalState from "../../../../hooks/useLocalState";
import { isTouchDevice } from "../../../../hooks/useIsMobile";

export const NEON = {
  bg: "#07090d",
  grid: "rgba(255,255,255,0.04)",
  green: "#39ff88",
  pink: "#ff375f",
  blue: "#0af",
  yellow: "#ffd60a",
  purple: "#bf5af2",
  orange: "#ff9f0a",
  white: "#f5f5f7",
};

// false when the game lives in a background Terminal tab: it ignores keys and freezes
export const GameActiveContext = createContext(true);

export function useHighScore(game) {
  return useLocalState(`portfolio.arcade.${game}`, 0);
}

/** Global keydown while the game is mounted. Arrow keys / space never scroll the page. */
export function useKeys(handler) {
  const ref = useRef(handler);
  ref.current = handler;
  const active = useContext(GameActiveContext);
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const onKey = (e) => {
      if (!activeRef.current) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      ref.current(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/** Global keyup while mounted (e.g. to stop paddle movement). */
export function useKeyUp(handler) {
  const ref = useRef(handler);
  ref.current = handler;
  const active = useContext(GameActiveContext);
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const onUp = (e) => activeRef.current && ref.current(e);
    window.addEventListener("keyup", onUp);
    return () => window.removeEventListener("keyup", onUp);
  }, []);
}

/** requestAnimationFrame loop with delta time (seconds), paused when running=false. */
export function useLoop(cb, running) {
  const ref = useRef(cb);
  ref.current = cb;
  const active = useContext(GameActiveContext);
  running = running && active;
  useEffect(() => {
    if (!running) return;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ref.current(dt, now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/** Crisp canvas at device pixel ratio with a fixed logical size. */
export function useCanvas(width, height) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const dpr = window.devicePixelRatio || 1;
    c.width = width * dpr;
    c.height = height * dpr;
    c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [width, height]);
  return ref;
}

export function drawGrid(ctx, w, h, size) {
  ctx.fillStyle = NEON.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = NEON.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = size; x < w; x += size) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
  }
  for (let y = size; y < h; y += size) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
  }
  ctx.stroke();
}

export function glow(ctx, color, blur = 14) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  ctx.fill();
}

/** Tiny particle system. */
export function makeParticles() {
  let list = [];
  return {
    burst(x, y, color, n = 14, speed = 160) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = speed * (0.3 + Math.random());
        list.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.6 + Math.random() * 0.4, color });
      }
    },
    update(dt) {
      list = list.filter((p) => (p.life -= dt) > 0);
      list.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;
      });
    },
    draw(ctx) {
      list.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;
    },
  };
}

/** Sends a synthetic key to the games' window listeners (used by the on-screen pad). */
function sendKey(key, type = "keydown") {
  window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
}

function PadButton({ k, label, className = "", accent }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        sendKey(k);
      }}
      onPointerUp={() => sendKey(k, "keyup")}
      onPointerCancel={() => sendKey(k, "keyup")}
      onContextMenu={(e) => e.preventDefault()}
      className={`select-none touch-none rounded-xl bg-white/10 active:bg-white/25 text-white font-mono font-bold flex items-center justify-center ring-1 ring-white/15 ${className}`}
      style={accent ? { background: accent, color: "#000" } : undefined}
      aria-label={label}
    >
      {label}
    </button>
  );
}

/** On-screen controls for touch devices: D-pad on the left, action buttons on the right. */
function TouchPad({ accent, action = "Space", arrows = ["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"] }) {
  const has = (k) => arrows.includes(k);
  return (
    <div className="mt-3 w-full max-w-[420px] flex items-center justify-between gap-4 px-1">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-[150px] h-[150px]">
        <span />
        {has("ArrowUp") ? <PadButton k="ArrowUp" label="▲" /> : <span />}
        <span />
        {has("ArrowLeft") ? <PadButton k="ArrowLeft" label="◀" /> : <span />}
        <span />
        {has("ArrowRight") ? <PadButton k="ArrowRight" label="▶" /> : <span />}
        <span />
        {has("ArrowDown") ? <PadButton k="ArrowDown" label="▼" /> : <span />}
        <span />
      </div>
      <div className="flex flex-col items-center gap-2">
        <PadButton k=" " label={action} accent={accent} className="w-[92px] h-[64px] rounded-2xl text-[13px]" />
        <div className="flex gap-2">
          <PadButton k="p" label="P" className="w-11 h-9 text-[12px]" />
          <PadButton k="r" label="R" className="w-11 h-9 text-[12px]" />
        </div>
      </div>
    </div>
  );
}

/**
 * Arcade frame: HUD (title, score, best), overlay for ready / paused / game over, controls hint.
 * status: "ready" | "playing" | "paused" | "over" | "won"
 */
export function GameShell({ title, accent = NEON.green, score, best, status, extra, controls, overTitle = "GAME OVER", pausable = true, touch, children }) {
  const touchUI = isTouchDevice();
  const overlay =
    status === "ready"
      ? { big: title.toUpperCase(), small: touchUI ? `Tap ${touch?.action ?? "Space"} to start` : "Press Space to start" }
      : status === "paused"
      ? { big: "PAUSED", small: "Press P to resume" }
      : status === "over"
      ? { big: overTitle, small: score >= best && score > 0 ? "★ New high score! · Press R to play again" : "Press R to play again" }
      : status === "won"
      ? { big: "YOU WIN!", small: "Press R to play again" }
      : null;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="w-full flex items-center justify-between gap-4 mb-2 font-mono text-[12px]">
        <span className="font-bold tracking-[0.2em]" style={{ color: accent, textShadow: `0 0 10px ${accent}` }}>
          {title.toUpperCase()}
        </span>
        <span className="flex gap-4 text-white/70">
          {extra}
          <span>
            SCORE <b className="text-white tabular-nums">{score}</b>
          </span>
          <span>
            BEST <b className="tabular-nums" style={{ color: NEON.yellow }}>{Math.max(best, score)}</b>
          </span>
        </span>
      </div>

      <div className="relative rounded-lg overflow-hidden ring-1 ring-white/10 shadow-[0_0_40px_-10px_rgba(57,255,136,0.25)]">
        {children}
        {/* CRT scanlines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)" }}
        />
        <AnimatePresence>
          {overlay && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px] font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-[30px] font-black tracking-[0.15em]"
                style={{ color: accent, textShadow: `0 0 18px ${accent}` }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {overlay.big}
              </motion.div>
              <motion.div className="mt-2 text-[13px] text-white/80" animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
                {overlay.small}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {touchUI ? (
        <TouchPad accent={accent} {...touch} />
      ) : (
        <div className="mt-2 font-mono text-[11px] text-white/45">{controls}{pausable ? " · P pause" : ""} · R restart · Esc quit</div>
      )}
    </div>
  );
}
