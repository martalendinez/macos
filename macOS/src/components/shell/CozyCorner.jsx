// src/components/shell/CozyCorner.jsx
// A little desk in the bottom-left corner: the "Lately" widget, Lagom the plant and a coffee mug.
// Large screens only, like the widgets. Preview the plant's moods with ?plant=thirsty|droopy|friday
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CURRENTLY } from "../../config/currently";

const W = 150;
const GAP = 12;
const DAY = 24 * 60 * 60 * 1000;
const PLANT_KEY = "portfolio.plant.v1";
const MUG_MINUTES = 12; // a full mug lasts this long

function glass(isDark) {
  return {
    background: isDark ? "rgba(30,30,32,0.55)" : "rgba(255,255,255,0.55)",
    boxShadow: isDark
      ? "0 0 0 0.5px rgba(255,255,255,0.12) inset, 0 12px 30px -12px rgba(0,0,0,0.6)"
      : "0 0 0 0.5px rgba(255,255,255,0.6) inset, 0 12px 30px -12px rgba(0,0,0,0.25)",
  };
}

/* ======================= Lately ======================= */
function Lately({ isDark, text, sub }) {
  const items = CURRENTLY.items;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 4500);
    return () => clearInterval(id);
  }, [paused, items.length]);
  const it = items[i];
  const next = () => setI((n) => (n + 1) % items.length);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={next}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && next()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden rounded-[22px] backdrop-blur-2xl backdrop-saturate-150 p-3.5 text-left cursor-pointer"
      style={{ ...glass(isDark), width: W * 2 + GAP, height: 128 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ scale: 1.02 }}
      aria-label={`Lately: ${it.label}, ${it.value}. Click for the next one.`}
    >
      {/* soft wash of the current item's colour */}
      <motion.div className="absolute inset-0 pointer-events-none" initial={false} animate={{ background: `radial-gradient(120% 140% at 0% 100%, ${it.tint}40, transparent 60%)` }} transition={{ duration: 0.6 }} />

      <div className="relative h-full flex items-center gap-3.5">
        {/* big icon tile */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={it.label}
            className="shrink-0 w-[84px] h-[84px] rounded-[22px] flex items-center justify-center text-[44px]"
            style={{
              background: `linear-gradient(160deg, ${it.tint}, ${it.tint}cc)`,
              boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -8px 16px rgba(0,0,0,0.12), 0 10px 22px -10px ${it.tint}`,
            }}
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.8, rotate: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <span className="drop-shadow-[0_3px_4px_rgba(0,0,0,0.25)]">{it.emoji}</span>
          </motion.span>
        </AnimatePresence>

        <div className="min-w-0 flex-1 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${sub}`}>Lately</span>
            <span className={`text-[9.5px] ${sub}`}>{CURRENTLY.updated}</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={it.label} className="flex-1 flex flex-col justify-center min-w-0" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              <span className="text-[10.5px] font-semibold" style={{ color: it.tint }}>
                {it.label}
              </span>
              <span className={`text-[17px] font-bold leading-tight tracking-[-0.01em] truncate ${text}`}>{it.value}</span>
              {it.note && <span className={`mt-0.5 text-[11px] leading-snug line-clamp-1 ${sub}`}>{it.note}</span>}
            </motion.div>
          </AnimatePresence>
          {/* page dots */}
          <div className="flex gap-1">
            {items.map((x, k) => (
              <span key={x.label} className="h-[5px] rounded-full transition-all duration-300" style={{ width: k === i ? 14 : 5, background: k === i ? it.tint : isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)" }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ======================= Lagom the plant ======================= */
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

// leaf colours per mood: [light, dark, outline]
const MOOD = {
  new: { leaf: ["#bff0b4", "#55b872", "#3c9259"], droop: 0, drops: 2, line: "Water me?" },
  happy: { leaf: ["#c3f5b8", "#4fb86e", "#3a9156"], droop: 0, drops: 3, line: "Hydrated ✨" },
  thirsty: { leaf: ["#dcefb2", "#8fbf5c", "#6e9a43"], droop: 12, drops: 2, line: "Thirsty…" },
  droopy: { leaf: ["#eee3a8", "#bca95a", "#94843f"], droop: 30, drops: 1, line: "Missed you" },
};

// one pointed succulent leaf, pointing up from (0,0)
const LEAF = "M0 0 C -9 -8 -10 -24 0 -36 C 10 -24 9 -8 0 0 Z";

function PlantArt({ mood, partyHat, sparkle }) {
  const m = MOOD[mood];
  const sad = mood === "thirsty" || mood === "droopy";
  const outer = [-58, -30, 30, 58];
  const inner = [-14, 14];
  return (
    <svg viewBox="0 0 120 120" className="w-[96px] h-[96px] overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="leaf-g" cx="50%" cy="85%" r="90%">
          <stop offset="0" stopColor={m.leaf[0]} />
          <stop offset="1" stopColor={m.leaf[1]} />
        </radialGradient>
        <linearGradient id="pot-g" x1="0" x2="1">
          <stop offset="0" stopColor="#ffd2c2" />
          <stop offset="0.55" stopColor="#f6a98f" />
          <stop offset="1" stopColor="#e88a70" />
        </linearGradient>
        <linearGradient id="rim-g" x1="0" x2="1">
          <stop offset="0" stopColor="#ffe1d5" />
          <stop offset="1" stopColor="#f4b39b" />
        </linearGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="60" cy="110" rx="30" ry="5" fill="rgba(0,0,0,0.16)" />

      {/* leaves: a rosette pivoting at the base; the outer ones droop outwards when thirsty */}
      <g transform="translate(60 68)">
        {outer.map((a) => (
          <path key={a} d={LEAF} fill="url(#leaf-g)" stroke={m.leaf[2]} strokeWidth="1.2" transform={`rotate(${a + Math.sign(a) * m.droop}) scale(1.15)`} />
        ))}
        {inner.map((a) => (
          <path key={a} d={LEAF} fill="url(#leaf-g)" stroke={m.leaf[2]} strokeWidth="1.2" transform={`rotate(${a + Math.sign(a) * m.droop * 0.5}) scale(1.25)`} />
        ))}
        <path d={LEAF} fill="url(#leaf-g)" stroke={m.leaf[2]} strokeWidth="1.2" transform={`rotate(0) scale(1.05 ${mood === "droopy" ? 1 : 1.3})`} />
        <path d="M0 -8 C -2 -18 -2 -28 0 -36" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>

      {/* pot */}
      <path d="M33 70 H87 L81 102 Q80 107 75 107 H45 Q40 107 39 102 Z" fill="url(#pot-g)" />
      <rect x="29" y="62" width="62" height="12" rx="6" fill="url(#rim-g)" />
      <path d="M38 78 L42 100" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />

      {/* face */}
      <g transform="translate(60 88)">
        {sad ? (
          <>
            <path d="M-10 -2 q3 -3 6 0" stroke="#4a2a20" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M4 -2 q3 -3 6 0" stroke="#4a2a20" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="-7" cy="-2" rx="2.6" ry="3.2" fill="#3b2219" />
            <ellipse cx="7" cy="-2" rx="2.6" ry="3.2" fill="#3b2219" />
            <circle cx="-6" cy="-3.2" r="0.9" fill="#fff" />
            <circle cx="8" cy="-3.2" r="0.9" fill="#fff" />
          </>
        )}
        <ellipse cx="-13" cy="4" rx="4" ry="2.4" fill="#ff7f9a" opacity="0.55" />
        <ellipse cx="13" cy="4" rx="4" ry="2.4" fill="#ff7f9a" opacity="0.55" />
        {sad ? <path d="M-3.5 7 q3.5 -3 7 0" stroke="#4a2a20" strokeWidth="1.8" fill="none" strokeLinecap="round" /> : <path d="M-4 4 q4 4.5 8 0" stroke="#4a2a20" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
      </g>

      {/* sweat drop when thirsty */}
      {sad && <path d="M90 50 q4 6 0 9 q-4 -3 0 -9z" fill="#8fd3ff" stroke="#4aa8e8" strokeWidth="0.8" />}

      {/* sparkles when happy */}
      {sparkle &&
        [
          [22, 40, 0],
          [98, 34, 0.5],
          [96, 64, 1],
        ].map(([x, y, d]) => (
          <motion.path
            key={x}
            d={`M${x} ${y - 5} L${x + 1.4} ${y - 1.4} L${x + 5} ${y} L${x + 1.4} ${y + 1.4} L${x} ${y + 5} L${x - 1.4} ${y + 1.4} L${x - 5} ${y} L${x - 1.4} ${y - 1.4} Z`}
            fill="#ffd84d"
            animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: d }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

      {/* Friday party hat */}
      {partyHat && (
        <g transform="translate(66 22) rotate(14)">
          <path d="M-9 10 L0 -14 L9 10 Z" fill="#ff6b9a" />
          <path d="M-6 3 H6 M-3.5 -4 H3.5" stroke="#fff3b0" strokeWidth="2.2" />
          <circle cx="0" cy="-15" r="3.4" fill="#ffd84d" />
        </g>
      )}
    </svg>
  );
}

function Drop({ full, isDark }) {
  return (
    <svg viewBox="0 0 12 16" className="w-[10px] h-[13px]" aria-hidden="true">
      <path d="M6 1 C 9 6 11 8.5 11 10.5 A5 5 0 0 1 1 10.5 C 1 8.5 3 6 6 1 Z" fill={full ? "#4aa8ff" : isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"} />
      {full && <path d="M4 10 a2 2 0 0 0 1.5 2" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

function Plant({ isDark, text }) {
  const [plant, setPlant] = useState(loadPlant);
  const [burst, setBurst] = useState(0);
  const [thanks, setThanks] = useState(false);
  const mood = moodOf(plant);
  const q = new URLSearchParams(window.location.search).get("plant");
  const friday = q === "friday" || new Date().getDay() === 5;
  const m = MOOD[mood];

  function water() {
    const next = { watered: Date.now(), count: (plant?.count ?? 0) + 1 };
    savePlant(next);
    setPlant(next);
    setBurst((b) => b + 1);
    setThanks(true);
    setTimeout(() => setThanks(false), 2400);
  }

  const line = thanks ? "Thank you!" : friday && !["thirsty", "droopy"].includes(mood) ? "Fredag! 🎉" : m.line;

  return (
    <motion.div
      className="relative rounded-[22px] backdrop-blur-2xl backdrop-saturate-150 overflow-hidden"
      style={{
        width: W,
        height: W,
        background: isDark ? "linear-gradient(170deg, rgba(60,90,70,0.6), rgba(30,40,34,0.6))" : "linear-gradient(170deg, rgba(232,248,232,0.85), rgba(205,236,214,0.8))",
        boxShadow: glass(isDark).boxShadow,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 24 }}
      aria-label={`Lagom the plant: ${line}`}
    >
      {/* header: name + water meter */}
      <div className="absolute left-3 right-3 top-2.5 flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${isDark ? "text-[#b9e8c4]" : "text-[#3a8a55]"}`}>Lagom</span>
        <span className="flex gap-[2px]" aria-label={`Water level ${thanks ? 3 : m.drops} of 3`}>
          {[0, 1, 2].map((k) => (
            <Drop key={k} full={thanks || k < m.drops} isDark={isDark} />
          ))}
        </span>
      </div>

      {/* plant */}
      <motion.div
        className="absolute left-1/2 top-[16px] -ml-[48px]"
        animate={thanks ? { y: [0, -8, 0, -4, 0], rotate: [0, -4, 4, 0] } : { y: [0, -1.5, 0] }}
        transition={thanks ? { duration: 0.7 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <PlantArt mood={thanks ? "happy" : mood} partyHat={friday} sparkle={thanks || mood === "happy"} />
        <AnimatePresence>
          {thanks &&
            [0, 1, 2, 3].map((k) => (
              <motion.span
                key={`${burst}-${k}`}
                className="absolute top-[6px]"
                style={{ left: 22 + k * 15 }}
                initial={{ y: -14, opacity: 0 }}
                animate={{ y: 34, opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, delay: k * 0.09 }}
              >
                <Drop full isDark={isDark} />
              </motion.span>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* footer: mood + water button */}
      <div className="absolute left-3 right-3 bottom-2.5 flex items-center justify-between gap-1">
        <span className={`text-[11px] font-semibold leading-tight truncate ${text}`}>{line}</span>
        <motion.button
          type="button"
          onClick={water}
          whileTap={{ scale: 0.9 }}
          className="shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] bg-[#4aa8ff] shadow-[0_3px_8px_-3px_rgba(74,168,255,0.9)] hover:brightness-110"
          aria-label="Water Lagom"
          title={plant?.count ? `Water Lagom (watered ${plant.count}× by you)` : "Water Lagom"}
        >
          💧
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ======================= coffee mug ======================= */
function MugArt({ level, steaming }) {
  // 3/4 view: we look into the cup, so the coffee surface sinks as it empties
  const surfaceY = 35 + (1 - level) * 15; // seen through the rim, the surface slides down and away
  const surfaceRx = 24 - (1 - level) * 4;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="mug-body" x1="0" x2="1">
          <stop offset="0" stopColor="#fffaf3" />
          <stop offset="0.6" stopColor="#f6e8d8" />
          <stop offset="1" stopColor="#e7d0b8" />
        </linearGradient>
        <linearGradient id="mug-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9c3ab" />
          <stop offset="1" stopColor="#bfa58a" />
        </linearGradient>
        <radialGradient id="coffee" cx="40%" cy="40%" r="70%">
          <stop offset="0" stopColor="#9a6040" />
          <stop offset="1" stopColor="#5b3420" />
        </radialGradient>
        <clipPath id="mug-mouth">
          <ellipse cx="46" cy="34" rx="26" ry="9" />
        </clipPath>
      </defs>

      <ellipse cx="48" cy="93" rx="30" ry="5" fill="rgba(0,0,0,0.18)" />

      {/* handle */}
      <path d="M71 46 C 88 44 90 70 70 72" stroke="#ecd7c0" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M71 46 C 88 44 90 70 70 72" stroke="#fffaf3" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* body */}
      <path d="M20 34 V78 Q20 90 34 90 H58 Q72 90 72 78 V34 Z" fill="url(#mug-body)" />

      {/* looking into the cup: inside wall, then the coffee surface sinking as it empties */}
      <ellipse cx="46" cy="34" rx="26" ry="9" fill="url(#mug-in)" />
      {level > 0 && (
        <g clipPath="url(#mug-mouth)">
          <motion.ellipse cx="46" ry="8" fill="url(#coffee)" initial={false} animate={{ cy: surfaceY, rx: surfaceRx }} transition={{ duration: 0.8 }} />
          {level > 0.45 && <motion.path d="M46 0 c-2.5 -3.5 -8 -1 -5.5 2.5 l5.5 3.8 5.5 -3.8 c2.5 -3.5 -3 -6 -5.5 -2.5z" fill="#f3dcc0" opacity="0.9" initial={false} animate={{ y: surfaceY - 1 }} transition={{ duration: 0.8 }} />}
        </g>
      )}
      <ellipse cx="46" cy="34" rx="26" ry="9" fill="none" stroke="#fffaf3" strokeWidth="3" />

      {/* shine */}
      <path d="M27 44 V76" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" />

      {/* face */}
      <g transform="translate(46 64)">
        {level === 0 ? (
          <>
            <path d="M-11 -2 q3 -3 6 0 M5 -2 q3 -3 6 0" stroke="#4a2a20" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M-3 7 q3 -3 6 0" stroke="#4a2a20" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="-8" cy="-1" rx="2.4" ry="3" fill="#3b2219" />
            <ellipse cx="8" cy="-1" rx="2.4" ry="3" fill="#3b2219" />
            <circle cx="-7" cy="-2.2" r="0.8" fill="#fff" />
            <circle cx="9" cy="-2.2" r="0.8" fill="#fff" />
            <path d="M-3.5 4 q3.5 4 7 0" stroke="#4a2a20" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        )}
        <ellipse cx="-14" cy="5" rx="4" ry="2.4" fill="#ff7f9a" opacity="0.5" />
        <ellipse cx="14" cy="5" rx="4" ry="2.4" fill="#ff7f9a" opacity="0.5" />
      </g>

      {/* steam */}
      {steaming &&
        [36, 48, 60].map((x, i) => (
          <motion.path
            key={x}
            d={`M${x} 22 c -5 -6 5 -9 0 -16`}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0, 0.9, 0], y: [6, -2, -10] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
    </svg>
  );
}

function Mug({ notify }) {
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

  return (
    <motion.button
      type="button"
      onClick={refill}
      className="self-end w-[78px] h-[78px] -mb-1"
      initial={{ opacity: 0, y: 10 }}
      animate={empty ? { opacity: 1, y: 0, rotate: [0, -7, 7, -4, 0] } : { opacity: 1, y: 0, rotate: 0 }}
      transition={empty ? { rotate: { duration: 0.6, repeat: Infinity, repeatDelay: 6 } } : { delay: 0.7 }}
      whileHover={{ scale: 1.08, rotate: -4 }}
      whileTap={{ scale: 0.92 }}
      aria-label={empty ? "Empty coffee mug. Click to refill." : `Coffee mug, ${Math.round(level * 100)}% full. Click to refill.`}
      title={empty ? "Empty. Refill?" : `${Math.round(level * 100)}% coffee left`}
    >
      <MugArt level={level} steaming={level > 0.25} />
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
    const NATURAL_H = 290; // Lately + plant row
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
      <Lately isDark={isDark} text={text} sub={sub} />
      <div className="flex items-end gap-4">
        <Plant isDark={isDark} text={text} />
        <Mug notify={notify} />
      </div>
    </div>
  );
}
