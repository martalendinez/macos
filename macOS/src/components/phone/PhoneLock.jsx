// src/components/phone/PhoneLock.jsx
// iPhone lock screen, shown once per visit on phones: wallpaper, date, big clock,
// a notification from Marta, and "Swipe up to open". Drag up (or tap the hint) to unlock.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import avatar from "../../imgs/avatar/profile-photo.jpg";


const SEEN = "portfolio.phoneLock.seen";

function seenThisVisit() {
  try {
    return sessionStorage.getItem(SEEN) === "1";
  } catch {
    return false;
  }
}

/** One iMessage notification, like a real iPhone lock screen: Messages icon with the sender's photo, name, preview, time. */
function MessageNotification() {
  return (
    <motion.div
      className="mt-auto mb-5 mx-3 self-stretch rounded-[22px] px-3.5 py-3 flex items-center gap-3 bg-white/30 backdrop-blur-2xl shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.45)]"
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.9, type: "spring", stiffness: 280, damping: 24 }}
      aria-label="Message from Marta Lendínez"
    >
      {/* sender photo with the Messages app badge in the corner, like iOS communication notifications */}
      <span className="relative shrink-0 w-[42px] h-[42px]">
        <img src={avatar} alt="" className="w-[42px] h-[42px] rounded-full object-cover" />
        <img src="/icons/apps/messages.svg" alt="" className="absolute -right-1 -bottom-1 w-[18px] h-[18px] rounded-[5px] ring-2 ring-white/30" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[15px] font-semibold truncate">Marta Lendínez</span>
          <span className="shrink-0 text-[13px] opacity-70">now</span>
        </span>
        <span className="block text-[15px] leading-snug opacity-95">Hej! 👋 Thanks for stopping by. Swipe up, my work is waiting ✨</span>
      </span>
    </motion.div>
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

            {/* a message from me, waiting on the lock screen */}
            <MessageNotification />

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
