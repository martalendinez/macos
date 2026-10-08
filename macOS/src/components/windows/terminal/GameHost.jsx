// src/components/windows/terminal/GameHost.jsx
// Runs a game "full screen" inside the Terminal pane, like an ncurses app.
import { useEffect, useRef } from "react";
import { useKeys } from "./games/kit";
import SnakeGame from "./games/SnakeGame";
import PongGame from "./games/PongGame";
import TetrisGame from "./games/TetrisGame";
import Game2048 from "./games/Game2048";
import BreakoutGame from "./games/BreakoutGame";
import FlappyGame from "./games/FlappyGame";

const GAMES = { snake: SnakeGame, pong: PongGame, tetris: TetrisGame, 2048: Game2048, breakout: BreakoutGame, flappy: FlappyGame };

function MatrixRain({ onExit }) {
  const ref = useRef(null);
  useKeys(() => onExit());
  useEffect(() => {
    const c = ref.current;
    const parent = c.parentElement;
    const w = (c.width = parent.clientWidth);
    const h = (c.height = parent.clientHeight);
    const ctx = c.getContext("2d");
    const size = 16;
    const cols = Math.floor(w / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノMARTA01<>/{}=";
    let raf;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px ui-monospace, Menlo, monospace`;
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.96 ? "#d4ffd8" : "#28fe14";
        ctx.fillText(ch, i * size, y * size);
        drops[i] = y * size > h && Math.random() > 0.975 ? 0 : y + 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(onExit, 9000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [onExit]);
  return (
    <div className="absolute inset-0 bg-black">
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute bottom-3 inset-x-0 text-center font-mono text-[12px] text-[#28fe14]/80">Wake up, Neo… (press any key)</div>
    </div>
  );
}

export default function GameHost({ game, onExit }) {
  useKeys((e) => {
    if (e.key === "Escape") onExit();
  });

  if (game === "matrix") return <MatrixRain onExit={onExit} />;
  const Game = GAMES[game];
  return (
    // m-auto centers the game but still scrolls when it's taller than the pane (phones + touch pad)
    <div className="absolute inset-0 overflow-auto flex p-3 @lg:p-4" style={{ background: "radial-gradient(circle at 50% 30%, #11161f, #05070a 70%)" }}>
      <div className="m-auto w-full flex justify-center">{Game ? <Game /> : null}</div>
    </div>
  );
}
