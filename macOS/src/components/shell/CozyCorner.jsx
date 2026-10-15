// src/components/shell/CozyCorner.jsx
// A little desk in the bottom-left corner: the "Currently" card, Lagom the plant and a coffee mug.
// Large screens only, like the widgets. Preview the plant's moods with ?plant=thirsty|droopy|friday
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CURRENTLY } from "../../config/currently";

const W = 150;
const GAP = 12;
const DAY = 24 * 60 * 60 * 1000;
const PLANT_KEY = "portfolio.plant.v1";
const MUG_MINUTES = 12; // a full mug lasts this long

function tile(isDark) {
  return {
    background: isDark ? "rgba(30,30,32,0.55)" : "rgba(255,255,255,0.55)",
    boxShadow: isDark
      ? "0 0 0 0.5px rgba(255,255,255,0.12) inset, 0 12px 30px -12px rgba(0,0,0,0.6)"
      : "0 0 0 0.5px rgba(255,255,255,0.6) inset, 0 12px 30px -12px rgba(0,0,0,0.25)",
  };
}

/* ---------- Currently ---------- */
function Currently({ isDark, text, sub }) {
  return (
    <motion.div
      className="rounded-[22px] backdrop-blur-2xl backdrop-saturate-150 px-4 py-3"
      style={{ ...tile(isDark), width: W * 2 + GAP }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 24 }}
      aria-label="What Marta is up to right now"
    >
      <div className="flex items-baseline justify-between">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${sub}`}>Currently</span>
        <span className={`text-[10px] ${sub}`}>{CURRENTLY.updated}</span>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
        {CURRENTLY.items.map((it) => (
          <li key={it.label} className="flex items-start gap-1.5 min-w-0">
            <span className="text-[14px] leading-[18px]">{it.emoji}</span>
            <span className="min-w-0">
              <span className={`block text-[9.5px] leading-tight ${sub}`}>{it.label}</span>
              <span className={`block text-[12px] font-semibold leading-tight truncate ${text}`}>{it.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ---------- Lagom the plant ---------- */
function loadPlant() {
  try {
    return JSON.parse(localStorage.getItem(PLANT_KEY) || "null");
  } catch {
    return null;
  }
}
function savePlant(p) {
  try {
    localStorage.setItem(PLANT_KEY, JSON.stringify(p));
  } catch {
    /* storage blocked: the plant just won't remember */
  }
}

function moodOf(plant) {
  const q = new URLSearchParams(window.location.search).get("plant");
  if (q === "thirsty" || q === "droopy") return q;
  if (!plant) return "new";
  const days = (Date.now() - plant.watered) / DAY;
  if (days < 2) return "happy";
  if (days < 4) return "thirsty";
  return "droopy";
}

const MOOD = {
  new: { leaf: "#5fb36a", droop: 0, line: "Hi, I’m Lagom 🌱 Water me?" },
  happy: { leaf: "#4fae62", droop: 0, line: "Lagom is happy 🌱" },
  thirsty: { leaf: "#86b466", droop: 14, line: "A little thirsty 🥺" },
  droopy: { leaf: "#a7a45a", droop: 34, line: "Lagom missed you 💧" },
};

// a small succulent rosette: each leaf pivots at the base, so drooping is just rotating outwards
const LEAVES = [-62, -34, -12, 12, 34, 62];

function PlantSvg({ mood, partyHat, bounce }) {
  const m = MOOD[mood];
  return (
    <motion.svg viewBox="0 0 100 100" className="w-[84px] h-[84px]" animate={bounce ? { y: [0, -6, 0, -3, 0] } : { y: 0 }} transition={{ duration: 0.6 }} aria-hidden="true">
      {/* leaves */}
      <g>
        {LEAVES.map((a, i) => {
          const angle = a + Math.sign(a) * m.droop;
          const len = i === 2 || i === 3 ? 30 : 25;
          return (
            <motion.ellipse
              key={a}
              cx="50"
              cy={60 - len / 2}
              rx="7.5"
              ry={len / 2}
              fill={m.leaf}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.8"
              style={{ transformBox: "view-box", transformOrigin: "50px 58px" }}
              initial={false}
              animate={{ rotate: angle, fill: m.leaf }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            />
          );
        })}
        <circle cx="50" cy="58" r="6" fill={m.leaf} />
      </g>
      {/* pot */}
      <path d="M30 60h40l-5 30H35z" fill="#d9825b" />
      <rect x="27" y="56" width="46" height="8" rx="2.5" fill="#e8956b" />
      <path d="M36 72h28" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
      {/* face */}
      <circle cx="44" cy="75" r="1.6" fill="#5a2e1d" />
      <circle cx="56" cy="75" r="1.6" fill="#5a2e1d" />
      {mood === "droopy" || mood === "thirsty" ? (
        <path d="M46 81q4-3 8 0" stroke="#5a2e1d" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M46 79q4 3.5 8 0" stroke="#5a2e1d" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}
      {/* Friday party hat */}
      {partyHat && (
        <g transform="translate(50 26) rotate(12)">
          <path d="M-7 8L0 -12L7 8z" fill="#ff5a8a" />
          <path d="M-4.5 1h9M-2.5 -5h5" stroke="#ffd60a" strokeWidth="1.6" />
          <circle cx="0" cy="-12.5" r="2.4" fill="#ffd60a" />
        </g>
      )}
    </motion.svg>
  );
}

function Plant({ isDark, text, sub }) {
  const [plant, setPlant] = useState(loadPlant);
  const [drops, setDrops] = useState(0);
  const [thanks, setThanks] = useState(false);
  const mood = moodOf(plant);
  const q = new URLSearchParams(window.location.search).get("plant");
  const friday = q === "friday" || new Date().getDay() === 5;

  function water() {
    const next = { watered: Date.now(), count: (plant?.count ?? 0) + 1 };
    savePlant(next);
    setPlant(next);
    setDrops((d) => d + 1);
    setThanks(true);
    setTimeout(() => setThanks(false), 2200);
  }

  const line = thanks ? "Ahh, thank you 💧" : friday && (mood === "happy" || mood === "new") ? "Fredag! Party time 🎉" : MOOD[mood].line;

  return (
    <motion.button
      type="button"
      onClick={water}
      className="relative rounded-[22px] backdrop-blur-2xl backdrop-saturate-150 overflow-hidden flex flex-col items-center text-center"
      style={{ ...tile(isDark), width: W, height: W }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Lagom the plant: ${line}. Click to water.`}
      title="Click to water Lagom"
    >
      <span className={`mt-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${sub}`}>Lagom</span>
      <span className="relative -mt-0.5">
        <PlantSvg mood={mood} partyHat={friday} bounce={thanks} />
        {/* water drops */}
        <AnimatePresence>
          {thanks &&
            [0, 1, 2].map((k) => (
              <motion.span
                key={`${drops}-${k}`}
                className="absolute top-0 text-[11px]"
                style={{ left: 26 + k * 14 }}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 30, opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: k * 0.12 }}
              >
                💧
              </motion.span>
            ))}
        </AnimatePresence>
      </span>
      <span className={`px-2 text-[11px] font-semibold leading-tight ${text}`}>{line}</span>
      <span className={`mt-0.5 text-[9.5px] ${sub}`}>{plant?.count ? `Watered ${plant.count}× by you` : "Click to water"}</span>
    </motion.button>
  );
}

