// src/components/windows/Journey/JourneyWindow.jsx
// Marta's Journey: a pixel-art platformer through the cities Marta has lived in.
// 320×180 canvas scaled up pixel-perfect, fixed 60 fps physics, sprites drawn from strings in levels.js.
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FLAGS, FLYER, ITEMS, LEVELS, PLAYER, PLAYER_PAL, PUPPY, PUPPY_PAL, ROWS, T, WALKER } from "./levels";

const W = 320;
const H = 180;
const STORE = "portfolio.journey.v1";
const FONT = "'Press Start 2P', monospace";
const ENEMY_TINT = { madrid: "#8e6bd6", groningen: "#4f79a8", stuttgart: "#d94848", hamilton: "#6c4ad1", stockholm: "#c0392b" };
const FLYER_TINT = { madrid: "#f4f4f4", groningen: "#7d8ea3", stuttgart: "#e67e22", hamilton: "#3d5a80", stockholm: "#e9d8a6" };

/* ---------- tiny sfx ---------- */
let actx = null;
function beep(muted, f1, f2 = f1, dur = 0.1, type = "square", vol = 0.05) {
  if (muted) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, actx.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, f2), actx.currentTime + dur);
    g.gain.setValueAtTime(vol, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination);
    o.start();
    o.stop(actx.currentTime + dur);
  } catch {
    /* audio unavailable */
  }
}

/* ---------- drawing helpers ---------- */
function sprite(ctx, rows, pal, x, y, flip = false, tint) {
  const w = rows[0].length;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const k = row[c];
      if (k === ".") continue;
      ctx.fillStyle = k === "k" && tint ? tint : pal[k] || "#f0f";
      ctx.fillRect(Math.round(x + (flip ? w - 1 - c : c)), Math.round(y + r), 1, 1);
    }
  }
}
const ENEMY_PAL = { w: "#ffffff", b: "#111111", m: "#2a1020" };

function text(ctx, s, x, y, color = "#fff", align = "left", size = 8) {
  ctx.font = `${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillText(s, x + 1, y + 1);
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
}

function heart(ctx, x, y, full) {
  const px = [".rr.rr.", "rrrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r..."];
  sprite(ctx, px, { r: full ? "#ff4d6d" : "rgba(255,255,255,0.25)" }, x, y);
}

/* city backdrops, drawn procedurally with parallax */
function backdrop(ctx, L, cam, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, L.sky[0]);
  g.addColorStop(1, L.sky[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const far = -cam * 0.2;
  const mid = -cam * 0.45;
  const rep = (off, span, fn) => {
    const start = Math.floor(-off / span) - 1;
    for (let i = start; i < start + Math.ceil(W / span) + 3; i++) fn(off + i * span, i);
  };
  const id = L.id;
  if (id === "madrid") {
    ctx.fillStyle = "#fff4c2";
    ctx.beginPath();
    ctx.arc(250, 40, 18, 0, Math.PI * 2);
    ctx.fill();
    rep(far, 70, (x, i) => {
      ctx.fillStyle = L.far;
      const h = 40 + ((i * 37) % 30);
      ctx.fillRect(x, 140 - h, 46, h);
      ctx.fillRect(x + 50, 150 - h * 0.6, 16, h * 0.6);
    });
    rep(mid, 110, (x, i) => {
      ctx.fillStyle = L.mid;
      const h = 30 + ((i * 53) % 24);
      ctx.fillRect(x, 150 - h, 60, h);
      ctx.fillStyle = "#f7d79a";
      for (let wy = 150 - h + 6; wy < 140; wy += 10) for (let wx = x + 6; wx < x + 56; wx += 12) ctx.fillRect(wx, wy, 4, 5);
    });
  } else if (id === "groningen") {
    rep(-cam * 0.1, 120, (x) => {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillRect(x + 10, 30, 36, 8);
      ctx.fillRect(x + 18, 24, 20, 8);
    });
    rep(far, 160, (x) => {
      ctx.fillStyle = L.far;
      ctx.fillRect(x + 60, 80, 10, 60);
      ctx.save();
      ctx.translate(x + 65, 82);
      ctx.rotate(t * 0.01);
      for (let a = 0; a < 4; a++) {
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-2, 0, 4, 26);
      }
      ctx.restore();
    });
    rep(mid, 26, (x, i) => {
      const h = 34 + ((i * 29) % 22);
      ctx.fillStyle = i % 3 === 0 ? "#6e3a2a" : i % 3 === 1 ? L.mid : "#9b5a3c";
      ctx.fillRect(x, 150 - h, 24, h);
      ctx.fillRect(x + 4, 150 - h - 6, 16, 6);
      ctx.fillRect(x + 8, 150 - h - 10, 8, 4);
      ctx.fillStyle = "#e8e0d0";
      ctx.fillRect(x + 5, 150 - h + 8, 5, 7);
      ctx.fillRect(x + 14, 150 - h + 8, 5, 7);
    });
  } else if (id === "stuttgart") {
    rep(far, 140, (x) => {
      ctx.fillStyle = L.far;
      ctx.beginPath();
      ctx.ellipse(x + 70, 150, 90, 50, 0, Math.PI, 0);
      ctx.fill();
    });
    rep(-cam * 0.3, 400, (x) => {
      ctx.fillStyle = "#c9d6de";
      ctx.fillRect(x + 200, 40, 4, 100);
      ctx.fillRect(x + 196, 50, 12, 10);
    });
    rep(mid, 90, (x, i) => {
      const h = 30 + ((i * 17) % 14);
      ctx.fillStyle = "#f3e7d3";
      ctx.fillRect(x, 150 - h, 40, h);
      ctx.fillStyle = "#7a4a2b";
      ctx.fillRect(x, 150 - h, 40, 3);
      ctx.fillRect(x + 19, 150 - h, 2, h);
      ctx.fillRect(x, 150 - h + 14, 40, 2);
      ctx.fillStyle = "#b5432f";
      ctx.beginPath();
      ctx.moveTo(x - 4, 150 - h);
      ctx.lineTo(x + 20, 150 - h - 18);
      ctx.lineTo(x + 44, 150 - h);
      ctx.fill();
    });
  } else if (id === "hamilton") {
    ctx.fillStyle = "#ffe8b0";
    ctx.beginPath();
    ctx.arc(70, 60, 22, 0, Math.PI * 2);
    ctx.fill();
    rep(far, 60, (x, i) => {
      ctx.fillStyle = L.far;
      const h = 50 + ((i * 13) % 20);
      ctx.beginPath();
      ctx.moveTo(x, 150);
      ctx.lineTo(x + 30, 150 - h);
      ctx.lineTo(x + 60, 150);
      ctx.fill();
    });
    rep(mid, 34, (x, i) => {
      if (i % 3 === 0) {
        ctx.fillStyle = "#b8321f";
        ctx.beginPath();
        ctx.arc(x + 16, 120, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4a2d1f";
        ctx.fillRect(x + 14, 130, 4, 20);
      } else {
        ctx.fillStyle = L.mid;
        ctx.beginPath();
        ctx.moveTo(x + 4, 150);
        ctx.lineTo(x + 16, 100 + ((i * 7) % 16));
        ctx.lineTo(x + 28, 150);
        ctx.fill();
      }
    });
  } else if (id === "stockholm") {
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.4 + ((i * 7) % 5) / 10})`;
      ctx.fillRect((i * 83 + 11) % W, (i * 41) % 90, 1, 1);
    }
    rep(far, 150, (x) => {
      ctx.fillStyle = L.far;
      ctx.fillRect(x, 100, 150, 50);
      ctx.fillRect(x + 60, 60, 12, 40);
      ctx.beginPath();
      ctx.moveTo(x + 58, 60);
      ctx.lineTo(x + 66, 34);
      ctx.lineTo(x + 74, 60);
      ctx.fill();
    });
    rep(mid, 30, (x, i) => {
      const h = 30 + ((i * 23) % 22);
      ctx.fillStyle = ["#c8693f", "#d9a441", "#a24d3a", "#e5c07b"][i % 4];
      ctx.fillRect(x, 150 - h, 28, h);
      ctx.fillStyle = "#eef4fa";
      ctx.fillRect(x - 1, 150 - h - 3, 30, 4);
      ctx.fillStyle = "#ffe8a3";
      ctx.fillRect(x + 6, 150 - h + 9, 5, 6);
      ctx.fillRect(x + 17, 150 - h + 9, 5, 6);
    });
  }
}

