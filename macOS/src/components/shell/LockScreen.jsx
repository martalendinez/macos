// src/components/shell/LockScreen.jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import avatar from "../../imgs/avatar/Avatar1.jpg";

function useNow(open) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!open) return;
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [open]);
  return now;
}

export default function LockScreen({ open, onUnlock, wallpaperUrl, timeZone = "Europe/Stockholm", name = "Marta Lendinez" }) {
  const now = useNow(open);

  useEffect(() => {
    if (!open) return;
    const onKey = () => onUnlock?.();
    // ignore the click/keypress that opened it
    const t = setTimeout(() => window.addEventListener("keydown", onKey), 300);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onUnlock]);

  const date = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[20000] overflow-hidden text-white select-none cursor-pointer"
          onClick={onUnlock}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Lock screen. Click or press any key to unlock."
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wallpaperUrl})`, filter: "blur(28px) saturate(1.2)", transform: "scale(1.15)" }}
          />
          <div className="absolute inset-0 bg-black/20" />

          <motion.div
            className="relative flex flex-col items-center pt-[9vh]"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.25)" }}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-[22px] font-semibold opacity-90">{date}</div>
            <div className="text-[clamp(84px,13vw,148px)] font-semibold leading-none tracking-[-0.03em] tabular-nums mt-1 opacity-95">
              {time}
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-[9vh] inset-x-0 flex flex-col items-center gap-2"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover ring-1 ring-white/30 shadow-xl" />
            <div className="text-[15px] font-semibold">{name}</div>
            <div className="text-[12px] text-white/70">Click or press any key to unlock</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
