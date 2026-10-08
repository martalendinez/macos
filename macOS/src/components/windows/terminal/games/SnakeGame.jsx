// src/components/windows/terminal/games/SnakeGame.jsx
import { useRef, useState } from "react";
import { GameShell, NEON, drawGrid, glow, makeParticles, roundRect, useCanvas, useHighScore, useKeys, useLoop } from "./kit";

const CELL = 20;
const COLS = 26;
const ROWS = 18;
const W = COLS * CELL;
const H = ROWS * CELL;
const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };

function freeCell(snake) {
  let p;
  do p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function fresh() {
  const snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
  return { snake, dir: [1, 0], queue: [], food: freeCell(snake), gold: null, acc: 0, grow: 0, particles: makeParticles() };
}

export default function SnakeGame() {
  const canvas = useCanvas(W, H);
  const g = useRef(fresh());
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useHighScore("snake");

  function restart() {
    g.current = fresh();
    setScore(0);
    setStatus("playing");
  }

  useKeys((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === " " && status === "ready") return setStatus("playing");
    if (k === "r") return restart();
    if (k === "p" && (status === "playing" || status === "paused")) return setStatus(status === "playing" ? "paused" : "playing");
    const d = DIRS[k];
    if (d && status === "playing") {
      const q = g.current.queue;
      const last = q[q.length - 1] ?? g.current.dir;
      if (d[0] !== -last[0] || d[1] !== -last[1]) q.length < 3 && q.push(d); // no 180° turns
    }
  });

  useLoop((dt, now) => {
    const s = g.current;
    s.particles.update(dt);
    const speed = Math.max(0.055, 0.12 - score * 0.0025); // faster as you grow
    s.acc += dt;
    while (status === "playing" && !s.over && s.acc >= speed) {
      s.acc -= speed;
      if (s.queue.length) s.dir = s.queue.shift();
      const head = { x: s.snake[0].x + s.dir[0], y: s.snake[0].y + s.dir[1] };
      const hit = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || s.snake.some((p) => p.x === head.x && p.y === head.y);
      if (hit) {
        s.over = true;
        s.particles.burst(s.snake[0].x * CELL + 10, s.snake[0].y * CELL + 10, NEON.pink, 30, 220);
        setStatus("over");
        if (score > best) setBest(score);
        break;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.particles.burst(head.x * CELL + 10, head.y * CELL + 10, NEON.pink);
        setScore((v) => v + 1);
        s.grow += 1;
        s.food = freeCell(s.snake);
        if (!s.gold && Math.random() < 0.25) s.gold = { ...freeCell(s.snake), until: now + 5000 };
      } else if (s.gold && head.x === s.gold.x && head.y === s.gold.y) {
        s.particles.burst(head.x * CELL + 10, head.y * CELL + 10, NEON.yellow, 26);
        setScore((v) => v + 5);
        s.grow += 3;
        s.gold = null;
      }
      if (s.grow > 0) s.grow -= 1;
      else s.snake.pop();
    }
    if (s.gold && now > s.gold.until) s.gold = null;

    // draw
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx, W, H, CELL);
    const pulse = 1 + Math.sin(now / 160) * 0.12;
    glow(ctx, NEON.pink, 18);
    ctx.fillStyle = NEON.pink;
    ctx.beginPath();
    ctx.arc(s.food.x * CELL + 10, s.food.y * CELL + 10, 6 * pulse, 0, Math.PI * 2);
    ctx.fill();
    if (s.gold) {
      glow(ctx, NEON.yellow, 22);
      ctx.fillStyle = NEON.yellow;
      ctx.beginPath();
      ctx.arc(s.gold.x * CELL + 10, s.gold.y * CELL + 10, 7.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
    s.snake.forEach((p, i) => {
      const t = i / s.snake.length;
      ctx.fillStyle = `hsl(${145 - t * 40}, 100%, ${62 - t * 22}%)`;
      glow(ctx, NEON.green, i === 0 ? 16 : 6);
      roundRect(ctx, p.x * CELL + 2, p.y * CELL + 2, CELL - 4, CELL - 4, i === 0 ? 6 : 4);
    });
    // eyes
    const h = s.snake[0];
    ctx.shadowBlur = 0;
    ctx.fillStyle = NEON.bg;
    const [dx, dy] = s.dir;
    [[-1, 1]].forEach(() => {
      ctx.fillRect(h.x * CELL + 10 + dx * 4 - dy * 4 - 1.5, h.y * CELL + 10 + dy * 4 - dx * 4 - 1.5, 3, 3);
      ctx.fillRect(h.x * CELL + 10 + dx * 4 + dy * 4 - 1.5, h.y * CELL + 10 + dy * 4 + dx * 4 - 1.5, 3, 3);
    });
    s.particles.draw(ctx);
  }, true);

  return (
    <GameShell title="Snake" touch={{ action: "Start" }} accent={NEON.green} score={score} best={best} status={status} controls="Arrows / WASD to move · 🟡 golden apple = +5">
      <canvas ref={canvas} style={{ width: W, maxWidth: "100%", height: "auto", aspectRatio: `${W} / ${H}` }} />
    </GameShell>
  );
}