/* ---------- world ---------- */
function topRow(L, x) {
  for (let y = 0; y < ROWS; y++) if (L.grid[y][x]) return y;
  return ROWS;
}
function makeWorld(i, hearts = 3) {
  const L = LEVELS[i];
  const [sx, sy] = L.start;
  return {
    L,
    p: { x: sx * T + 3, y: sy * T - 15, vx: 0, vy: 0, w: 10, h: 15, ground: false, coyote: 0, buffer: 0, face: 1, inv: 0, anim: 0 },
    hearts,
    spawn: { x: sx * T + 3, y: sy * T - 15 },
    items: L.items.map(([x, y]) => ({ x: x * T + 4, y: y * T + 4, got: false })),
    walkers: L.walkers.map((x) => ({ x: x * T + 2, y: topRow(L, x) * T - 10, vx: -0.45, w: 12, h: 10, alive: true })),
    flyers: L.flyers.map(([x, y, r], k) => ({ ox: x * T, oy: y * T, r, t: k * 1.7, x: x * T, y: y * T, w: 14, h: 8, alive: true })),
    movers: (L.movers || []).map(([x, y, len, range, sp]) => ({ ox: x * T, x: x * T, y: y * T, w: len * T, h: 10, range, sp, dir: 1, dx: 0 })),
    check: { x: L.check * T, y: topRow(L, L.check) * T, hit: false },
    goal: { x: L.goal * T, y: topRow(L, L.goal) * T },
    boss: L.boss ? { x: L.boss * T, y: 9 * T - 28, vx: -0.8, vy: 0, w: 28, h: 28, hp: 3, inv: 0, alive: true, t: 0, awake: false } : null,
    puppy: L.puppy ? { hist: [] } : null,
    snow: L.snow ? Array.from({ length: 50 }, (_, k) => ({ x: (k * 67) % W, y: (k * 29) % H, s: 0.3 + (k % 5) * 0.12 })) : null,
    parts: [],
    cam: 0,
    t: 0,
    got: 0,
    stomps: 0,
    deaths: 0,
  };
}

