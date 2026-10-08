// src/components/windows/terminal/games/BreakoutGame.jsx
import { useRef, useState } from "react";
import { GameShell, NEON, glow, makeParticles, roundRect, useCanvas, useHighScore, useKeyUp, useKeys, useLoop } from "./kit";

const W = 520;
const H = 380;
const PADDLE_W = 84;
const ROWS = 6;
const COLS = 10;
const BW = 44;
const BH = 16;
const GAP = 6;
const TOP = 50;
const ROW_COLORS = ["#ff453a", "#ff9f0a", "#ffd60a", "#30d158", "#64d2ff", "#bf5af2"];

function bricks(level) {
  const list = [];
  const left = (W - (COLS * BW + (COLS - 1) * GAP)) / 2;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (level % 2 === 0 && (r + c) % 3 === 0) continue; // pattern on even levels
      list.push({ x: left + c * (BW + GAP), y: TOP + r * (BH + GAP), color: ROW_COLORS[r], hp: level > 2 && r < 2 ? 2 : 1, points: (ROWS - r) * 10 });
    }
  return list;
}

function newBall(level) {
  const speed = 270 + level * 30;
  const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
  return { x: W / 2, y: H - 60, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, stuck: true };
}

function fresh(level = 1) {
  return { px: W / 2 - PADDLE_W / 2, ball: newBall(level), bricks: bricks(level), keys: {}, particles: makeParticles(), shake: 0 };
}

export default function BreakoutGame() {
  const canvas = useCanvas(W, H);
  const g = useRef(fresh());
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [best, setBest] = useHighScore("breakout");

  function restart() {
    g.current = fresh(1);
    setScore(0);
    setLives(3);
    setLevel(1);
    setStatus("playing");
  }

  useKeys((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === " " && status === "ready") return setStatus("playing");
    if (k === "r") return restart();
    if (k === "p" && (status === "playing" || status === "paused")) return setStatus(status === "playing" ? "paused" : "playing");
    if (k === " ") g.current.ball.stuck = false; // launch
    g.current.keys[k] = true;
  });
  useKeyUp((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    g.current.keys[k] = false;
  });

  useLoop((dt) => {
    const s = g.current;
    s.particles.update(dt);
    s.shake = Math.max(0, s.shake - dt * 30);
    if (status === "playing") {
      const dir = (s.keys.ArrowRight || s.keys.d ? 1 : 0) - (s.keys.ArrowLeft || s.keys.a ? 1 : 0);
      s.px = Math.max(0, Math.min(W - PADDLE_W, s.px + dir * 460 * dt));
      const b = s.ball;
      if (b.stuck) {
        b.x = s.px + PADDLE_W / 2;
        b.y = H - 34;
      } else {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x < 6 || b.x > W - 6) {
          b.vx *= -1;
          b.x = Math.max(6, Math.min(W - 6, b.x));
        }
        if (b.y < 6) {
          b.vy = Math.abs(b.vy);
        }
        // paddle
        if (b.vy > 0 && b.y > H - 34 && b.y < H - 20 && b.x > s.px - 4 && b.x < s.px + PADDLE_W + 4) {
          const rel = (b.x - (s.px + PADDLE_W / 2)) / (PADDLE_W / 2);
          const speed = Math.hypot(b.vx, b.vy);
          const a = -Math.PI / 2 + rel * 1.05;
          b.vx = Math.cos(a) * speed;
          b.vy = Math.sin(a) * speed;
          b.y = H - 34;
        }
        // bricks
        for (const br of s.bricks) {
          if (br.hp <= 0) continue;
          if (b.x > br.x - 5 && b.x < br.x + BW + 5 && b.y > br.y - 5 && b.y < br.y + BH + 5) {
            const overlapX = Math.min(b.x - (br.x - 5), br.x + BW + 5 - b.x);
            const overlapY = Math.min(b.y - (br.y - 5), br.y + BH + 5 - b.y);
            if (overlapX < overlapY) b.vx *= -1;
            else b.vy *= -1;
            br.hp -= 1;
            if (br.hp <= 0) {
              s.particles.burst(br.x + BW / 2, br.y + BH / 2, br.color, 16, 180);
              setScore((v) => {
                const n = v + br.points;
                if (n > best) setBest(n);
                return n;
              });
            } else br.color = "#ffffff";
            break;
          }
        }
        if (s.bricks.every((br) => br.hp <= 0)) {
          const nl = level + 1;
          setLevel(nl);
          const px = s.px;
          g.current = { ...fresh(nl), px };
        }
        if (b.y > H + 10) {
          s.shake = 10;
          setLives((l) => {
            const n = l - 1;
            if (n <= 0) setStatus("over");
            return n;
          });
          s.ball = newBall(level);
        }
      }
    }

    // draw
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.save();
    if (s.shake) ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
    ctx.fillStyle = NEON.bg;
    ctx.fillRect(-10, -10, W + 20, H + 20);
    g.current.bricks.forEach((br) => {
      if (br.hp <= 0) return;
      glow(ctx, br.color, 10);
      ctx.fillStyle = br.color;
      roundRect(ctx, br.x, br.y, BW, BH, 4);
    });
    glow(ctx, NEON.blue, 16);
    ctx.fillStyle = NEON.blue;
    roundRect(ctx, g.current.px, H - 26, PADDLE_W, 10, 5);
    const b = g.current.ball;
    glow(ctx, NEON.white, 18);
    ctx.fillStyle = NEON.white;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (b.stuck && status === "playing") {
      ctx.font = "12px ui-monospace, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("Space to launch", W / 2, H - 60);
    }
    g.current.particles.draw(ctx);
    ctx.restore();
  }, true);

  return (
    <GameShell
      title="Breakout" touch={{ action: "Launch", arrows: ["ArrowLeft", "ArrowRight"] }}
      accent={NEON.pink}
      score={score}
      best={best}
      status={status}
      extra={
        <>
          <span>LVL <b className="text-white">{level}</b></span>
          <span style={{ color: NEON.pink }}>{"♥".repeat(Math.max(0, lives))}</span>
        </>
      }
      controls="←/→ or A/D to move · Space to launch"
    >
      <canvas ref={canvas} style={{ width: W, maxWidth: "100%", height: "auto", aspectRatio: `${W} / ${H}` }} />
    </GameShell>
  );
}
