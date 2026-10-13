// src/components/shell/Confetti.jsx
// A little burst of confetti at the cursor whenever an achievement unlocks (window event "portfolio:confetti").
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const COLORS = ["#ff6b9a", "#ffd166", "#5ee6b0", "#6aa7ff", "#b78bff", "#ff9f0a"];

export function fireConfetti() {
  window.dispatchEvent(new Event("portfolio:confetti"));
}

export default function Confetti() {
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    const move = (e) => (pos.current = { x: e.clientX, y: e.clientY });
    const fire = () => {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.a11yMotion === "reduce") return;
      const id = Date.now() + Math.random();
      const { x, y } = pos.current;
      const pieces = Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + Math.random() * 0.4;
        const d = 60 + Math.random() * 90;
        return { dx: Math.cos(a) * d, dy: Math.sin(a) * d - 40, r: Math.random() * 540 - 270, c: COLORS[i % COLORS.length], round: i % 3 === 0 };
      });
      setBursts((b) => [...b, { id, x, y, pieces }]);
      setTimeout(() => setBursts((b) => b.filter((x2) => x2.id !== id)), 1400);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("portfolio:confetti", fire);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("portfolio:confetti", fire);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[20000] pointer-events-none" aria-hidden="true">
      <AnimatePresence>
        {bursts.map((b) =>
          b.pieces.map((p, i) => (
            <motion.span
              key={`${b.id}-${i}`}
              className="absolute block"
              style={{ left: b.x, top: b.y, width: p.round ? 7 : 6, height: p.round ? 7 : 10, background: p.c, borderRadius: p.round ? "50%" : 2 }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.dx, y: [0, p.dy, p.dy + 120], opacity: [1, 1, 0], rotate: p.r }}
              transition={{ duration: 1.3, ease: "easeOut" }}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