const solid = (L, tx, ty) => tx >= 0 && tx < L.w && ty >= 0 && ty < ROWS && (L.grid[ty][tx] === 1 || L.grid[ty][tx] === 3);
const oneway = (L, tx, ty) => tx >= 0 && tx < L.w && ty >= 0 && ty < ROWS && L.grid[ty][tx] === 2;
const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function burst(w, x, y, color, n = 8) {
  for (let i = 0; i < n; i++) w.parts.push({ x, y, vx: Math.cos((i / n) * 6.28) * (1 + Math.random()), vy: Math.sin((i / n) * 6.28) * (1 + Math.random()) - 1, life: 30, color });
}

/* one physics step; returns an event string or null */
function step(w, input, muted) {
  const { L, p } = w;
  w.t++;
  const ice = L.ice;
  // horizontal
  const acc = p.ground ? (ice ? 0.12 : 0.35) : 0.22;
  const fric = p.ground ? (ice ? 0.04 : 0.3) : 0.05;
  if (input.left) {
    p.vx = Math.max(-1.7, p.vx - acc);
    p.face = -1;
  } else if (input.right) {
    p.vx = Math.min(1.7, p.vx + acc);
    p.face = 1;
  } else p.vx = Math.abs(p.vx) <= fric ? 0 : p.vx - Math.sign(p.vx) * fric;

  // jump with coyote time + buffer, variable height
  p.coyote = p.ground ? 6 : Math.max(0, p.coyote - 1);
  p.buffer = input.jumpPressed ? 7 : Math.max(0, p.buffer - 1);
  input.jumpPressed = false;
  if (p.buffer && p.coyote) {
    p.vy = -5.2;
    p.coyote = 0;
    p.buffer = 0;
    p.ground = false;
    beep(muted, 420, 820, 0.12);
  }
  if (!input.jump && p.vy < -2) p.vy = -2;
  p.vy = Math.min(4.6, p.vy + 0.28);

  // movers
  w.movers.forEach((m) => {
    const nx = m.x + m.sp * m.dir;
    if (nx > m.ox + m.range || nx < m.ox) m.dir *= -1;
    m.dx = m.sp * m.dir;
    m.x += m.dx;
  });

  // move x
  p.x += p.vx;
  const tx0 = Math.floor(p.x / T);
  const tx1 = Math.floor((p.x + p.w - 1) / T);
  const ty0 = Math.floor(p.y / T);
  const ty1 = Math.floor((p.y + p.h - 1) / T);
  for (let ty = ty0; ty <= ty1; ty++) {
    if (p.vx > 0 && solid(L, tx1, ty)) {
      p.x = tx1 * T - p.w;
      p.vx = 0;
    } else if (p.vx < 0 && solid(L, tx0, ty)) {
      p.x = (tx0 + 1) * T;
      p.vx = 0;
    }
  }
  p.x = Math.max(0, Math.min(L.w * T - p.w, p.x));

  // move y
  const prevBottom = p.y + p.h;
  p.y += p.vy;
  p.ground = false;
  const ax0 = Math.floor(p.x / T);
  const ax1 = Math.floor((p.x + p.w - 1) / T);
  if (p.vy >= 0) {
    const by = Math.floor((p.y + p.h) / T);
    for (let tx = ax0; tx <= ax1; tx++) {
      if (solid(L, tx, by) || (oneway(L, tx, by) && prevBottom <= by * T + 0.5)) {
        p.y = by * T - p.h;
        p.vy = 0;
        p.ground = true;
      }
    }
    w.movers.forEach((m) => {
      if (p.x + p.w > m.x && p.x < m.x + m.w && prevBottom <= m.y + 0.5 && p.y + p.h >= m.y) {
        p.y = m.y - p.h;
        p.vy = 0;
        p.ground = true;
        p.x += m.dx;
      }
    });
  } else {
    const ty = Math.floor(p.y / T);
    for (let tx = ax0; tx <= ax1; tx++) {
      if (solid(L, tx, ty)) {
        p.y = (ty + 1) * T;
        p.vy = 0;
      }
    }
  }
  p.anim += Math.abs(p.vx) * 0.12;
  if (p.inv > 0) p.inv--;

  const hurt = () => {
    if (p.inv) return;
    w.hearts--;
    p.inv = 90;
    p.vy = -2.6;
    p.vx = -p.face * 1.8;
    beep(muted, 200, 80, 0.25, "sawtooth", 0.05);
  };

  // pit
  if (p.y > ROWS * T + 24) {
    w.hearts--;
    w.deaths++;
    Object.assign(p, { x: w.spawn.x, y: w.spawn.y, vx: 0, vy: 0, inv: 60 });
    beep(muted, 300, 60, 0.35, "triangle", 0.06);
  }

  // checkpoint
  if (!w.check.hit && p.x >= w.check.x) {
    w.check.hit = true;
    w.spawn = { x: w.check.x, y: w.check.y - p.h - 1 };
    beep(muted, 660, 990, 0.15, "triangle");
  }

  // items
  w.items.forEach((it) => {
    if (!it.got && hit(p, { x: it.x, y: it.y + Math.sin((w.t + it.x) / 12) * 2, w: 8, h: 8 })) {
      it.got = true;
      w.got++;
      burst(w, it.x + 4, it.y + 4, "#fff6c2", 6);
      beep(muted, 880, 1320, 0.09, "square", 0.04);
    }
  });

  // walkers
  w.walkers.forEach((e) => {
    if (!e.alive) return;
    const nx = e.x + e.vx;
    const front = e.vx > 0 ? nx + e.w : nx;
    const ftx = Math.floor(front / T);
    const footTy = Math.floor((e.y + e.h + 1) / T);
    if (solid(L, ftx, Math.floor((e.y + 4) / T)) || (!solid(L, ftx, footTy) && !oneway(L, ftx, footTy))) e.vx *= -1;
    else e.x = nx;
    if (hit(p, e)) {
      if (p.vy > 0.5 && prevBottom <= e.y + 5) {
        e.alive = false;
        w.stomps++;
        p.vy = -3.8;
        burst(w, e.x + 6, e.y + 5, ENEMY_TINT[L.id]);
        beep(muted, 260, 120, 0.12, "square", 0.05);
      } else hurt();
    }
  });

  // flyers
  w.flyers.forEach((f) => {
    if (!f.alive) return;
    f.t += 0.018;
    const px = f.x;
    f.x = f.ox + Math.sin(f.t) * f.r;
    f.y = f.oy + Math.sin(f.t * 2.3) * 6;
    f.face = f.x >= px ? 1 : -1;
    if (hit(p, f)) {
      if (p.vy > 0.5 && prevBottom <= f.y + 5) {
        f.alive = false;
        w.stomps++;
        p.vy = -3.8;
        burst(w, f.x + 7, f.y + 4, FLYER_TINT[L.id]);
        beep(muted, 300, 140, 0.12);
      } else hurt();
    }
  });

  // boss: The Deadline
  const b = w.boss;
  if (b && b.alive) {
    if (!b.awake && p.x > b.x - 9 * T) b.awake = true;
    if (b.awake) {
      b.t++;
      if (b.inv) b.inv--;
      b.x += b.vx;
      if (b.x < 86 * T || b.x > 112 * T) b.vx *= -1;
      b.vy = Math.min(5, b.vy + 0.3);
      b.y += b.vy;
      const floor = 9 * T - b.h;
      if (b.y >= floor) {
        b.y = floor;
        b.vy = 0;
        if (b.t % 110 === 0) b.vy = -5.4;
      }
      if (hit(p, b)) {
        if (p.vy > 0.5 && prevBottom <= b.y + 8 && !b.inv) {
          b.hp--;
          b.inv = 50;
          p.vy = -5;
          b.vx = Math.sign(b.vx || 1) * (0.8 + (3 - b.hp) * 0.45);
          burst(w, b.x + 14, b.y + 4, "#ffffff", 10);
          beep(muted, 180, 90, 0.2, "square", 0.06);
          if (b.hp <= 0) {
            b.alive = false;
            burst(w, b.x + 14, b.y + 14, "#ffd166", 24);
            beep(muted, 523, 1046, 0.4, "triangle", 0.06);
          }
        } else if (!b.inv) hurt();
      }
    }
  }

  // puppy follows a few steps behind
  if (w.puppy) {
    w.puppy.hist.push({ x: p.x, y: p.y + p.h, face: p.face, ground: p.ground });
    if (w.puppy.hist.length > 22) w.puppy.hist.shift();
  }

  // particles + snow
  w.parts.forEach((q) => {
    q.x += q.vx;
    q.y += q.vy;
    q.vy += 0.08;
    q.life--;
  });
  w.parts = w.parts.filter((q) => q.life > 0);
  if (w.snow) w.snow.forEach((s) => {
    s.y += s.s;
    s.x += Math.sin((w.t + s.y) / 40) * 0.2;
    if (s.y > H) s.y = -2;
  });

  w.cam = Math.max(0, Math.min(L.w * T - W, p.x - W * 0.4));

  if (w.hearts <= 0) {
    w.hearts = 3;
    w.deaths++;
    Object.assign(p, { x: w.spawn.x, y: w.spawn.y, vx: 0, vy: 0, inv: 90 });
    return "retry";
  }
  const goalOpen = !w.boss || !w.boss.alive;
  if (goalOpen && p.x + p.w >= w.goal.x + 4) return "clear";
  return null;
}

