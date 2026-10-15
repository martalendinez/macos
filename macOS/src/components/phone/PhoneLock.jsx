// src/components/phone/PhoneLock.jsx
// iPhone lock screen, shown once per visit on phones: wallpaper, date, big clock,
// a notification from Marta, and "Swipe up to open". Drag up (or tap the hint) to unlock.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import avatar from "../../imgs/avatar/profile-photo.jpg";

// ✏️ The lock screen notifications, newest first. `app` icons come from public/icons/apps.
const NOTES = [
  { icon: avatar, round: true, app: "Messages", title: "Marta Lendínez", body: "Hej! 👋 Thanks for stopping by. Swipe up, my work is waiting.", time: "now" },
  { icon: "/icons/apps/github.svg", app: "GitHub", title: "Pull request ready for review", body: "macos #42 · Phone home screen, Dynamic Island & lock screen", time: "4m ago" },
  { icon: "/icons/apps/achievements.svg", app: "Achievements", title: "3 trophies waiting", body: "Open a case study to unlock Deep Diver 🏆", time: "12m ago" },
  { icon: "/icons/apps/claude.svg", app: "Claude", title: "Session summary", body: "We shipped 4 Apple details today. Fika earned ☕", time: "1h ago" },
];

const SEEN = "portfolio.phoneLock.seen";

function seenThisVisit() {
  try {
    return sessionStorage.getItem(SEEN) === "1";
  } catch {
    return false;
  }
}

function Note({ n, compact }) {
  return (
    <div className="rounded-[22px] p-3 flex items-start gap-3 bg-white/25 backdrop-blur-2xl shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.4)] text-left">
      <img src={n.icon} alt="" className={`shrink-0 w-[38px] h-[38px] object-cover ${n.round ? "rounded-full" : "rounded-[9px]"}`} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[14px] font-semibold truncate">{n.title}</span>
          <span className="shrink-0 text-[12px] opacity-70">{n.time}</span>
        </span>
        <span className={`block text-[13.5px] leading-snug opacity-95 ${compact ? "truncate" : ""}`}>{n.body}</span>
      </span>
    </div>
  );
}

/** iOS-style notification stack: the newest on top, the rest peeking behind it; tap to fan them out. */
function LockNotifications() {
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // older notifications are already there; the newer ones arrive on top, the newest last
    const ids = NOTES.slice(1).map((_, i) => setTimeout(() => setCount((c) => Math.max(c, i + 2)), 900 + i * 900));
    return () => ids.forEach(clearTimeout);
  }, []);
  const shown = NOTES.slice(NOTES.length - count); // newest first

  return (
    <div className="mt-auto mb-5 mx-3 self-stretch" onPointerDown={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="text-[17px] font-semibold [text-shadow:0_1px_4px_rgba(0,0,0,0.25)]">Notification Centre</span>
        {count > 1 && (
          <button type="button" onClick={() => setOpen((o) => !o)} className="px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-xl text-[12.5px] font-semibold">
            {open ? "Show less" : `${count} notifications`}
          </button>
        )}
      </div>

      {open ? (
        <div className="max-h-[42vh] overflow-y-auto flex flex-col gap-2 [scrollbar-width:none]">
          {shown.map((n, i) => (
            <motion.div key={n.title} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, type: "spring", stiffness: 380, damping: 30 }}>
              <Note n={n} />
            </motion.div>
          ))}
        </div>
      ) : (
        <button type="button" onClick={() => count > 1 && setOpen(true)} className="relative block w-full" aria-label={`${count} notifications, tap to expand`}>
          {/* cards peeking behind the newest one */}
          {shown.slice(1, 3).map((n, i) => (
            <motion.span
              key={n.title}
              className="absolute inset-x-0 bottom-0 h-full rounded-[22px] bg-white/20 backdrop-blur-2xl"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1 - i * 0.3, y: 8 * (i + 1), scaleX: 1 - 0.05 * (i + 1) }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              style={{ zIndex: 2 - i }}
            />
          ))}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={shown[0].title}
              className="relative z-10"
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: count === 1 ? 0.6 : 0 }}
            >
              <Note n={shown[0]} compact />
            </motion.div>
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}

export default function PhoneLock({ wallpaperUrl, loaded }) {
  const [open, setOpen] = useState(() => !seenThisVisit());
  const [now, setNow] = useState(() => new Date());
  const y = useMotionValue(0);
  const fade = useTransform(y, [-260, 0], [0, 1]);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, [open]);

  function unlock() {
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      /* storage blocked: it just shows again next time */
    }
    navigator.vibrate?.(8);
    setOpen(false);
  }

  const date = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <AnimatePresence>
      {open && loaded && (
        <motion.div
          className="fixed inset-0 z-[9900] overflow-hidden text-white select-none touch-none"
          style={{ y, backgroundImage: `url(${wallpaperUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.9, bottom: 0.05 }}
          onDragEnd={(_, info) => (info.offset.y < -110 || info.velocity.y < -500 ? unlock() : null)}
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { type: "spring", stiffness: 260, damping: 32 } }}
          role="dialog"
          aria-label="Lock screen"
        >
          <div className="absolute inset-0 bg-black/15" />
          <motion.div className="relative h-full flex flex-col items-center" style={{ opacity: fade }}>
            {/* lock */}
            <svg viewBox="0 0 20 20" className="mt-[58px] w-5 h-5 opacity-90" fill="currentColor" aria-hidden="true">
              <path d="M6 8V6a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 16 9.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 16.5v-7A1.5 1.5 0 0 1 5.5 8zm1.8 0h4.4V6a2.2 2.2 0 1 0-4.4 0z" />
            </svg>
            <div className="mt-3 text-[19px] font-semibold [text-shadow:0_1px_6px_rgba(0,0,0,0.25)]">{date}</div>
            <div className="-mt-1 text-[92px] font-semibold leading-none tracking-[-0.04em] tabular-nums [text-shadow:0_2px_12px_rgba(0,0,0,0.2)]" style={{ fontFeatureSettings: '"ss01"' }}>
              {time}
            </div>

            {/* notifications waiting on the lock screen: they arrive one by one, older ones stack up */}
            <LockNotifications />

            {/* bottom: flashlight + camera, the hint and the home bar */}
            <div className="mb-3 w-full px-12 flex items-center justify-between">
              {["M8 2h4l-1 6h3l-6 10 1-7H6z", "M3 7h3l1.5-2h5L14 7h3v9H3zM10 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"].map((d) => (
                <span key={d} className="w-[50px] h-[50px] rounded-full bg-black/25 backdrop-blur-xl flex items-center justify-center" aria-hidden="true">
                  <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
                    <path d={d} />
                  </svg>
                </span>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={unlock}
              className="mb-2 text-[14px] font-medium opacity-90 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              Swipe up to open
            </motion.button>
            <span className="mb-2 w-[134px] h-[5px] rounded-full bg-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