/* ---------- coffee mug ---------- */
function Mug({ isDark, notify }) {
  const [filled, setFilled] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);
  const level = Math.max(0, 1 - (now - filled) / (MUG_MINUTES * 60 * 1000));
  const empty = level === 0;

  function refill() {
    setFilled(Date.now());
    setNow(Date.now());
    notify?.({ title: "Coffee", message: empty ? "Refilled ☕ Back to work." : "Topped up ☕ Back to work.", toast: true });
  }

  // liquid fills the inside of the cup from y=46 (full) down to y=84 (empty)
  const top = 46 + (1 - level) * 38;
  return (
    <motion.button
      type="button"
      onClick={refill}
      className="self-end mb-1 w-[64px] h-[64px]"
      initial={{ opacity: 0, y: 10 }}
      animate={empty ? { opacity: 1, y: 0, rotate: [0, -6, 6, -3, 0] } : { opacity: 1, y: 0, rotate: 0 }}
      transition={empty ? { rotate: { duration: 0.6, repeat: Infinity, repeatDelay: 6 } } : { delay: 0.7 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={empty ? "Empty coffee mug. Click to refill." : `Coffee mug, ${Math.round(level * 100)}% full. Click to refill.`}
      title={empty ? "Empty. Refill?" : `${Math.round(level * 100)}% coffee`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]" aria-hidden="true">
        <defs>
          <clipPath id="mug-inside">
            <path d="M24 40h46v38a12 12 0 0 1-12 12H36a12 12 0 0 1-12-12z" />
          </clipPath>
        </defs>
        {/* steam while there's coffee */}
        {level > 0.25 &&
          [38, 50, 62].map((x, i) => (
            <motion.path
              key={x}
              d={`M${x} 34c-4-5 4-8 0-14`}
              stroke={isDark ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.85)"}
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0, 0.9, 0], y: [4, -4, -10] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        {/* handle */}
        <path d="M70 52h6a9 9 0 0 1 0 18h-6" stroke="rgba(255,255,255,0.85)" strokeWidth="5" fill="none" />
        {/* glass cup, so you can see how much coffee is left */}
        <path d="M24 40h46v38a12 12 0 0 1-12 12H36a12 12 0 0 1-12-12z" fill="rgba(255,255,255,0.28)" />
        <g clipPath="url(#mug-inside)">
          <motion.rect x="24" width="46" height="60" fill="#6b3f26" initial={false} animate={{ y: top }} transition={{ duration: 0.8 }} />
          <motion.rect x="24" width="46" height="4" fill="#c69a6d" initial={false} animate={{ y: top }} transition={{ duration: 0.8 }} />
        </g>
        <path d="M24 40h46v38a12 12 0 0 1-12 12H36a12 12 0 0 1-12-12z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />
        <path d="M30 48v26" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}

export default function CozyCorner({ loaded, theme = "light", notify }) {
  const isDark = theme === "dark";
  const text = isDark ? "text-white" : "text-[#1d1d1f]";
  const sub = isDark ? "text-white/60" : "text-black/55";

  // fit between the desktop icons (top ~380px) and the Dock: scale down on shorter screens instead of hiding
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const NATURAL_H = 280; // Currently card + plant row
    const fit = () => setScale(Math.min(1, (window.innerHeight - 96 - 380) / NATURAL_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  if (!loaded || scale < 0.55) return null;

  return (
    <div
      // large screens only, like the widgets
      className="fixed left-4 bottom-[96px] z-30 hidden lg:flex flex-col gap-3 origin-bottom-left"
      style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}
      aria-label="Marta’s desk"
    >
      <Currently isDark={isDark} text={text} sub={sub} />
      <div className="flex items-end gap-3">
        <Plant isDark={isDark} text={text} sub={sub} />
        <Mug isDark={isDark} notify={notify} />
      </div>
    </div>
  );
}
