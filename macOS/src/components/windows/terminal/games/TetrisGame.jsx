// src/components/windows/terminal/games/TetrisGame.jsx
import { useRef, useState } from "react";
import { GameShell, NEON, glow, makeParticles, roundRect, useCanvas, useHighScore, useKeys, useLoop } from "./kit";

const COLS = 10;
const ROWS = 20;
const C = 20;
const BOARD_W = COLS * C;
const SIDE = 120;
const W = BOARD_W + SIDE;
const H = ROWS * C;

const SHAPES = {
  I: { c: "#64d2ff", m: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  O: { c: "#ffd60a", m: [[1, 1], [1, 1]] },
  T: { c: "#bf5af2", m: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  S: { c: "#30d158", m: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  Z: { c: "#ff453a", m: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  J: { c: "#0a84ff", m: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  L: { c: "#ff9f0a", m: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
};
const LINE_POINTS = [0, 100, 300, 500, 800];

const rotate = (m, dir = 1) => (dir > 0 ? m[0].map((_, i) => m.map((r) => r[i]).reverse()) : m[0].map((_, i) => m.map((r) => r[r.length - 1 - i])));

function bag() {
  const k = Object.keys(SHAPES);
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

function spawn(type) {
  const m = SHAPES[type].m;
  return { type, m, x: Math.floor((COLS - m[0].length) / 2), y: type === "I" ? -1 : 0 };
}

function fresh() {
  const queue = [...bag(), ...bag()];
  return { board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)), cur: spawn(queue.shift()), queue, hold: null, canHold: true, acc: 0, lines: 0, flash: [], flashT: 0, particles: makeParticles() };
}

function collides(board, p, m = p.m, dx = 0, dy = 0) {
  return m.some((row, y) =>
    row.some((v, x) => {
      if (!v) return false;
      const nx = p.x + x + dx;
      const ny = p.y + y + dy;
      return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx]);
    })
  );
}

export default function TetrisGame() {
  const canvas = useCanvas(W, H);
  const g = useRef(fresh());
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useHighScore("tetris");
  const level = Math.floor(g.current.lines / 10) + 1;

  function restart() {
    g.current = fresh();
    setScore(0);
    setStatus("playing");
  }

  function next(s) {
    if (s.queue.length < 7) s.queue.push(...bag());
    s.cur = spawn(s.queue.shift());
    s.canHold = true;
    if (collides(s.board, s.cur)) {
      setStatus("over");
      setScore((v) => {
        if (v > best) setBest(v);
        return v;
      });
    }
  }

  function lock(s) {
    s.cur.m.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v && s.cur.y + y >= 0) s.board[s.cur.y + y][s.cur.x + x] = SHAPES[s.cur.type].c;
      })
    );
    const full = s.board.map((r, i) => (r.every(Boolean) ? i : -1)).filter((i) => i >= 0);
    if (full.length) {
      s.flash = full;
      s.flashT = 0.18;
      full.forEach((row) => s.particles.burst(BOARD_W / 2, row * C + C / 2, "#fff", 18, 260));
      s.lines += full.length;
      setScore((v) => v + LINE_POINTS[full.length] * (Math.floor((s.lines - full.length) / 10) + 1));
    }
    if (!full.length) next(s);
  }

  function move(dx, dy) {
    const s = g.current;
    if (!collides(s.board, s.cur, s.cur.m, dx, dy)) {
      s.cur.x += dx;
      s.cur.y += dy;
      return true;
    }
    return false;
  }

  function turn(dir) {
    const s = g.current;
    const m = rotate(s.cur.m, dir);
    for (const k of [0, -1, 1, -2, 2]) {
      if (!collides(s.board, s.cur, m, k, 0)) {
        s.cur.m = m;
        s.cur.x += k;
        return;
      }
    }
  }

  useKeys((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === " " && status === "ready") return setStatus("playing");
    if (k === "r") return restart();
    if (k === "p" && (status === "playing" || status === "paused")) return setStatus(status === "playing" ? "paused" : "playing");
    if (status !== "playing" || g.current.flashT > 0) return;
    const s = g.current;
    if (k === "ArrowLeft") move(-1, 0);
    else if (k === "ArrowRight") move(1, 0);
    else if (k === "ArrowDown") {
      if (move(0, 1)) setScore((v) => v + 1);
    } else if (k === "ArrowUp" || k === "x") turn(1);
    else if (k === "z") turn(-1);
    else if (k === " ") {
      let n = 0;
      while (move(0, 1)) n++;
      setScore((v) => v + n * 2);
      lock(s);
    } else if (k === "c" && s.canHold) {
      const held = s.hold;
      s.hold = s.cur.type;
      s.canHold = false;
      if (held) s.cur = spawn(held);
      else {
        next(s);
        s.canHold = false;
      }
    }
  });

  useLoop((dt) => {
    const s = g.current;
    s.particles.update(dt);
    if (status === "playing") {
      if (s.flashT > 0) {
        s.flashT -= dt;
        if (s.flashT <= 0) {
          s.board = s.board.filter((_, i) => !s.flash.includes(i));
          while (s.board.length < ROWS) s.board.unshift(Array(COLS).fill(null));
          s.flash = [];
          next(s);
        }
      } else {
        s.acc += dt;
        const gravity = Math.max(0.07, 0.8 * Math.pow(0.85, level - 1));
        if (s.acc >= gravity) {
          s.acc = 0;
          if (!move(0, 1)) lock(s);
        }
      }
    }

    // draw
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = NEON.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = NEON.grid;
    for (let x = 1; x < COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * C + 0.5, 0);
      ctx.lineTo(x * C + 0.5, H);
      ctx.stroke();
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * C + 0.5);
      ctx.lineTo(BOARD_W, y * C + 0.5);
      ctx.stroke();
    }

    const block = (x, y, color, alpha = 1) => {
      ctx.globalAlpha = alpha;
      glow(ctx, color, alpha < 1 ? 0 : 8);
      ctx.fillStyle = color;
      roundRect(ctx, x + 1, y + 1, C - 2, C - 2, 4);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(x + 3, y + 3, C - 6, 3);
      ctx.globalAlpha = 1;
    };

    s.board.forEach((row, y) => row.forEach((c, x) => c && block(x * C, y * C, s.flash.includes(y) ? "#ffffff" : c)));

    if (status !== "over") {
      // ghost
      let gy = 0;
      while (!collides(s.board, s.cur, s.cur.m, 0, gy + 1)) gy++;
      const color = SHAPES[s.cur.type].c;
      s.cur.m.forEach((row, y) =>
        row.forEach((v, x) => {
          if (!v) return;
          if (s.cur.y + y + gy >= 0) {
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.45;
            ctx.strokeRect((s.cur.x + x) * C + 2.5, (s.cur.y + y + gy) * C + 2.5, C - 5, C - 5);
            ctx.globalAlpha = 1;
          }
          if (s.cur.y + y >= 0) block((s.cur.x + x) * C, (s.cur.y + y) * C, color);
        })
      );
    }

    // side panel
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(BOARD_W, 0, SIDE, H);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.moveTo(BOARD_W + 0.5, 0);
    ctx.lineTo(BOARD_W + 0.5, H);
    ctx.stroke();
    ctx.font = "bold 11px ui-monospace, Menlo, monospace";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    const mini = (type, oy) => {
      if (!type) return;
      const m = SHAPES[type].m.filter((r) => r.some(Boolean));
      const s2 = 14;
      const ox = BOARD_W + (SIDE - m[0].length * s2) / 2;
      m.forEach((row, y) =>
        row.forEach((v, x) => {
          if (!v) return;
          ctx.fillStyle = SHAPES[type].c;
          glow(ctx, SHAPES[type].c, 6);
          roundRect(ctx, ox + x * s2, oy + y * s2, s2 - 2, s2 - 2, 3);
          ctx.shadowBlur = 0;
        })
      );
    };
    ctx.fillText("NEXT", BOARD_W + 14, 22);
    s.queue.slice(0, 3).forEach((t, i) => mini(t, 34 + i * 46));
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("HOLD (C)", BOARD_W + 14, 196);
    mini(s.hold, 208);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("LEVEL", BOARD_W + 14, 300);
    ctx.fillText("LINES", BOARD_W + 14, 350);
    ctx.font = "bold 22px ui-monospace, Menlo, monospace";
    ctx.fillStyle = NEON.purple;
    ctx.fillText(String(level), BOARD_W + 14, 326);
    ctx.fillStyle = NEON.white;
    ctx.fillText(String(s.lines), BOARD_W + 14, 376);
    s.particles.draw(ctx);
  }, true);

  return (
    <GameShell title="Tetris" touch={{ action: "Drop" }} accent={NEON.purple} score={score} best={best} status={status} controls="←/→ move · ↑ rotate · ↓ soft drop · Space hard drop · C hold">
      <canvas ref={canvas} style={{ width: W, maxWidth: "100%", height: "auto", aspectRatio: `${W} / ${H}` }} />
    </GameShell>
  );
}
