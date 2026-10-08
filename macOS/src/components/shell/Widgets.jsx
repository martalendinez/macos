// src/components/shell/Widgets.jsx
// macOS Sonoma-style desktop widgets. Each one is a shortcut into an app.
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MENU_BAR_H } from "../../config/shell";
import { ACHIEVEMENTS } from "../../config/achievements";
import { ACCENTS } from "../../config/accents";
import { PROFILE } from "../windows/About/aboutData";
import { placeDetails } from "../windows/Map/data/placesData";
import { simulate } from "../windows/FundSim/fundModel";
import avatar from "../../imgs/avatar/profile-photo.jpg";

const SMALL = 150;
const GAP = 12;
const TZ = "Europe/Stockholm";

function describe(code, isDay) {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "🌤️" : "☁️";
  if (code === 3 || code === 45 || code === 48) return "☁️";
  if (code >= 71 && code <= 86 && !(code >= 80 && code <= 82)) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌧️";
}

function Widget({ children, onClick, wide = false, i = 0, isDark, className = "", style, label }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      aria-label={label}
      className={`relative overflow-hidden text-left rounded-[22px] backdrop-blur-2xl backdrop-saturate-150 ${className}`}
      style={{
        width: wide ? SMALL * 2 + GAP : SMALL,
        gridColumn: wide ? "span 2" : undefined,
        height: SMALL,
        background: isDark ? "rgba(30,30,32,0.55)" : "rgba(255,255,255,0.55)",
        boxShadow: isDark
          ? "0 0 0 0.5px rgba(255,255,255,0.12) inset, 0 12px 30px -12px rgba(0,0,0,0.6)"
          : "0 0 0 0.5px rgba(255,255,255,0.6) inset, 0 12px 30px -12px rgba(0,0,0,0.25)",
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.35 + i * 0.07, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.div>
  );
}

function useStockholmWeather() {
  const [w, setW] = useState(null);
  useEffect(() => {
    let off = false;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=59.33&longitude=18.07&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => !off && setW(j))
      .catch(() => !off && setW("error"));
    return () => {
      off = true;
    };
  }, []);
  return w;
}

function MiniJCurve({ isDark }) {
  const r = useMemo(() => simulate("pe", "base", 10), []);
  const ys = r.years.map((y) => y.cumulative);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const W = 118;
  const H = 48;
  const pts = ys.map((v, i) => [(i / (ys.length - 1)) * W, H - ((v - min) / (max - min)) * H]);
  const zeroY = H - ((0 - min) / (max - min)) * H;
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[48px] overflow-visible" aria-hidden="true">
      <line x1="0" x2={W} y1={zeroY} y2={zeroY} stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"} strokeDasharray="3 3" />
      <motion.path d={d} fill="none" stroke={isDark ? "#3987e5" : "#2a78d6"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.4, ease: "easeInOut" }} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill={isDark ? "#3987e5" : "#2a78d6"} />
    </svg>
  );
}

