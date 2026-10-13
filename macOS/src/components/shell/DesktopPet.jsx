// src/components/shell/DesktopPet.jsx
// Churro, the pixel puppy from Marta's Journey, naps in the desktop corner. Click to wake him up.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PUPPY, PUPPY_PAL } from "../windows/Journey/levels";
import { pick } from "../../config/humor";

const LINES = [
  "Woof! (translation: hire Marta)",
  "¡Guau! 🇪🇸",
  "I was promised a kanelbulle 🥐",
  "Have you seen the case studies? 10/10, would sniff again",
  "I'm the QA team. Everything is fine 🐾",
  "Do you have treats? Asking for a friend",
  "zzz… oh hi! I wasn't sleeping 👀",
];
const PX = 6; // size of one sprite pixel

function Sprite({ flip }) {
  const w = PUPPY[0].length;
  return (
    <svg width={w * PX} height={PUPPY.length * PX} viewBox={`0 0 ${w} ${PUPPY.length}`} shapeRendering="crispEdges" style={{ transform: flip ? "scaleX(-1)" : undefined }} aria-hidden="true">
      {PUPPY.flatMap((row, y) => [...row].map((k, x) => (k === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PUPPY_PAL[k]} />)))}
    </svg>
  );
}

export default function DesktopPet({ loaded }) {
  const [awake, setAwake] = useState(false);
  const [say, setSay] = useState(null);
  const [hops, setHops] = useState(0);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const poke = () => {
    clearTimeout(timer.current);
    setAwake(true);
    setHops((h) => h + 1);
    setSay(pick(LINES));
    timer.current = setTimeout(() => {
      setSay(null);
      setAwake(false);
    }, 3800);
  };

  if (!loaded) return null;
  return (
    <motion.div
      className="fixed left-6 bottom-[104px] z-20 hidden lg:block select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <AnimatePresence>
        {say && (
          <motion.div
            key={say}
            className="absolute bottom-[46px] left-0 w-max max-w-[220px] rounded-[14px] rounded-bl-[4px] bg-white/90 backdrop-blur-md px-3 py-1.5 text-[12px] font-medium text-[#1d1d1f] shadow-lg"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {say}
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={poke} aria-label="Pet Churro the puppy" className="relative block outline-none focus-visible:ring-2 ring-white/70 rounded-lg p-1">
        <motion.div key={hops} animate={awake ? { y: [0, -14, 0, -6, 0] } : { y: 0 }} transition={{ duration: 0.7 }}>
          <motion.div animate={awake ? { rotate: 0 } : { scaleY: [1, 0.94, 1] }} transition={awake ? { duration: 0.2 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "bottom" }}>
            <Sprite flip={awake && hops % 2 === 0} />
          </motion.div>
        </motion.div>
        {!awake && (
          <motion.span className="absolute -top-2 right-0 text-[11px] font-bold text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]" animate={{ y: [0, -6], opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
            z
          </motion.span>
        )}
      </button>
    </motion.div>
  );
}
