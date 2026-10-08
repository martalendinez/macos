// src/components/windows/terminal/games/Game2048.jsx
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GameShell, NEON, useHighScore, useKeys } from "./kit";

const N = 4;
const SIZE = typeof window !== "undefined" && window.innerWidth < 420 ? 66 : 78; // fits phones
const GAP = 10;
const BOARD = N * SIZE + (N + 1) * GAP;

const COLORS = {
  2: ["#1f2a37", "#9fb3c8"],
  4: ["#243447", "#b6c8db"],
  8: ["#ff9f0a", "#1a1206"],
  16: ["#ff7a1a", "#1a0e06"],
  32: ["#ff453a", "#fff"],
  64: ["#ff2d55", "#fff"],
  128: ["#ffd60a", "#1a1606"],
  256: ["#30d158", "#04140a"],
  512: ["#64d2ff", "#04121a"],
  1024: ["#0a84ff", "#fff"],
  2048: ["#bf5af2", "#fff"],
};

let uid = 0;
const tile = (r, c, v) => ({ id: ++uid, r, c, v, born: true });

function addRandom(tiles) {
  const free = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!tiles.some((t) => t.r === r && t.c === c)) free.push([r, c]);
  if (!free.length) return tiles;
  const [r, c] = free[Math.floor(Math.random() * free.length)];
  return [...tiles, tile(r, c, Math.random() < 0.9 ? 2 : 4)];
}

function slide(tiles, dir) {
  // dir: [dr, dc]
  const [dr, dc] = dir;
  const order = [...Array(N).keys()];
  const rows = dr === 1 ? [...order].reverse() : order;
  const cols = dc === 1 ? [...order].reverse() : order;
  const grid = Array.from({ length: N }, () => Array(N).fill(null));
  tiles.forEach((t) => (grid[t.r][t.c] = { ...t, born: false, merged: false }));
  let moved = false;
  let gained = 0;
  const out = [];

  for (const r of rows) {
    for (const c of cols) {
      const t = grid[r][c];
      if (!t) continue;
      let nr = r;
      let nc = c;
      while (true) {
        const tr = nr + dr;
        const tc = nc + dc;
        if (tr < 0 || tr >= N || tc < 0 || tc >= N) break;
        const other = grid[tr][tc];
        if (!other) {
          grid[nr][nc] = null;
          nr = tr;
          nc = tc;
          grid[nr][nc] = t;
          continue;
        }
        if (other.v === t.v && !other.merged && !t.merged) {
          grid[nr][nc] = null;
          other.v *= 2;
          other.merged = true;
          other.id = ++uid; // re-key so it pops
          gained += other.v;
          t.r = tr;
          t.c = tc;
          t.dead = true;
          out.push(t);
          moved = true;
        }
        break;
      }
      if (!t.dead) {
        if (nr !== r || nc !== c) moved = true;
        t.r = nr;
        t.c = nc;
      }
    }
  }
  grid.forEach((row) => row.forEach((t) => t && out.push(t)));
  return { tiles: out, moved, gained };
}

function canMove(tiles) {
  if (tiles.length < N * N) return true;
  return tiles.some((t) => tiles.some((o) => o.v === t.v && Math.abs(o.r - t.r) + Math.abs(o.c - t.c) === 1));
}

function fresh() {
  return addRandom(addRandom([]));
}

const DIRS = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1] };

export default function Game2048() {
  const [tiles, setTiles] = useState(fresh);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing");
  const [best, setBest] = useHighScore("2048");
  const won = useRef(false);

  function restart() {
    won.current = false;
    setTiles(fresh());
    setScore(0);
    setStatus("playing");
  }

  useKeys((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === "r") return restart();
    if (status === "won" && (k === " " || k === "Enter")) return setStatus("playing"); // keep going after 2048
    const d = DIRS[k];
    if (!d || status !== "playing") return;
    const { tiles: moved, moved: didMove, gained } = slide(tiles, d);
    if (!didMove) return;
    const live = moved.filter((t) => !t.dead);
    const next = addRandom(live);
    setTiles(moved.filter((t) => t.dead).length ? [...moved.filter((t) => t.dead), ...next] : next);
    // clean up merged-away tiles after the slide animation
    setTimeout(() => setTiles((cur) => cur.filter((t) => !t.dead)), 120);
    const total = score + gained;
    setScore(total);
    if (total > best) setBest(total);
    if (!won.current && live.some((t) => t.v >= 2048)) {
      won.current = true;
      setStatus("won");
    } else if (!canMove(next)) setStatus("over");
  });

  const pos = (i) => GAP + i * (SIZE + GAP);

  return (
    <GameShell title="2048" touch={{ action: "Go" }} accent={NEON.orange} pausable={false} score={score} best={best} status={status} controls="Arrows / WASD to slide · merge tiles to reach 2048">
      <div className="relative" style={{ width: BOARD, height: BOARD, background: NEON.bg }}>
        {Array.from({ length: N * N }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-lg bg-white/[0.05]"
            style={{ left: pos(i % N), top: pos(Math.floor(i / N)), width: SIZE, height: SIZE }}
          />
        ))}
        <AnimatePresence>
          {tiles.map((t) => {
            const [bg, fg] = COLORS[t.v] ?? ["#f5f5f7", "#000"];
            return (
              <motion.div
                key={t.id}
                className="absolute rounded-lg flex items-center justify-center font-mono font-black"
                style={{
                  width: SIZE,
                  height: SIZE,
                  background: bg,
                  color: fg,
                  fontSize: t.v >= 1024 ? 24 : t.v >= 128 ? 28 : 32,
                  boxShadow: t.v >= 8 ? `0 0 18px ${bg}88` : "none",
                  zIndex: t.dead ? 0 : 1,
                }}
                initial={t.born ? { scale: 0, left: pos(t.c), top: pos(t.r) } : { scale: 1.18, left: pos(t.c), top: pos(t.r) }}
                animate={{ scale: 1, left: pos(t.c), top: pos(t.r) }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 32 }}
              >
                {t.v}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </GameShell>
  );
}