/* ---------- render ---------- */
function render(ctx, w, showPlayer = true) {
  const { L, p, cam } = w;
  backdrop(ctx, L, cam, w.t);
  const x0 = Math.floor(cam / T);
  const x1 = Math.min(L.w - 1, x0 + Math.ceil(W / T) + 1);

  // water in pits
  if (L.pit) {
    for (let tx = x0; tx <= x1; tx++) {
      if (!L.grid[ROWS - 1][tx]) {
        ctx.fillStyle = L.pit;
        ctx.fillRect(tx * T - cam, ROWS * T - 10, T, 14);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillRect(tx * T - cam + ((w.t >> 3) % 8), ROWS * T - 10, 4, 1);
      }
    }
  }

  for (let ty = 0; ty < ROWS; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const v = L.grid[ty][tx];
      if (!v) continue;
      const sx = tx * T - Math.round(cam);
      const sy = ty * T;
      if (v === 1) {
        const isTop = ty === 0 || !L.grid[ty - 1][tx];
        ctx.fillStyle = L.body;
        ctx.fillRect(sx, sy, T, T);
        ctx.fillStyle = L.detail;
        const n = (tx * 7 + ty * 13) % 5;
        ctx.fillRect(sx + 3 + n, sy + 6 + (n % 3) * 2, 2, 2);
        ctx.fillRect(sx + 10 - n, sy + 11, 2, 2);
        if (isTop) {
          ctx.fillStyle = L.top;
          ctx.fillRect(sx, sy, T, 5);
          ctx.fillRect(sx + ((tx * 5) % 12), sy + 5, 3, 2);
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          ctx.fillRect(sx, sy, T, 1);
        }
      } else if (v === 3) {
        ctx.fillStyle = L.detail;
        ctx.fillRect(sx, sy, T, T);
        ctx.fillStyle = L.body;
        ctx.fillRect(sx + 1, sy + 1, 6, 6);
        ctx.fillRect(sx + 9, sy + 1, 6, 6);
        ctx.fillRect(sx + 1, sy + 9, 14, 6);
      } else if (v === 2) {
        ctx.fillStyle = "#8d5a34";
        ctx.fillRect(sx, sy, T, 5);
        ctx.fillStyle = "#b37845";
        ctx.fillRect(sx, sy, T, 2);
        ctx.fillStyle = "#5e3a20";
        ctx.fillRect(sx + 7, sy + 1, 1, 4);
      }
    }
  }

  // movers (FlixBus in Stuttgart)
  w.movers.forEach((m) => {
    const sx = Math.round(m.x - cam);
    if (L.id === "stuttgart") {
      ctx.fillStyle = "#73d700";
      ctx.fillRect(sx, m.y, m.w, 12);
      ctx.fillStyle = "#1d2b1a";
      for (let k = 4; k < m.w - 8; k += 8) ctx.fillRect(sx + k, m.y + 3, 6, 4);
      ctx.fillStyle = "#ff8a00";
      ctx.fillRect(sx, m.y + 9, m.w, 2);
      ctx.fillStyle = "#222";
      ctx.fillRect(sx + 6, m.y + 11, 6, 4);
      ctx.fillRect(sx + m.w - 12, m.y + 11, 6, 4);
    } else {
      ctx.fillStyle = "#8d5a34";
      ctx.fillRect(sx, m.y, m.w, 6);
    }
  });

  // checkpoint
  {
    const sx = w.check.x - cam;
    ctx.fillStyle = "#ddd";
    ctx.fillRect(sx, w.check.y - 26, 2, 26);
    ctx.fillStyle = w.check.hit ? "#2ecc71" : "#9aa0a6";
    ctx.fillRect(sx + 2, w.check.y - 26, 10, 7);
  }

  // goal
  {
    const sx = w.goal.x - cam;
    const gy = w.goal.y;
    if (L.next === "royc") {
      const open = !w.boss || !w.boss.alive;
      ctx.fillStyle = "#e9edf3";
      ctx.fillRect(sx - 14, gy - 58, 46, 58);
      ctx.fillStyle = "#1f2a44";
      ctx.fillRect(sx - 14, gy - 58, 46, 12);
      text(ctx, "ROYC", sx + 9, gy - 55, "#ffffff", "center", 6);
      ctx.fillStyle = open ? "#ffd166" : "#3b4a6b";
      ctx.fillRect(sx, gy - 30, 18, 30);
      ctx.fillStyle = "#9fb3d1";
      ctx.fillRect(sx - 10, gy - 40, 8, 8);
      ctx.fillRect(sx + 20, gy - 40, 8, 8);
      if (!open) text(ctx, "BEAT THE DEADLINE", sx + 9, gy - 72, "#ffd166", "center", 6);
    } else {
      ctx.fillStyle = "#e6e6e6";
      ctx.fillRect(sx, gy - 64, 3, 64);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(sx - 1, gy - 67, 5, 4);
      const f = FLAGS[L.next];
      const wave = Math.sin(w.t / 8);
      for (let k = 0; k < 3; k++) {
        ctx.fillStyle = f[k][0];
        ctx.fillRect(sx + 3, gy - 62 + k * 5 + Math.round(wave), 22, 5);
      }
      if (L.next === "se") {
        ctx.fillStyle = "#fecc00";
        ctx.fillRect(sx + 9, gy - 62 + Math.round(wave), 3, 15);
      }
      if (L.next === "ca") {
        ctx.fillStyle = "#d52b1e";
        ctx.fillRect(sx + 12, gy - 57 + Math.round(wave), 4, 4);
      }
    }
  }

  // items
  const it = ITEMS[L.item];
  w.items.forEach((o) => {
    if (o.got) return;
    sprite(ctx, it.px, it.pal, o.x - cam, o.y + Math.round(Math.sin((w.t + o.x) / 12) * 2));
  });

  // enemies
  w.walkers.forEach((e) => {
    if (!e.alive) return;
    const sq = Math.floor(w.t / 10) % 2;
    sprite(ctx, WALKER, ENEMY_PAL, e.x - cam, e.y + sq, e.vx > 0, ENEMY_TINT[L.id]);
  });
  w.flyers.forEach((f) => {
    if (!f.alive) return;
    sprite(ctx, FLYER, ENEMY_PAL, f.x - cam, f.y, f.face < 0, FLYER_TINT[L.id]);
  });

  // boss
  const b = w.boss;
  if (b && b.alive) {
    const bx = b.x - cam + 14;
    const by = b.y + 14;
    if (!(b.inv && (b.inv >> 2) % 2)) {
      ctx.fillStyle = "#c0392b";
      ctx.beginPath();
      ctx.arc(bx, by, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fdf6e3";
      ctx.beginPath();
      ctx.arc(bx, by, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(w.t / 6) * 8, by + Math.sin(w.t / 6) * 8);
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(w.t / 40) * 5, by + Math.sin(w.t / 40) * 5);
      ctx.stroke();
      ctx.fillStyle = "#222";
      ctx.fillRect(bx - 7, by - 6, 4, 2);
      ctx.fillRect(bx + 3, by - 6, 4, 2);
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(bx - 10, by - 18, 4, 5);
      ctx.fillRect(bx + 6, by - 18, 4, 5);
    }
    if (b.awake) {
      text(ctx, "THE DEADLINE", bx, b.y - 22, "#ffd166", "center", 6);
      for (let k = 0; k < 3; k++) heart(ctx, bx - 12 + k * 9, b.y - 13, k < b.hp);
    }
  }

  // puppy
  if (w.puppy && w.puppy.hist.length) {
    const h0 = w.puppy.hist[0];
    sprite(ctx, PUPPY, PUPPY_PAL, h0.x - cam - 12 * h0.face, h0.y - 6 + (h0.ground ? 0 : -1), h0.face < 0);
  }

  // player
  if (showPlayer && !(p.inv && (p.inv >> 2) % 2)) {
    const frame = !p.ground ? PLAYER.jump : Math.abs(p.vx) > 0.2 ? (Math.floor(p.anim) % 2 ? PLAYER.run1 : PLAYER.run2) : PLAYER.idle;
    sprite(ctx, frame, PLAYER_PAL, p.x - 1 - cam, p.y - 1, p.face < 0);
  }

  w.parts.forEach((q) => {
    ctx.fillStyle = q.color;
    ctx.fillRect(Math.round(q.x - cam), Math.round(q.y), 2, 2);
  });
  if (w.snow) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    w.snow.forEach((s) => ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1));
  }
}

