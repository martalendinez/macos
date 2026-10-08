// src/components/windows/terminal/games/PongGame.jsx
import { useRef, useState } from "react";
import { GameShell, NEON, glow, makeParticles, roundRect, useCanvas, useHighScore, useKeyUp, useKeys, useLoop } from "./kit";

const W = 520;
const H = 340;
const PW = 10;
const PH = 70;
const WIN = 7;

function serve(dir = 1) {
  const a = (Math.random() * 0.8 - 0.4);
  return { x: W / 2, y: H / 2, vx: Math.cos(a) * 260 * dir, vy: Math.sin(a) * 260, trail: [] };
}

function fresh() {
  return { you: H / 2 - PH / 2, cpu: H / 2 - PH / 2, ball: serve(Math.random() < 0.5 ? 1 : -1), keys: {}, shake: 0, particles: makeParticles(), pause: 0 };
}

export default function PongGame() {
  const canvas = useCanvas(W, H);
  const g = useRef(fresh());
  const [status, setStatus] = useState("ready");
  const [you, setYou] = useState(0);
  const [cpu, setCpu] = useState(0);
  const [best, setBest] = useHighScore("pong"); // best = most points scored in a match

  function restart() {
    g.current = fresh();
    setYou(0);
    setCpu(0);
    setStatus("playing");
  }

  useKeys((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === " " && status === "ready") return setStatus("playing");
    if (k === "r") return restart();
    if (k === "p" && (status === "playing" || status === "paused")) return setStatus(status === "playing" ? "paused" : "playing");
    g.current.keys[k] = true;
  });

  // key release stops paddle movement
  useKeyUp((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    g.current.keys[k] = false;
  });

  useLoop((dt, now) => {
    const s = g.current;
    s.particles.update(dt);
    s.shake = Math.max(0, s.shake - dt * 30);

    if (status === "playing") {
      const up = s.keys.ArrowUp || s.keys.w ? 1 : 0;
      const down = s.keys.ArrowDown || s.keys.s ? 1 : 0;
      s.you = Math.max(0, Math.min(H - PH, s.you + (down - up) * 360 * dt));

      // CPU: follows the ball with a reaction limit, so it can be beaten
      const target = s.ball.y - PH / 2 + Math.sin(now / 400) * 18;
      const maxStep = (s.ball.vx > 0 ? 250 : 120) * dt;
      s.cpu += Math.max(-maxStep, Math.min(maxStep, target - s.cpu));
      s.cpu = Math.max(0, Math.min(H - PH, s.cpu));

      if (s.pause > 0) s.pause -= dt;
      else {
        const b = s.ball;
        b.trail.unshift({ x: b.x, y: b.y });
        b.trail.length = Math.min(b.trail.length, 12);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.y < 6 || b.y > H - 6) {
          b.vy *= -1;
          b.y = Math.max(6, Math.min(H - 6, b.y));
        }
        const hitPaddle = (px, py, side) => {
          if (b.y > py - 4 && b.y < py + PH + 4 && Math.abs(b.x - px) < PW) {
            const rel = (b.y - (py + PH / 2)) / (PH / 2); // -1..1
            const speed = Math.min(620, Math.hypot(b.vx, b.vy) * 1.07);
            const ang = rel * 0.9;
            b.vx = Math.cos(ang) * speed * side;
            b.vy = Math.sin(ang) * speed;
            b.x = px + PW * side;
            s.particles.burst(b.x, b.y, side > 0 ? NEON.blue : NEON.pink, 10, 120);
          }
        };
        if (b.vx < 0) hitPaddle(24 + PW, s.you, 1);
        if (b.vx > 0) hitPaddle(W - 24 - PW, s.cpu, -1);

        const scored = b.x < -10 ? "cpu" : b.x > W + 10 ? "you" : null;
        if (scored) {
          s.shake = 8;
          s.particles.burst(scored === "you" ? W - 10 : 10, b.y, scored === "you" ? NEON.blue : NEON.pink, 30, 260);
          if (scored === "you") {
            const n = you + 1;
            setYou(n);
            if (n > best) setBest(n);
            if (n >= WIN) setStatus("won");
          } else {
            const n = cpu + 1;
            setCpu(n);
            if (n >= WIN) setStatus("over");
          }
          s.ball = serve(scored === "you" ? -1 : 1);
          s.pause = 0.7;
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
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "bold 44px ui-monospace, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillText(String(you), W / 2 - 60, 60);
    ctx.fillText(String(cpu), W / 2 + 60, 60);

    glow(ctx, NEON.blue, 16);
    ctx.fillStyle = NEON.blue;
    roundRect(ctx, 24, s.you, PW, PH, 4);
    glow(ctx, NEON.pink, 16);
    ctx.fillStyle = NEON.pink;
    roundRect(ctx, W - 24 - PW, s.cpu, PW, PH, 4);

    const b = s.ball;
    b.trail.forEach((p, i) => {
      ctx.globalAlpha = (1 - i / b.trail.length) * 0.35;
      ctx.fillStyle = NEON.white;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6 - i * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    glow(ctx, NEON.white, 20);
    ctx.fillStyle = NEON.white;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    s.particles.draw(ctx);
    ctx.restore();
  }, true);

  return (
    <GameShell
      title="Pong" touch={{ action: "Start", arrows: ["ArrowUp", "ArrowDown"] }}
      accent={NEON.blue}
      score={you}
      best={best}
      status={status}
      overTitle="CPU WINS"
      extra={
        <span>
          YOU <b style={{ color: NEON.blue }}>{you}</b> : <b style={{ color: NEON.pink }}>{cpu}</b> CPU
        </span>
      }
      controls={`↑/↓ or W/S to move · first to ${WIN}`}
    >
      <canvas ref={canvas} style={{ width: W, maxWidth: "100%", height: "auto", aspectRatio: `${W} / ${H}` }} />
    </GameShell>
  );
}
