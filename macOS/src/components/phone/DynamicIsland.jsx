// src/components/phone/DynamicIsland.jsx
// The iPhone Dynamic Island: a black pill under the status bar that grows into a live activity
// (music playing) or a short alert (achievements, AirDrop). Fed by config/island.js events.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 420, damping: 32 };

function Bars() {
  return (
    <span className="flex items-end gap-[2px] h-3.5" aria-hidden="true">
      {[0, 1, 2, 3].map((k) => (
        <motion.span
          key={k}
          className="w-[3px] rounded-full bg-[#1ed760]"
          animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: k * 0.12 }}
        />
      ))}
    </span>
  );
}

export default function DynamicIsland() {
  const [alert, setAlert] = useState(null);
  const [music, setMusic] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const onAlert = (e) => {
      clearTimeout(timer.current);
      setAlert({ ...e.detail, id: Date.now() });
      timer.current = setTimeout(() => setAlert(null), 3200);
    };
    const onMusic = (e) => setMusic(e.detail?.playing ? e.detail : null);
    window.addEventListener("portfolio:island", onAlert);
    window.addEventListener("portfolio:nowplaying", onMusic);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("portfolio:island", onAlert);
      window.removeEventListener("portfolio:nowplaying", onMusic);
    };
  }, []);

  // size: idle pill, compact live activity (music), or expanded alert
  const size = alert ? { width: 352, height: 68, borderRadius: 34 } : music ? { width: 200, height: 34, borderRadius: 17 } : { width: 122, height: 34, borderRadius: 17 };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-[8px] z-[8600] -translate-x-1/2 bg-black text-white overflow-hidden shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)]"
      // a soft ring in the accent colour while an alert is showing
      style={{ boxShadow: alert ? "0 0 0 1px hsl(var(--accent) / 0.55), 0 8px 26px -6px hsl(var(--accent) / 0.55)" : undefined }}
      initial={false}
      animate={size}
      transition={SPRING}
      onClick={() => alert && setAlert(null)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {alert ? (
          <motion.div key={alert.id} className="absolute inset-0 flex items-center gap-3 px-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.08 }}>
            {alert.avatar ? (
              <img src={alert.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <img src={alert.icon} alt="" className="w-10 h-10 rounded-[11px]" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold text-[hsl(var(--accent))]">{alert.kind === "achievement" ? "Achievement unlocked" : alert.title}</span>
              <span className="block text-[15px] font-semibold leading-tight truncate">{alert.kind === "achievement" ? alert.title : alert.sub}</span>
            </span>
            {alert.kind === "achievement" && <span className="text-[22px]">🏆</span>}
            {alert.kind === "airdrop" && (
              <svg viewBox="0 0 16 16" className="w-6 h-6 text-[hsl(var(--accent))]" fill="none" aria-hidden="true">
                <path d="M3.2 11.8a6.3 6.3 0 1 1 9.6 0M5.4 10.1a3.5 3.5 0 1 1 5.2 0M8 8.2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </motion.div>
        ) : music ? (
          <motion.div key="music" className="absolute inset-0 flex items-center justify-between px-[7px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
            <img src={music.cover} alt="" className="w-[22px] h-[22px] rounded-[6px] object-cover" />
            <span className="sr-only">
              Now playing {music.title} by {music.artist}
            </span>
            <span className="pr-1.5">
              <Bars />
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