function hud(ctx, w) {
  for (let k = 0; k < 3; k++) heart(ctx, 6 + k * 9, 6, k < w.hearts);
  text(ctx, w.L.city.toUpperCase(), 36, 6, "#ffffff");
  const it = ITEMS[w.L.item];
  sprite(ctx, it.px, it.pal, W - 52, 5);
  text(ctx, `${w.got}/${w.items.length}`, W - 6, 6, "#ffffff", "right");
}

/* ---------- component ---------- */
const loadSave = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE) || "null") || { unlocked: 1, done: false };
  } catch {
    return { unlocked: 1, done: false };
  }
};

export default function JourneyWindow({ onOpenWindow, unlockAchievement }) {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const worldRef = useRef(null);
  const input = useRef({ left: false, right: false, jump: false, jumpPressed: false });
  const screenRef = useRef("title");
  const [screen, setScreenState] = useState("title");
  const [level, setLevel] = useState(0);
  const [result, setResult] = useState(null);
  const [save, setSave] = useState(loadSave);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const totals = useRef({ items: 0, max: 0, deaths: 0, stomps: 0, start: 0 });
  const [flash, setFlash] = useState(null);
  const [size, setSize] = useState({ w: W * 2, h: H * 2 });

  // fit the 320×180 canvas into the window, in whole-pixel steps when there's room (crisper pixels)
  useEffect(() => {
    const el = rootRef.current;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      let sc = Math.min(width / W, height / H);
      if (sc >= 2) sc = Math.floor(sc * 2) / 2;
      setSize({ w: Math.floor(W * sc), h: Math.floor(H * sc) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setScreen = (s) => {
    screenRef.current = s;
    setScreenState(s);
  };
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const persist = (next) => {
    setSave(next);
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {
      /* storage blocked */
    }
  };

  const loadLevel = useCallback((i) => {
    worldRef.current = makeWorld(i);
    setLevel(i);
    if (import.meta.env.DEV) window.__journey = worldRef; // lets automated tests teleport
  }, []);

  useEffect(() => {
    loadLevel(0);
  }, [loadLevel]);

  // main loop: always draws; only steps physics while playing
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    let raf;
    let last = performance.now();
    let acc = 0;
    const loop = (now) => {
      acc += Math.min(100, now - last);
      last = now;
      const w = worldRef.current;
      if (w) {
        while (acc >= 1000 / 60) {
          acc -= 1000 / 60;
          if (screenRef.current === "play") {
            const ev = step(w, input.current, mutedRef.current);
            if (ev === "retry") {
              setFlash("Try again!");
              setTimeout(() => setFlash(null), 1100);
            }
            if (ev === "clear") {
              const t = totals.current;
              t.items += w.got;
              t.max += w.items.length;
              t.deaths += w.deaths;
              t.stomps += w.stomps;
              setResult({ got: w.got, max: w.items.length, deaths: w.deaths, stomps: w.stomps });
              beep(mutedRef.current, 523, 784, 0.15, "triangle");
              setTimeout(() => beep(mutedRef.current, 784, 1046, 0.25, "triangle"), 150);
              setScreen(w.L.next === "royc" ? "end" : "clear");
            }
          } else {
            // idle camera drift behind menus
            w.t++;
            if (screenRef.current === "title") w.cam = (Math.sin(w.t / 400) * 0.5 + 0.5) * (w.L.w * T - W);
          }
        }
        render(ctx, w, screenRef.current !== "title");
        if (screenRef.current === "play") hud(ctx, w);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // finishing the game
  useEffect(() => {
    if (screen === "end") {
      persist({ unlocked: LEVELS.length, done: true });
      unlockAchievement?.("journey_complete", "🏆 Achievement unlocked: Full Journey", "From Madrid to ROYC, one jump at a time 🎮");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const start = (i) => {
    if (i === 0 && screen !== "clear") totals.current = { items: 0, max: 0, deaths: 0, stomps: 0, start: performance.now() };
    loadLevel(i);
    setScreen("intro");
    rootRef.current?.focus();
  };
  const go = () => {
    setScreen("play");
    rootRef.current?.focus();
  };
  const next = () => {
    const n = level + 1;
    if (n + 1 > save.unlocked) persist({ ...save, unlocked: n + 1 });
    start(n);
  };

  // keyboard: only while this window has focus
  const key = (e, down) => {
    const k = e.key;
    const map = { ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
    if (map[k]) {
      input.current[map[k]] = down;
      e.preventDefault();
    }
    if (k === " " || k === "ArrowUp" || k === "w" || k === "W" || k === "z" || k === "Z") {
      if (down && !input.current.jump) input.current.jumpPressed = true;
      input.current.jump = down;
      e.preventDefault();
      if (down && screenRef.current === "intro") go();
    }
    if (down && k === "Enter") {
      if (screenRef.current === "intro") go();
      else if (screenRef.current === "clear") next();
      else if (screenRef.current === "title") start(0);
    }
    if (down && (k === "Escape" || k === "p" || k === "P")) {
      if (screenRef.current === "play") setScreen("paused");
      else if (screenRef.current === "paused") go();
    }
  };

  const L = LEVELS[level];
  const pad = (dir) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      if (dir === "jump") {
        input.current.jumpPressed = true;
        input.current.jump = true;
      } else input.current[dir] = true;
    },
    onPointerUp: () => {
      input.current[dir === "jump" ? "jump" : dir] = false;
    },
    onPointerLeave: () => {
      input.current[dir === "jump" ? "jump" : dir] = false;
    },
  });
  const btn = "px-4 py-2.5 text-[10px] tracking-wide text-white rounded-[4px] shadow-[0_3px_0_rgba(0,0,0,0.35)] active:translate-y-[2px] active:shadow-none";
  const pixel = { fontFamily: FONT };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={(e) => key(e, true)}
      onKeyUp={(e) => key(e, false)}
      onBlur={() => Object.assign(input.current, { left: false, right: false, jump: false })}
      className="@container no-darkwin relative h-full w-full flex flex-col items-center justify-center bg-[#0b0d14] outline-none select-none overflow-hidden"
    >
      <div className="relative" style={{ width: size.w, height: size.h }}>
        <canvas ref={canvasRef} width={W} height={H} className="absolute inset-0 w-full h-full" style={{ imageRendering: "pixelated" }} />

        <button type="button" onClick={() => setMuted((m) => !m)} className="absolute right-2 bottom-2 z-20 rounded-[4px] bg-black/40 px-2 py-1 text-[8px] text-white/80" style={pixel} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? "SOUND OFF" : "SOUND ON"}
        </button>

        <AnimatePresence>
          {flash && (
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <span className="text-[14px] text-[#ffd166] [text-shadow:2px_2px_0_#000]" style={pixel}>{flash}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {screen === "title" && (
            <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/35 text-center p-4" style={pixel}>
              <div className="text-[clamp(16px,4.2cqw,34px)] leading-tight text-[#ffd166] [text-shadow:3px_3px_0_#7a2e12]">MARTA’S JOURNEY</div>
              <div className="text-[clamp(7px,1.3cqw,11px)] text-white/90 [text-shadow:1px_1px_0_#000]">A platformer about how I got here</div>
              <div className="flex flex-wrap justify-center items-center gap-1.5 mt-1">
                {LEVELS.map((lv, i) => {
                  const open = i < save.unlocked;
                  return (
                    <div key={lv.id} className="flex items-center gap-1.5">
                      <button type="button" disabled={!open} onClick={() => start(i)} className={`rounded-[4px] px-2 py-1.5 text-[clamp(6px,1cqw,9px)] ${open ? "bg-white/90 text-[#1d1d1f] hover:bg-white" : "bg-white/15 text-white/40"}`}>
                        {open ? lv.city.toUpperCase() : "???"}
                      </button>
                      {i < LEVELS.length - 1 && <span className="text-white/60 text-[8px]">›</span>}
                    </div>
                  );
                })}
              </div>
              <button type="button" onClick={() => start(0)} className={`${btn} mt-2 bg-[#e4572e]`}>
                {save.done ? "PLAY AGAIN" : "PRESS START"}
              </button>
              <div className="text-[clamp(6px,0.95cqw,8px)] text-white/70 leading-relaxed">← → MOVE · SPACE JUMP · ESC PAUSE</div>
            </motion.div>
          )}

          {screen === "intro" && (
            <motion.div key={`intro-${level}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center bg-black/55 p-4" style={pixel}>
              <motion.div initial={{ y: 12 }} animate={{ y: 0 }} className="w-full max-w-[460px] rounded-[6px] bg-[#14182a]/95 p-5 text-white shadow-[0_6px_0_rgba(0,0,0,0.4)] ring-2 ring-white/10">
                <div className="text-[8px] text-white/50">LEVEL {level + 1} / {LEVELS.length} · {L.years}</div>
                <div className="mt-2 text-[16px] text-[#ffd166]">{L.city.toUpperCase()}</div>
                <div className="mt-1 text-[8px] text-white/70">{L.country.toUpperCase()} · {L.title.toUpperCase()}</div>
                <ul className="mt-4 space-y-2 text-[8px] leading-[1.7] text-white/90" style={{ fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.5 }}>
                  {L.facts.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-[#ffd166]">▸</span>{f}</li>
                  ))}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[7px] leading-relaxed">
                  <div className="rounded-[4px] bg-white/5 p-2"><span className="text-white/50">COLLECT</span><br />{L.items.length} {L.itemName.toUpperCase()}</div>
                  <div className="rounded-[4px] bg-white/5 p-2"><span className="text-white/50">WATCH OUT</span><br />{L.enemy.toUpperCase()}{L.boss ? " + ???" : ""}</div>
                </div>
                <button type="button" onClick={go} className={`${btn} mt-4 w-full bg-[#2a9d8f]`}>GO! (SPACE)</button>
              </motion.div>
            </motion.div>
          )}

          {screen === "paused" && (
            <motion.div key="paused" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/60" style={pixel}>
              <div className="text-[16px] text-white">PAUSED</div>
              <button type="button" onClick={go} className={`${btn} bg-[#2a9d8f]`}>RESUME</button>
              <button type="button" onClick={() => { loadLevel(level); setScreen("title"); }} className={`${btn} bg-white/20`}>QUIT TO MAP</button>
            </motion.div>
          )}

          {screen === "clear" && result && (
            <motion.div key="clear" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center bg-black/55 p-4" style={pixel}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-[420px] rounded-[6px] bg-[#14182a]/95 p-5 text-white text-center ring-2 ring-white/10">
                <div className="text-[14px] text-[#ffd166]">{L.city.toUpperCase()} CLEAR!</div>
                <div className="mt-4 text-[8px] text-white/60">SKILL UNLOCKED</div>
                <div className="mt-1.5 text-[12px] text-[#7ee0a1]">{L.skill.toUpperCase()}</div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-[7px]">
                  <div className="rounded-[4px] bg-white/5 p-2">{result.got}/{result.max}<br /><span className="text-white/50">{L.itemName.toUpperCase()}</span></div>
                  <div className="rounded-[4px] bg-white/5 p-2">{result.stomps}<br /><span className="text-white/50">STOMPS</span></div>
                  <div className="rounded-[4px] bg-white/5 p-2">{result.deaths}<br /><span className="text-white/50">FALLS</span></div>
                </div>
                <button type="button" onClick={next} className={`${btn} mt-5 w-full bg-[#e4572e]`}>NEXT: {LEVELS[level + 1]?.city.toUpperCase()}</button>
              </motion.div>
            </motion.div>
          )}

          {screen === "end" && (
            <motion.div key="end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center bg-black/65 p-4" style={pixel}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-[480px] rounded-[6px] bg-[#14182a]/95 p-5 text-white text-center ring-2 ring-[#ffd166]/40">
                <div className="text-[8px] text-white/60">AUGUST 2026 · STOCKHOLM</div>
                <div className="mt-2 text-[14px] leading-snug text-[#ffd166]">YOU MADE IT TO ROYC!</div>
                <div className="mt-2 text-[9px] text-[#7ee0a1]">DESIGN ENGINEER UNLOCKED</div>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {LEVELS.map((lv) => (
                    <span key={lv.id} className="rounded-[3px] bg-white/10 px-2 py-1 text-[7px]">{lv.skill.toUpperCase()}</span>
                  ))}
                </div>
                <div className="mt-4 text-[7px] text-white/70 leading-relaxed">
                  {totals.current.items}/{totals.current.max} COLLECTED · {totals.current.stomps} STOMPS · {totals.current.deaths} FALLS
                </div>
                <div className="mt-5 grid grid-cols-1 @lg:grid-cols-3 gap-2">
                  <button type="button" onClick={() => start(0)} className={`${btn} bg-[#e4572e]`}>PLAY AGAIN</button>
                  <button type="button" onClick={() => onOpenWindow?.("about")} className={`${btn} bg-[#2a9d8f]`}>ABOUT ME</button>
                  <button type="button" onClick={() => onOpenWindow?.("projects")} className={`${btn} bg-white/20`}>PROJECTS</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* touch controls */}
      {screen === "play" && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-between p-3 @3xl:hidden pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <button type="button" {...pad("left")} className="w-14 h-14 rounded-full bg-white/15 text-white text-[18px] touch-none" aria-label="Left">◀</button>
            <button type="button" {...pad("right")} className="w-14 h-14 rounded-full bg-white/15 text-white text-[18px] touch-none" aria-label="Right">▶</button>
          </div>
          <button type="button" {...pad("jump")} className="pointer-events-auto w-16 h-16 rounded-full bg-[#e4572e]/80 text-white text-[10px] touch-none" style={pixel} aria-label="Jump">JUMP</button>
        </div>
      )}
    </div>
  );
}
