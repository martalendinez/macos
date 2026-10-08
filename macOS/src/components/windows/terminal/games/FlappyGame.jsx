// src/components/windows/terminal/games/FlappyGame.jsx
import { useRef, useState } from "react";
import { GameShell, NEON, glow, makeParticles, roundRect, useCanvas, useHighScore, useKeys, useLoop } from "./kit";

const W = 480;
const H = 380;
const GAP = 120;
const PIPE_W = 56;
const GRAVITY = 1250;
const FLAP = -380;

function fresh() {
  return {
    y: H / 2,
    vy: 0,
    pipes: [],
    spawn: 0,
    t: 0,
    particles: makeParticles(),
    stars: Array.from({ length: 50 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.6 + 0.4 })),
  };
}

export default function FlappyGame() {
  const canvas = useCanvas(W, H);
  const g = useRef(fresh());
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useHighScore("flappy");

  function flap() {
    const s = g.current;
    s.vy = FLAP;
    s.particles.burst(110, s.y + 8, NEON.yellow, 5, 80);
  }

  function restart() {
    g.current = fresh();
    setScore(0);
    setStatus("playing");
    flap();
  }

  useKeys((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === "r") return restart();
    if (k === "p" && (status === "playing" || status === "paused")) return setStatus(status === "playing" ? "paused" : "playing");
    if (k === " " || k === "ArrowUp" || k === "w") {
      if (status === "ready") {
        setStatus("playing");
        flap();
      } else if (status === "playing") flap();
    }
  });

  useLoop((dt) => {
    const s = g.current;
    s.particles.update(dt);
    const speed = 150 + Math.min(score, 30) * 3;
    s.t += dt;
    if (status === "playing") {
      s.vy += GRAVITY * dt;
      s.y += s.vy * dt;
      s.spawn -= dt;
      if (s.spawn <= 0) {
        s.spawn = 1.45;
        s.pipes.push({ x: W + 10, gapY: 70 + Math.random() * (H - 140 - GAP), passed: false });
      }
      s.pipes.forEach((p) => (p.x -= speed * dt));
      s.pipes = s.pipes.filter((p) => p.x > -PIPE_W - 10);
      for (const p of s.pipes) {
        if (!p.passed && p.x + PIPE_W < 100) {
          p.passed = true;
          setScore((v) => v + 1);
        }
        const inX = 100 + 14 > p.x && 100 - 14 < p.x + PIPE_W;
        const inGap = s.y - 12 > p.gapY && s.y + 12 < p.gapY + GAP;
        if (inX && !inGap) s.dead = true;
      }
      if (s.y > H - 10 || s.y < -20) s.dead = true;
      if (s.dead && !s.reported) {
        s.reported = true;
        s.particles.burst(100, s.y, NEON.yellow, 30, 240);
        setStatus("over");
        setScore((v) => {
          if (v > best) setBest(v);
          return v;
        });
      }
    } else if (status === "ready") {
      s.y = H / 2 + Math.sin(s.t * 3) * 10;
    }
    s.stars.forEach((st) => {
      st.x -= st.s * (status === "playing" ? 30 : 8) * dt;
      if (st.x < 0) st.x = W;
    });

    // draw
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0b1030");
    sky.addColorStop(1, "#1b0b2e");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    s.stars.forEach((st) => {
      ctx.globalAlpha = 0.3 + st.s / 3;
      ctx.fillStyle = "#fff";
      ctx.fillRect(st.x, st.y, st.s, st.s);
    });
    ctx.globalAlpha = 1;

    s.pipes.forEach((p) => {
      glow(ctx, NEON.green, 14);
      ctx.fillStyle = NEON.green;
      roundRect(ctx, p.x, -10, PIPE_W, p.gapY + 10, 8);
      roundRect(ctx, p.x, p.gapY + GAP, PIPE_W, H - p.gapY - GAP + 10, 8);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(p.x + PIPE_W - 12, -10, 8, p.gapY + 10);
      ctx.fillRect(p.x + PIPE_W - 12, p.gapY + GAP, 8, H);
    });

    // the bird: a glowing little ball with an eye and wing
    const tilt = Math.max(-0.5, Math.min(1.2, s.vy / 500));
    ctx.save();
    ctx.translate(100, s.y);
    ctx.rotate(tilt);
    glow(ctx, NEON.yellow, 18);
    ctx.fillStyle = NEON.yellow;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(5, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(6.5, -4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = NEON.orange;
    ctx.beginPath();
    ctx.moveTo(11, 1);
    ctx.lineTo(19, 4);
    ctx.lineTo(11, 7);
    ctx.fill();
    ctx.fillStyle = "#ffb340";
    ctx.beginPath();
    ctx.ellipse(-4, 4 + Math.sin(s.t * 30) * 2, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (status === "playing") {
      ctx.font = "bold 40px ui-monospace, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(String(score), W / 2, 60);
    }
    s.particles.draw(ctx);
  }, true);

  return (
    <GameShell title="Flappy" touch={{ action: "Flap", arrows: [] }} accent={NEON.yellow} score={score} best={best} status={status} overTitle="OUCH!" controls="Space / ↑ to flap">
      <canvas ref={canvas} style={{ width: W, maxWidth: "100%", height: "auto", aspectRatio: `${W} / ${H}` }} onMouseDown={() => (status === "playing" ? flap() : status === "ready" && (setStatus("playing"), flap()))} />
    </GameShell>
  );
}
