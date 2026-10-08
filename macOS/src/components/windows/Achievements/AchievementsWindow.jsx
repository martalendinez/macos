// src/components/windows/Achievements/AchievementsWindow.jsx
// Trophy room (Game Center style): progress ring + every achievement, locked or unlocked.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { ACHIEVEMENTS } from "../../../config/achievements";

const EASE = [0.22, 1, 0.36, 1];

function ProgressRing({ value, total, isDark }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <div className="relative w-[132px] h-[132px] shrink-0">
      <svg viewBox="0 0 132 132" className="w-full h-full -rotate-90">
        <circle cx="66" cy="66" r={r} fill="none" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"} strokeWidth="12" />
        <motion.circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          stroke="url(#achGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <defs>
          <linearGradient id="achGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd60a" />
            <stop offset="0.5" stopColor="#ff9f0a" />
            <stop offset="1" stopColor="#ff375f" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-[30px] font-bold tabular-nums leading-none ${isDark ? "text-white" : "text-[#1d1d1f]"}`}>{value}</div>
        <div className={`text-[11px] ${isDark ? "text-white/50" : "text-black/45"}`}>of {total}</div>
      </div>
    </div>
  );
}

function when(v) {
  if (v === true) return "Unlocked earlier";
  const d = new Date(v);
  const today = new Date().toDateString() === d.toDateString();
  return today ? `Today, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function AchievementsWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light", unlockedAchievements = {}, resetAchievements }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const [filter, setFilter] = useState("all");
  const [confirmReset, setConfirmReset] = useState(false);

  const got = ACHIEVEMENTS.filter((a) => unlockedAchievements[a.key]);
  const list = ACHIEVEMENTS.filter((a) => (filter === "all" ? true : filter === "got" ? unlockedAchievements[a.key] : !unlockedAchievements[a.key]));
  const next = ACHIEVEMENTS.find((a) => !unlockedAchievements[a.key] && !a.secret);
  const pct = Math.round((got.length / ACHIEVEMENTS.length) * 100);
  const rank = pct === 100 ? "Legend 👑" : pct >= 70 ? "Power user ⚡" : pct >= 40 ? "Explorer 🧭" : pct > 0 ? "Rookie 🌱" : "Just arrived 👋";

  return (
    <div className={`no-darkwin h-full overflow-y-auto ${t.windowBg}`}>
      {/* hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: t.isDark
            ? "radial-gradient(120% 140% at 85% 0%, rgba(255,159,10,0.28), transparent 55%), radial-gradient(90% 120% at 0% 100%, rgba(255,55,95,0.2), transparent 60%), #1a1a1c"
            : "radial-gradient(120% 140% at 85% 0%, rgba(255,214,10,0.35), transparent 55%), radial-gradient(90% 120% at 0% 100%, rgba(255,55,95,0.16), transparent 60%), #fbfaf7",
        }}
      >
        <div className="max-w-[900px] mx-auto px-5 @lg:px-8 py-7 flex flex-col @lg:flex-row items-center gap-6">
          <ProgressRing value={got.length} total={ACHIEVEMENTS.length} isDark={t.isDark} />
          <div className="text-center @lg:text-left">
            <div className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${t.textSub}`}>Trophy room</div>
            <h1 className={`text-[30px] font-bold tracking-[-0.03em] leading-tight ${t.textMain}`}>Achievements</h1>
            <div className={`mt-1 text-[14px] ${t.textBody}`}>
              Rank: <b className={t.textMain}>{rank}</b> · {pct}% complete
            </div>
            {next && (
              <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] ${t.isDark ? "bg-white/10" : "bg-white/80 ring-1 ring-black/5"}`}>
                <span>🎯 Next up:</span>
                <span className={`font-semibold ${t.textMain}`}>{next.hint}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-5 @lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`flex rounded-[8px] p-0.5 text-[12px] font-medium ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            {[
              ["all", `All ${ACHIEVEMENTS.length}`],
              ["got", `Unlocked ${got.length}`],
              ["locked", `Locked ${ACHIEVEMENTS.length - got.length}`],
            ].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} className={`relative px-3 py-1 rounded-[6px] ${filter === k ? t.textMain : t.textSub}`}>
                {filter === k && <motion.span layoutId="ach-seg" className={`absolute inset-0 rounded-[6px] ${t.isDark ? "bg-white/20" : "bg-white shadow-sm"}`} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
          {got.length > 0 &&
            (confirmReset ? (
              <span className={`text-[12px] ${t.textSub}`}>
                Reset all progress?{" "}
                <button
                  onClick={() => {
                    resetAchievements?.();
                    setConfirmReset(false);
                  }}
                  className="font-semibold text-[#ff453a] hover:underline"
                >
                  Reset
                </button>{" "}
                ·{" "}
                <button onClick={() => setConfirmReset(false)} className={`font-semibold hover:underline ${t.textMain}`}>
                  Cancel
                </button>
              </span>
            ) : (
              <button onClick={() => setConfirmReset(true)} className={`text-[12px] hover:underline ${t.textSub}`}>
                Reset progress
              </button>
            ))}
        </div>

        <motion.div layout className="mt-5 grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {list.map((a, i) => {
              const on = unlockedAchievements[a.key];
              const hidden = a.secret && !on;
              return (
                <motion.div
                  layout
                  key={a.key}
                  className={`relative overflow-hidden rounded-2xl p-4 flex items-center gap-3.5 ${t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.07]" : "bg-white ring-1 ring-black/[0.06]"}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.02, ease: EASE }}
                >
                  {on && <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ background: `radial-gradient(circle at 15% 50%, ${a.tint}, transparent 60%)` }} />}
                  <div
                    className={`relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-[26px] ${on ? "" : "grayscale opacity-50"}`}
                    style={{
                      background: on ? `linear-gradient(135deg, ${a.tint}, ${a.tint}aa)` : t.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                      boxShadow: on ? `0 6px 16px -6px ${a.tint}` : "none",
                    }}
                  >
                    {hidden ? "?" : a.icon}
                    {!on && (
                      <span className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${t.isDark ? "bg-[#3a3a3c]" : "bg-[#e5e5ea]"}`}>
                        🔒
                      </span>
                    )}
                  </div>
                  <div className="relative min-w-0">
                    <div className={`text-[14px] font-semibold truncate ${on ? t.textMain : t.textSub}`}>{hidden ? "Secret achievement" : a.title}</div>
                    <div className={`text-[12px] leading-snug ${t.textSub}`}>{a.hint}</div>
                    {on && <div className="mt-1 text-[11px] font-medium" style={{ color: a.tint === "#1c1c1e" ? undefined : a.tint }}>✓ {when(on)}</div>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <div className={`py-12 text-center text-[14px] ${t.textSub}`}>{filter === "got" ? "Nothing yet. Go explore! 🧭" : "You've unlocked everything. Legend 👑"}</div>}
      </div>
    </div>
  );
}