export default function Widgets({ loaded, theme = "light", onOpenWindow, unlocked = {}, accent }) {
  const isDark = theme === "dark";
  const text = isDark ? "text-white" : "text-[#1d1d1f]";
  const sub = isDark ? "text-white/60" : "text-black/55";
  const weather = useStockholmWeather();
  const [now, setNow] = useState(() => new Date());
  const places = useMemo(() => Object.values(placeDetails).flatMap((p) => p.photos.slice(0, 2).map((src) => ({ src, label: p.label.split(",")[0] }))), []);
  const [photo, setPhoto] = useState(0);
  const fund = useMemo(() => simulate("pe", "base", 10), []);

  useEffect(() => {
    const a = setInterval(() => setNow(new Date()), 15_000);
    const b = setInterval(() => setPhoto((i) => (i + 1) % places.length), 6000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [places.length]);

  const got = ACHIEVEMENTS.filter((a) => unlocked[a.key]).length;
  const next = ACHIEVEMENTS.find((a) => !unlocked[a.key] && !a.secret);
  const pct = got / ACHIEVEMENTS.length;
  const C = 2 * Math.PI * 30;
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ, hour12: false });
  const day = now.toLocaleDateString("en-GB", { weekday: "long", timeZone: TZ });

  // fit the column between the menu bar and the Dock: scale down on shorter screens instead of hiding
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const NATURAL_H = SMALL * 4 + GAP * 3; // 4 rows
    const fit = () => setScale(Math.min(1, (window.innerHeight - MENU_BAR_H - 16 - 96) / NATURAL_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  if (!loaded || scale < 0.6) return null;

  return (
    <div
      // large screens only (phones/tablets keep the desktop clear)
      className="fixed right-4 z-30 hidden lg:grid gap-3 origin-top-right"
      style={{ top: MENU_BAR_H + 16, gridTemplateColumns: `repeat(2, ${SMALL}px)`, transform: scale < 1 ? `scale(${scale})` : undefined }}
      aria-label="Desktop widgets"
    >
      {/* ROYC / now — wide */}
      <Widget wide i={0} isDark={isDark} onClick={() => onOpenWindow?.("about")} label="Marta's current role">
        <div className="absolute inset-0 opacity-90" style={{ background: "radial-gradient(120% 120% at 100% 0%, rgba(94,92,230,0.35), transparent 55%)" }} />
        <div className="relative h-full p-4 flex flex-col">
          <div className="flex items-center gap-2.5">
            <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/60" />
            <div className="min-w-0">
              <div className={`text-[13px] font-semibold leading-tight ${text}`}>{PROFILE.name}</div>
              <div className={`text-[11px] leading-tight ${sub}`}>
                {PROFILE.role} @ {PROFILE.company.name}
              </div>
            </div>
          </div>
          <div className={`mt-2.5 text-[12px] leading-snug ${text}`}>Designing the operating system for <b>private markets</b> 💳</div>
          <div className="flex-1" />
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${sub}`}>Fintech · B2B SaaS</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenWindow?.("facetime");
              }}
              className="px-2.5 py-1 rounded-full bg-[#30d158] text-white text-[11px] font-semibold hover:brightness-110"
            >
              📞 Book a call
            </button>
          </div>
        </div>
      </Widget>

      {/* Clock + weather */}
      <Widget i={1} isDark={isDark} onClick={() => onOpenWindow?.("weather")} label="Stockholm time and weather">
        <div className="h-full p-4 flex flex-col">
          <div className={`text-[11px] font-semibold ${sub}`}>Stockholm</div>
          <div className={`text-[38px] font-light leading-none tracking-[-0.02em] tabular-nums mt-1 ${text}`}>{time}</div>
          <div className={`text-[11px] ${sub}`}>{day}</div>
          <div className="flex-1" />
          <div className={`flex items-center gap-1.5 text-[13px] font-medium ${text}`}>
            {weather === "error" ? (
              <span className={`text-[11px] font-normal ${sub}`}>Weather unavailable</span>
            ) : weather ? (
              <>
                <span className="text-[18px]">{describe(weather.current.weather_code, weather.current.is_day)}</span>
                {Math.round(weather.current.temperature_2m)}°
                <span className={`text-[11px] font-normal ${sub}`}>
                  H:{Math.round(weather.daily.temperature_2m_max[0])}° L:{Math.round(weather.daily.temperature_2m_min[0])}°
                </span>
              </>
            ) : (
              <span className={sub}>…</span>
            )}
          </div>
        </div>
      </Widget>

      {/* Fund snapshot */}
      <Widget i={2} isDark={isDark} onClick={() => onOpenWindow?.("fundsim")} label="Fund Simulator snapshot">
        <div className="h-full p-4 flex flex-col">
          <div className="flex items-center gap-1.5">
            <img src="/icons/apps/fundsim.svg" alt="" className="w-5 h-5" />
            <span className={`text-[11px] font-semibold ${sub}`}>Fund snapshot</span>
          </div>
          <div className="mt-2">
            <MiniJCurve isDark={isDark} />
          </div>
          <div className="flex-1" />
          <div className={`text-[13px] font-semibold tabular-nums ${text}`}>
            {(fund.irr * 100).toFixed(0)}% IRR · {fund.tvpi.toFixed(2)}x
          </div>
          <div className={`text-[10px] ${sub}`}>PE buyout · the J-curve</div>
        </div>
      </Widget>

      {/* Places photo */}
      <Widget i={3} isDark={isDark} onClick={() => onOpenWindow?.("instagram")} label="Photos from places Marta has lived">
        {places.map((p, idx) => (
          <motion.img
            key={p.src}
            src={p.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: idx === photo ? 1 : 0, scale: idx === photo ? 1.06 : 1 }}
            transition={{ opacity: { duration: 0.8 }, scale: { duration: 6, ease: "linear" } }}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 bottom-2.5 text-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/75">Memories</div>
          <div className="text-[13px] font-semibold">📍 {places[photo]?.label}</div>
        </div>
      </Widget>

      {/* Design system */}
      <Widget i={4} isDark={isDark} onClick={() => onOpenWindow?.("designsystem")} label="Design System">
        <div className="h-full p-4 flex flex-col">
          <div className="flex items-center gap-1.5">
            <img src="/icons/apps/designsystem.svg" alt="" className="w-5 h-5" />
            <span className={`text-[11px] font-semibold ${sub}`}>Design System</span>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1.5">
            {Object.entries(ACCENTS).map(([k, v]) => (
              <span key={k} className={`aspect-square rounded-full ${accent === k ? "ring-2 ring-offset-2 ring-[hsl(var(--accent))]" : ""}`} style={{ background: `hsl(${v})`, "--tw-ring-offset-color": "transparent" }} />
            ))}
          </div>
          <div className="flex-1" />
          <div className={`text-[22px] font-bold leading-none tracking-[-0.02em] ${text}`}>Aa</div>
          <div className={`mt-1 text-[10px] ${sub}`}>Tokens · components · motion</div>
        </div>
      </Widget>

      {/* Figma */}
      <Widget i={5} isDark={isDark} onClick={() => onOpenWindow?.("figma")} label="Open Figma" style={{ background: "#1e1e1e" }}>
        <div className="h-full p-3.5 flex flex-col text-white">
          <div className="flex items-center gap-1.5">
            <img src="/icons/apps/figma.svg" alt="" className="w-5 h-5" />
            <span className="text-[11px] font-semibold text-white/70">Figma</span>
          </div>
          {/* mini canvas */}
          <div className="relative mt-2 flex-1 rounded-lg bg-[#2c2c2c] overflow-hidden">
            <div className="absolute left-2 top-2 text-[8px] text-[#c7a6ff]">❖ Button</div>
            {[15, 32, 49].map((top, k) => (
              <div
                key={top}
                className={`absolute left-2 px-1.5 py-0.5 rounded-[5px] text-[8px] leading-[11px] font-semibold ${k ? "ring-1 ring-[#c7a6ff]/60" : ""}`}
                style={{ top, background: "#9747ff" }}
              >
                {k ? "◈ " : ""}Invest now
              </div>
            ))}
            <div className="absolute right-2 top-3 w-9 h-12 rounded-md bg-white/90" />
            <motion.div className="absolute" animate={{ left: ["62%", "30%", "70%", "62%"], top: ["60%", "30%", "20%", "60%"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <svg viewBox="0 0 16 16" className="w-3 h-3" aria-hidden="true">
                <path d="M2 1.5l11 6.2-4.7 1.2-2 4.6z" fill="#ff375f" stroke="#fff" strokeWidth="1" />
              </svg>
              <span className="ml-2 -mt-0.5 inline-block px-1 rounded bg-[#ff375f] text-[7px] font-bold">Marta</span>
            </motion.div>
          </div>
          <div className="mt-1.5 text-[10px] text-white/60 truncate">Live components ❖</div>
        </div>
      </Widget>

      {/* Achievements */}
      <Widget i={6} isDark={isDark} onClick={() => onOpenWindow?.("achievements")} label="Achievements progress">
        <div className="h-full p-3.5 flex flex-col items-center justify-center text-center">
          <div className="relative w-[70px] h-[70px]">
            <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90">
              <circle cx="38" cy="38" r="30" fill="none" stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"} strokeWidth="8" />
              <motion.circle cx="38" cy="38" r="30" fill="none" stroke="#ff9f0a" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} initial={false} animate={{ strokeDashoffset: C * (1 - pct) }} transition={{ duration: 0.8 }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[22px]">🏆</div>
          </div>
          <div className={`mt-1.5 text-[13px] font-semibold tabular-nums ${text}`}>
            {got}/{ACHIEVEMENTS.length}
          </div>
          <div className={`text-[10px] leading-tight line-clamp-2 ${sub}`}>{next ? `Next: ${next.hint}` : "All unlocked 👑"}</div>
        </div>
      </Widget>
    </div>
  );
}
